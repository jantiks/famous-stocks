import pickle
import pandas as pd

# Path to your .pickle file
pickle_file_path = '/Users/tigran/Desktop/senator-filings-master/notebooks/senators.pickle'

# Open and load the .pickle file
with open(pickle_file_path, 'rb') as file:
    senators_data = pickle.load(file)

# Print the content to verify
df = pd.DataFrame(senators_data)

# Display the first few rows
print(df.head())

import pickle as pkl
import pandas as pd

with open(pickle_file_path, "rb") as f:
    object = pkl.load(f)
    
df = pd.DataFrame(object)
df.to_csv(r'file.csv')