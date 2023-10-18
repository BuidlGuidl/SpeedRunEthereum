**IsabelSchoepsEthereum.org** [![Netlify Status]
![SRE Thumbnail](./packages/react-app/public/thumbnail.png)

Speed Run Ethereum aims to provide a structured learning path for onboarding developers to Ethereum.
with a framework for submitting challenges, get feedback from ethereum builders, and in the process unlocking new challenges and prof of completion.

## Project setup

Get the project code:

## Firebase Setup (optional)

If you want to use Firebase (firestore) for data storage, you'll need to create a Firebase project and download the service account key configuration. You can generate and download the service account file at <https://console.cloud.google.com/> by 1.) select your Firebase project, 2.) go to IAM & Admin > Service Accounts, 3.) create a service account or click one that is already created, 4.) go to keys of that account, and 5.) Add Key > Create key and select a JSON key type.

Then you will have to create a `.env` file in `packages/backend/` with `DATABASE_S` and add the full path to the service account file in `GOOGLE_APPLICATION_CREDENTIALS` (see a sample here `packages/backend/.env.sample`
