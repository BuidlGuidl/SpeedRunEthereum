const request = require("supertest");
const app = require("../index");

/**
 * INFO: Tests will live here even though sources are spread in the ~/index.js
 * and ~/routes/... Ideally they'll all move here
 */

describe("The server responds to routes", () => {
  it("unknown routes should 404", async () => {
    const res = await request(app).get("/invalid-route-should-404");
    expect(res.status).toBe(404);
  });

  describe("/builders", () => {
    it("should return a list of builders", async () => {
      const res = await request(app).get("/builders");
      expect(res.status).toBe(200);
      console.log(res);
    });
  });
});
