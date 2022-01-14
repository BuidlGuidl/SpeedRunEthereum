const request = require("supertest");
const app = require("../index");
const { hardhatAddress1, hardhatSignatures } = require("../utils/testingUtils");

/**
 * INFO: Tests will live here even though sources are spread in the ~/index.js
 * and ~/routes/... Ideally they'll all move here
 */

const log = console.log.bind({}); // get the original console.log to use here if needed
global.console.log = jest.fn(); // skip server logs

describe("The server responds to routes", () => {
  it("unknown routes should 404", async () => {
    const res = await request(app).get("/invalid-route-should-404");
    expect(res.status).toBe(404);
  });

  describe("/builders", () => {
    let hardhatUser;
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
      hardhatUser = signatureResponse.body;
    });

    it("should return a list of builders", async () => {
      const res = await request(app).get("/builders");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([hardhatUser]);
    });

    it("should return a single builder", async () => {
      const res = await request(app).get(`/builders/${hardhatAddress1}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(hardhatUser);
    });
  });
});
