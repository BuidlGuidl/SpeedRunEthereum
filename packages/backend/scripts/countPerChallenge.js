require("dotenv").config();
const db = require("../services/db");

const counts = {};
(async () => {
  const allBuilders = await db.findAllUsers();

  allBuilders.forEach(builder => {
    const challenges = builder.challenges;
    if (!challenges) return;

    const challengeKeys = Object.keys(challenges);

    challengeKeys.forEach(key => {
      if (challenges[key].status === "ACCEPTED") {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
  });

  console.log("Accepted challenges count for each challenge:", counts);
})();
