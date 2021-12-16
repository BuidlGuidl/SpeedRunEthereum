# 🏃‍♀️ Speed Run Ethereum [![Netlify Status](https://api.netlify.com/api/v1/badges/f925ecf3-0b4b-4545-8412-7b860c76b7f1/deploy-status)](https://app.netlify.com/sites/wonderful-kirch-4ab41a/deploys)


Speed Run Ethereum aims to provide a structured learning path for onboarding developers to Ethereum.

[🏃‍♀️Ethereum Dev Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c) with a framework for submitting challenges, get feedback from ethereum builders, and in the process unlocking new challenges and prof of completion.

---

## Project setup

Get the project code:

```bash
git clone git@github.com:moonshotcollective/scaffold-directory.git

cd scaffold-directory
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

---

## Usage

📱 Open <http://localhost:3000> to see the app

![image](https://user-images.githubusercontent.com/2156509/135258832-61bcc08f-68be-4cb8-9493-15a4e0e6be98.png)

List all builder profiles:

![image](https://user-images.githubusercontent.com/2156509/135259080-d01fb534-b5b5-4604-8feb-5f8263074af6.png)

View a builder profile:

![image](https://user-images.githubusercontent.com/2156509/135259288-8591d335-47a3-4216-b4bc-2ec47df132f5.png)

Connect your ethereum wallet by clicking "Connect Ethereum Wallet" -> Sign up / Sign in by clicking the "Sign a message to Sign up.." button and signing the message:

![image](https://user-images.githubusercontent.com/2156509/135259597-71b21540-4982-482d-ba9f-0abf2f379dc4.png)

This opens your profile view:

![image](https://user-images.githubusercontent.com/2156509/135261902-abb2e4d8-0d34-49a5-aaa1-52d9010ea3f3.png)

Submit the solution to a challenge by 1.) clicking a challenge in your profile view, 2.) complete the challenge according to the description (found by clicking the "Link to challenge"), 3.) past the URL with your solution and 4.) submit it by clicking the submit button and signing the message.

![image](https://user-images.githubusercontent.com/2156509/135262069-7e00ad55-effe-4409-8378-5ec0afee25ff.png)

Admins can review challenge submissions in the "Review Challenges" tab (only visible to admins). The admin will check the check out the solution, optionally write a message to the submitter and approve or reject the submission by clicking the corresponding button and signing a message.
>In order to set an admin in the local database file, add `"role": "admin"` to the user objects in `packages/backend/local_database/local_db.json` and re-run `yarn backend`.

![image](https://user-images.githubusercontent.com/2156509/135267093-4be16c3c-ddfb-4877-8329-cc78b82dcfae.png)
