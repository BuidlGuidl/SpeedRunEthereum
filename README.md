# 🏃‍♀️ Speed Run Ethereum [![Netlify Status](https://api.netlify.com/api/v1/badges/f925ecf3-0b4b-4545-8412-7b860c76b7f1/deploy-status)](https://app.netlify.com/sites/wonderful-kirch-4ab41a/deploys)

![SRE Thumbnail](./packages/react-app/public/thumbnail.png)

Speed Run Ethereum aims to provide a structured learning path for onboarding developers to Ethereum.

[🏃‍♀️Ethereum Dev Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c) with a framework for submitting challenges, get feedback from ethereum builders, and in the process unlocking new challenges and prof of completion.

---

## Project setup

Get the project code:

```bash
git clone git@github.com:BuidlGuidl/SpeedRunEthereum.git

cd SpeedRunEthereum
```

Install dependencies:

```bash
yarn install
```

Start the backend service:

```bash
yarn backend
```

In a new terminal, start the frontend:

```bash
yarn start
```

At this point, you should have the app available at <http://localhost:3000>. By default, a locale JSON file (`packages/backend/local_database/local_db.json`) is used as the database. This is intended for testing and demo usage. In order to set it up for production usage, we provide a Firebase database adaptor. You can also easily create your own database adapter (check `packages/backend/services/db.js`).

---

## Firebase Setup (optional)

If you want to use Firebase (firestore) for data storage, you'll need to create a Firebase project and download the service account key configuration. You can generate and download the service account file at <https://console.cloud.google.com/> by 1.) select your Firebase project, 2.) go to IAM & Admin > Service Accounts, 3.) create a service account or click one that is already created, 4.) go to keys of that account, and 5.) Add Key > Create key and select a JSON key type.

Then you will have to create a `.env` file in `packages/backend/` with `DATABASE_SERVICE=firebase` and add the full path to the service account file in `GOOGLE_APPLICATION_CREDENTIALS` (see a sample here `packages/backend/.env.sample`).

Then re-run:

```bash
yarn backend
```
