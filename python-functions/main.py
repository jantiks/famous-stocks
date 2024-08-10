# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, scheduler_fn
from firebase_admin import initialize_app, storage, firestore, auth
import json
from bs4 import BeautifulSoup
import logging
import pandas as pd
import pickle
import requests
import time
from typing import Any, List, Optional
from datetime import datetime
import os
import re
# from senator-filings import run

initialize_app()
db = firestore.client()

#
#

BUCKET_NAME = "trades_20240726.json"
DESTINATION_FILE_PATH = "tmp/old_file.json"
NEW_DESTINATION_FILE_PATH = "tmp/new_file.json"

ROOT = 'https://efdsearch.senate.gov'
LANDING_PAGE_URL = '{}/search/home/'.format(ROOT)
SEARCH_PAGE_URL = '{}/search/'.format(ROOT)
REPORTS_URL = '{}/search/report/data/'.format(ROOT)

BATCH_SIZE = 100
RATE_LIMIT_SECS = 2

PDF_PREFIX = '/search/view/paper/'
LANDING_PAGE_FAIL = 'Failed to fetch filings landing page'

REPORT_COL_NAMES = [
    'tx_date',
    'file_date',
    'last_name',
    'first_name',
    'order_type',
    'ticker',
    'asset_name',
    'tx_amount'
]

LOGGER = logging.getLogger(__name__)


def add_rate_limit(f):
    def with_rate_limit(*args, **kw):
        time.sleep(RATE_LIMIT_SECS)
        return f(*args, **kw)
    return with_rate_limit


def _csrf(client: requests.Session) -> str:
    """ Set the session ID and return the CSRF token for this session. """
    landing_page_response = client.get(LANDING_PAGE_URL)
    assert landing_page_response.url == LANDING_PAGE_URL, LANDING_PAGE_FAIL

    landing_page = BeautifulSoup(landing_page_response.text, 'lxml')
    form_csrf = landing_page.find(
        attrs={'name': 'csrfmiddlewaretoken'}
    )['value']
    form_payload = {
        'csrfmiddlewaretoken': form_csrf,
        'prohibition_agreement': '1'
    }
    client.post(LANDING_PAGE_URL,
                data=form_payload,
                headers={'Referer': LANDING_PAGE_URL})

    if 'csrftoken' in client.cookies:
        csrftoken = client.cookies['csrftoken']
    else:
        csrftoken = client.cookies['csrf']
    return csrftoken


def senator_reports(client: requests.Session) -> List[List[str]]:
    """ Return all results from the periodic transaction reports API. """
    token = _csrf(client)
    idx = 0
    reports = reports_api(client, idx, token)
    all_reports: List[List[str]] = []
    while len(reports) != 0:
        all_reports.extend(reports)
        idx += BATCH_SIZE
        reports = reports_api(client, idx, token)
    return all_reports


def reports_api(
    client: requests.Session,
    offset: int,
    token: str
) -> List[List[str]]:
    """ Query the periodic transaction reports API. """
    login_data = {
        'start': str(offset),
        'length': str(BATCH_SIZE),
        'report_types': '[11]',
        'filer_types': '[]',
        'submitted_start_date': '07/14/2020 00:00:00',
        'submitted_end_date': '01/14/2021 00:00:00',
        'candidate_state': '',
        'senator_state': '',
        'office_id': '',
        'first_name': '',
        'last_name': '',
        'csrfmiddlewaretoken': token
    }
    LOGGER.info('Getting rows starting at {}'.format(offset))
    response = client.post(REPORTS_URL,
                           data=login_data,
                           headers={'Referer': SEARCH_PAGE_URL})
    return response.json()['data']


def _tbody_from_link(client: requests.Session, link: str) -> Optional[Any]:
    """
    Return the tbody element containing transactions for this senator.
    Return None if no such tbody element exists.
    """
    report_url = '{0}{1}'.format(ROOT, link)
    report_response = client.get(report_url)
    # If the page is redirected, then the session ID has expired
    if report_response.url == LANDING_PAGE_URL:
        LOGGER.info('Resetting CSRF token and session cookie')
        _csrf(client)
        report_response = client.get(report_url)
    report = BeautifulSoup(report_response.text, 'lxml')
    tbodies = report.find_all('tbody')
    if len(tbodies) == 0:
        return None
    return tbodies[0]


def txs_for_report(client: requests.Session, row: List[str]) -> pd.DataFrame:
    """
    Convert a row from the periodic transaction reports API to a DataFrame
    of transactions.
    """
    first, last, _, link_html, date_received = row
    link = BeautifulSoup(link_html, 'lxml').a.get('href')
    # We cannot parse PDFs
    if link[:len(PDF_PREFIX)] == PDF_PREFIX:
        return pd.DataFrame()

    tbody = _tbody_from_link(client, link)
    if not tbody:
        return pd.DataFrame()

    stocks = []
    for table_row in tbody.find_all('tr'):
        cols = [c.get_text() for c in table_row.find_all('td')]
        tx_date, ticker, asset_name, asset_type, order_type, tx_amount =\
            cols[1], cols[3], cols[4], cols[5], cols[6], cols[7]
        if asset_type != 'Stock' and ticker.strip() in ('--', ''):
            continue

        # Clean up 'ticker' and 'asset_name'
        tx_date = tx_date.replace('\n', '').replace('\r', '').strip()
        ticker = ticker.replace('\n', '').replace('\r', '').strip()
        asset_name = asset_name.replace('\n', '').replace('\r', '').strip()

        # Initialize option details
        option_type, strike_price, expiry = None, None, None

        # Check if 'asset_name' contains option information and extract it
        if 'Option Type:' in asset_name:
            option_info = re.search(r'Option Type:\s*(\w+)\s*Strike price:\s*\$(\d+\.\d+)\s*Expires:\s*(\d{2}/\d{2}/\d{4})', asset_name)
            if option_info:
                option_type, strike_price, expiry = option_info.groups()
                # Clean 'asset_name' to remove option details
                asset_name = asset_name.split('Option Type:')[0].strip()

        stocks.append([
            tx_date,
            date_received,
            last,
            first,
            order_type,
            ticker,
            asset_name,
            tx_amount,
            option_type,
            strike_price,
            expiry
        ])

    df = pd.DataFrame(stocks).rename(columns=dict(enumerate(REPORT_COL_NAMES + ['option_type', 'strike_price', 'expiry'])))

    return df

def sendEmail(email, trades_df):
    trades_df['politician'] = trades_df['first_name'] + ' ' + trades_df['last_name']
    
    trades_df = trades_df.rename(columns={
        'tx_date': 'submitted',
        'file_date': 'filed',
        'order_type': 'Transaction'
        'tx_amount': 'Amount'
    })
    
    trades_df = trades_df.drop(columns=['first_name', 'last_name', 'asset_name'])
    trades_df = trades_df.dropna(axis=1, how='all')
    trades_html = trades_df.to_html(index=False, border=0, justify='center', classes='dataframe')
    
    html = f"""
    <html>
    <head>
        <style>
            .dataframe {{
                font-family: Arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }}
            .dataframe td, .dataframe th {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
            }}
            .dataframe tr:nth-child(even){{background-color: #f2f2f2;}}
            .dataframe tr:hover {{background-color: #ddd;}}
            .dataframe th {{
                padding-top: 12px;
                padding-bottom: 12px;
                background-color: #4CAF50;
                color: white;
            }}
        </style>
    </head>
    <body>
        <p>Please find below the details of the matched trades:</p>
        {trades_html}
        <p>Best regards,<br>Insider stocks team</p>
    </body>
    </html>
    """
    
    mail_ref = db.collection('mail')

    # Create the email document
    email_doc = {
        'to': [email],
        'message': {
            'subject': "New trades happened",
            'html': html,
        }
    }

    # Add the document to the 'mail' collection
    result = mail_ref.add(email_doc)
    # Here you would normally send the email using an email-sending library like smtplib
    # For demonstration purposes, we just print the HTML
    print("EMAIL SENT, result:", result)


def sendEmailIfNeeded(differences_df):
    # Fetch all users from Firestore
    # users_ref = firestore_client.collection('users')
    # users = users_ref.stream()
    if (differences_df.empty):
        print("No differences to check")
        return

    users = db.collection('users').stream()

    for user in users:
        # user = auth.get_user(uid)
        userFromDb = auth.get_user(user.id)
        userEmail = userFromDb.email
        if userEmail is None:
            continue
        userDict = user.to_dict()
        notifications = userDict["notifications"]
        if (notifications is None):
            continue

        allMatchedItems = pd.DataFrame()
        for notification in notifications:
            print("asd notification", notification)
            firstName = notification["firstName"]
            lastName = notification["lastName"]
            matchedItems = differences_df[(differences_df['first_name'] == firstName) & (differences_df['last_name'] == lastName)]

            if not matchedItems.empty:
                allMatchedItems = pd.concat([allMatchedItems, matchedItems], ignore_index=True)
            else:
                print("ASD matches empty", userEmail)

        if not allMatchedItems.empty:
            sendEmail(userEmail, allMatchedItems)
            allMatchedItems = []

        # print("ASD USERDICT: ", user.to_dict())

    # if (not isinstance(notification_tokens, dict) or len(notification_tokens) < 1):
    #     print("There are no tokens to send notifications to.")
    #     return
    # print(f"There are {len(notification_tokens)} tokens to send notifications to.")

    # for index, row in differences_df.iterrows():
    #     politician_first_name = row['first_name']
    #     politician_last_name = row['last_name']
    #     for user in users:
    #         user_data = user.to_dict()
    #         notifications = user_data.get('notifications', [])
    #         for notification in notifications:
    #             if (notification.get('first_name') == politician_first_name and 
    #                 notification.get('last_name') == politician_last_name):
    #                 # Add your email sending logic here
    #                 print(f"Sending email to {user_data['email']} for transaction: {row}")


def main() -> pd.DataFrame:
    LOGGER.info('Initializing client')
    client = requests.Session()
    client.get = add_rate_limit(client.get)
    client.post = add_rate_limit(client.post)
    reports = senator_reports(client)
    all_txs = pd.DataFrame()
    for i, row in enumerate(reports):
        if i % 10 == 0:
            LOGGER.info('Fetching report #{}'.format(i))
            LOGGER.info('{} transactions total'.format(len(all_txs)))
        txs = txs_for_report(client, row)
        all_txs = pd.concat([all_txs, txs], ignore_index=True)

    # Generate a timestamp for the filename
    timestamp = datetime.now().strftime("%Y%m%d")
    filename_base = f"output/trades_{timestamp}"

    # Ensure the 'output' directory exists
    os.makedirs("output", exist_ok=True)

    # Save to CSV and JSON
    bucket = storage.bucket() # storage bucket
    blob = bucket.blob(BUCKET_NAME)
    blob.download_to_filename(DESTINATION_FILE_PATH)
    with open(DESTINATION_FILE_PATH, 'r') as f:
        json_data = json.load(f)
    bucket_df = pd.DataFrame(json_data)

    differences_df = pd.merge(all_txs, bucket_df, how='left', indicator=True)
    differences_df = differences_df[differences_df['_merge'] == 'left_only']
    differences_df = differences_df.drop(columns=['_merge'])

    sendEmailIfNeeded(differences_df)

    # Combine the differences with the original bucket data
    merged_df = pd.concat([differences_df, bucket_df]).drop_duplicates()

    merged_df['tx_date_parsed'] = pd.to_datetime(merged_df['tx_date'])

    merged_df = merged_df.sort_values(by='tx_date_parsed', ascending=False)

    merged_df = merged_df.drop(columns=['tx_date_parsed'])
    merged_df.to_json(NEW_DESTINATION_FILE_PATH, orient='records')

    blob.upload_from_filename(NEW_DESTINATION_FILE_PATH)
    merged_df.to_csv(f"{filename_base}.csv", index=False)
    merged_df.to_json(f"{filename_base}.json", orient='records')

    return all_txs

def run():
    log_format = '[%(asctime)s %(levelname)s] %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_format)
    senator_txs = main()

@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    # sendEmailIfNeeded([])
    run()
    return https_fn.Response("Hello world!")

@scheduler_fn.on_schedule(schedule="every day 00:00")
def accountcleanup(event: scheduler_fn.ScheduledEvent) -> None:
    run()