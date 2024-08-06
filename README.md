# Getting Started with the project

[The project is deployed here](https://famous-stocks.web.app/), it uses React+tailwind+shadcn for frondend and firebase cloud functions with typescript and python on server.


## Project structure

### Frontend

ALl the frontend code is under `src` folder, there under `comp` folder is all the components of the app, inside `firebase.ts` is done all communication with firebase and under `auth` folder is the code for Authentification

### Backend

There are 2 languages in the backend, and there 2 cloud functions folder.
1. Typescript cloud functions: Located under `functions` folder
    It's responsible for all the client-server interaction of the app
2. Python cloud functions: Located under `python-functions`
    It's response for gathering stock trading data of the politiciants, there is a cron job runing everyday it's `main` function


## How to run the project locally

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

### 

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## To run the server locally

You will need to install [Firebase CLI](https://firebase.google.com/docs/cli)

### `firebase emulators:start`

This will start all the emulators.

### `ffirebase emulators:start --only functions`

Starts only the firebase functions, this is the recommened way to test the functions, they can be hit by postman or any other tool for this purpose.


