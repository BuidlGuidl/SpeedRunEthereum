# 🏗 scaffold-directory

Scaffold-directory aims to provide a structured learning path for onboarding developers to Ethereum.

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
![Screen Shot 2021-11-20 at 9 51 20 AM](https://user-images.githubusercontent.com/9419140/142730794-cdaad88f-9ce4-4cb9-af61-7814b135e1db.png)


In a new terminal, start the frontend:

```bash

yarn start

```
![Screen Shot 2021-11-20 at 9 52 02 AM](https://user-images.githubusercontent.com/9419140/142730825-7a54360b-0c13-47c3-82d0-69bf429865ea.png)

At this point, you should have the app available at <http://localhost:3000>. By default, a locale JSON file (`packages/backend/local_database/local_db.json`) is used as the database. This is intended for testing and demo usage. In order to set it up for production usage, we provide a Firebase database adaptor. You can also easily create your own database adapter (check `packages/backend/services/db.js`).

---

## Firebase Setup (optional)

If you want to use Firebase (firestore) for data storage, you'll need to create a Firebase project and download the service account key configuration. You can generate and download the service account file at <https://console.cloud.google.com/> by 1.) select your Firebase project, 2.) go to IAM & Admin > Service Accounts, 3.) create a service account or click one that is already created, 4.) go to keys of that account, and 5.) Add Key > Create key and select a JSON key type.

Then you will have to create a `.env` file in `packages/backend/` with `DATABASE_SERVICE=firebase` and add the full path to the service account file in `GOOGLE_APPLICATION_CREDENTIALS` (see a sample here `packages/backend/.env.sample`).

Then re-run:

```bash

yarn backend

```
![Screen Shot 2021-11-20 at 9 51 20 AM](https://user-images.githubusercontent.com/9419140/142730794-cdaad88f-9ce4-4cb9-af61-7814b135e1db.png)

---

## Usage

📱 Open <http://localhost:3000> to see the app

![Screen Shot 2021-11-20 at 9 29 18 AM](https://user-images.githubusercontent.com/9419140/142730015-31d4b18c-8f4d-406f-a8da-84ba6742e308.png)

Connect your ethereum wallet by clicking "Connect Wallet" 

You need to register as a buidler next.

![Screen Shot 2021-11-20 at 9 29 00 AM](https://user-images.githubusercontent.com/9419140/142730187-75941ef8-15b3-406d-ab6b-e175c21e522f.png)

![Screen Shot 2021-11-20 at 9 37 36 AM](https://user-images.githubusercontent.com/9419140/142730302-63a60016-b7cb-4e69-a39b-93aa7a24f30e.png)

You will now see your home page after signing a message.

![Screen Shot 2021-11-20 at 9 36 31 AM](https://user-images.githubusercontent.com/9419140/142730252-a45af7af-98fd-4fd8-b639-4c478743163e.png)

You can view all buidler by selecting "Buidlers"

![Screen Shot 2021-11-20 at 9 39 33 AM](https://user-images.githubusercontent.com/9419140/142730356-84bbe5de-3854-4de3-8a4c-b2df7af49a3e.png)

You can view all buidls by selecting "Buidls"

![Screen Shot 2021-11-20 at 9 40 34 AM](https://user-images.githubusercontent.com/9419140/142730380-fa280ae7-3499-4d2e-a2d1-0371d156eced.png)

Submit a new buidl by selecting "Submit New Buidl"

![Screen Shot 2021-11-20 at 9 45 39 AM](https://user-images.githubusercontent.com/9419140/142730576-7568113c-245f-452e-9e4d-c9bffe8e28a3.png)

View your portfolio by selecting "Portfolio"

![Screen Shot 2021-11-20 at 9 41 48 AM](https://user-images.githubusercontent.com/9419140/142730432-50c58f70-5360-40a3-997d-1e58b747270e.png)

You can select "Start A Challenge" to get started

![Screen Shot 2021-11-20 at 9 43 04 AM](https://user-images.githubusercontent.com/9419140/142730492-207035e6-a68e-48de-8892-923c1bb942f4.png)

Select one of the challenges from the list and it will take you to the challenge home page where you can then get the Github link to start coding.

![Screen Shot 2021-11-20 at 9 43 42 AM](https://user-images.githubusercontent.com/9419140/142730511-5013b001-98ad-49f8-8904-452c0500f4ff.png)

When you have completed the challenge go ahead and select "Submit Challenge"

![Screen Shot 2021-11-20 at 9 45 39 AM](https://user-images.githubusercontent.com/9419140/142730576-7568113c-245f-452e-9e4d-c9bffe8e28a3.png)

You will enter the deployed url and your branch url to the code on Github.

---
![Screen Shot 2021-11-20 at 9 56 44 AM](https://user-images.githubusercontent.com/9419140/142731012-bad28be5-9e09-43a6-8443-eb3040a22fb6.png)

Admins can review challenge submissions in the "Review Challenges" tab (only visible to admins, you will see the Admin badge). The admin will check the check out the solution, optionally write a message to the submitter and approve or reject the submission by clicking the corresponding button and signing a message.
>In order to set an admin in the local database file, add `"role": "admin"` to the user objects in `packages/backend/local_database/local_db.json` and re-run `yarn backend`.

![Screen Shot 2021-11-20 at 9 38 49 AM](https://user-images.githubusercontent.com/9419140/142730333-b8c618a7-673d-468f-b861-6c8530c60b4b.png)

