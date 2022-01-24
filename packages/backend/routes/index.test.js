const log = console.log.bind({}); // get the original console.log to use here for debugging with `log()`
global.log = log;
global.console.log = jest.fn(); // skip server logs

const request = require("supertest");
const app = require("../index");
const { hardhatAddress1, hardhatSignatures, upgradeUserToAdmin, clearDb } = require("../utils/testingUtils");

/**
 * INFO: Tests will live here even though sources are spread in the ~/index.js
 * and ~/routes/... Ideally they'll all move here
 */

const signUpHardhatUser1 = async () => {
  const signUpResponse = await request(app)
    .post("/sign")
    .send({ signature: hardhatSignatures.login, address: hardhatAddress1 });
  return signUpResponse.body;
};
const submitChallenge = async () => {
  await request(app).post(`/challenges`).set({ address: hardhatAddress1 }).send({
    signature: hardhatSignatures.challengeSubmit,
    challengeId: "simple-nft-example",
    deployedUrl: "http://www.test-bar.com",
    contractUrl: "http://www.foo-bar-baz.com",
  });
};

beforeEach(() => {
  clearDb();
});

describe("The server responds to routes", () => {
  it("unknown routes should 404", async () => {
    const res = await request(app).get("/invalid-route-should-404");
    expect(res.status).toBe(404);
  });

  describe("/builders", () => {
    it("should be able to create users", async () => {
      const signMessageResponse = await request(app).get(`/sign-message?messageId=login&address=${hardhatAddress1}`);
      expect(signMessageResponse.status).toBe(200);
      expect(signMessageResponse.text).toBe(
        `I would like to register as a builder in speedrunethereum.com as ${hardhatAddress1}`,
      );

      const signatureResponse = await request(app)
        .post("/sign")
        .send({ signature: hardhatSignatures.login, address: hardhatAddress1 });
      expect(signatureResponse.status).toBe(200);
    });

    it("should return a list of builders", async () => {
      const hardhatUser = await signUpHardhatUser1();
      const res = await request(app).get("/builders");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([hardhatUser]);
    });

    it("should return a single builder", async () => {
      const hardhatUser = await signUpHardhatUser1();
      const res = await request(app).get(`/builders/${hardhatAddress1}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(hardhatUser);
    });
  });

  describe("/challenges", () => {
    it("should be able to submit a challenge as a builder", async () => {
      await signUpHardhatUser1();
      const res = await request(app).post(`/challenges`).set({ address: hardhatAddress1 }).send({
        signature: hardhatSignatures.challengeSubmit,
        challengeId: "simple-nft-example",
        deployedUrl: "http://www.test-bar.com",
        contractUrl: "http://www.foo-bar-baz.com",
      });
      expect(res.status).toBe(200);
    });

    it("should be able to accept a challenge submission as an admin", async () => {
      await signUpHardhatUser1();
      await submitChallenge();
      upgradeUserToAdmin(hardhatAddress1);

      const res = await request(app).patch(`/challenges`).set({ address: hardhatAddress1 }).send({
        signature: hardhatSignatures.challengeReviewAccept,
        challengeId: "simple-nft-example",
        userAddress: hardhatAddress1,
        newStatus: "ACCEPTED",
        comment: "foo bar",
      });
      expect(res.status).toBe(200);
    });

    it("should be able to reject a challenge submission as an admin", async () => {
      await signUpHardhatUser1();
      await submitChallenge();
      upgradeUserToAdmin(hardhatAddress1);

      const res = await request(app).patch(`/challenges`).set({ address: hardhatAddress1 }).send({
        signature: hardhatSignatures.challengeReviewReject,
        challengeId: "simple-nft-example",
        userAddress: hardhatAddress1,
        newStatus: "REJECTED",
        comment: "foo bar",
      });
      expect(res.status).toBe(200);
    });

    it("should not be able to accept or reject a challenge submission as a builder", async () => {
      await signUpHardhatUser1();
      await submitChallenge();
      // upgradeUserToAdmin(hardhatAddress1); // Don't upgrade to admin

      const acceptResponse = await request(app).patch(`/challenges`).set({ address: hardhatAddress1 }).send({
        signature: hardhatSignatures.challengeReviewAccept,
        challengeId: "simple-nft-example",
        userAddress: hardhatAddress1,
        newStatus: "ACCEPTED",
        comment: "foo bar",
      });
      expect(acceptResponse.status).toBe(401);
      expect(acceptResponse.text).toBe("Not a admin");

      const rejectResponse = await request(app).patch(`/challenges`).set({ address: hardhatAddress1 }).send({
        signature: hardhatSignatures.challengeReviewReject,
        challengeId: "simple-nft-example",
        userAddress: hardhatAddress1,
        newStatus: "REJECTED",
        comment: "foo bar",
      });
      expect(rejectResponse.status).toBe(401);
      expect(rejectResponse.text).toBe("Not a admin");
    });
  });
});
