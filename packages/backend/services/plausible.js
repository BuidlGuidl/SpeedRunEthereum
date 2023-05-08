require("dotenv").config();
const axios = require("axios");

const PLAUSIBLE_EVENT_ENDPOINT = "https://plausible.io/api/event";

const trackPlausibleEvent = async (eventName, props, request) => {
  if (typeof jest !== "undefined") return;

  const payload = {
    domain: "speedrunethereum.com",
    name: eventName,
    url: "https://speedrunethereum.com",
    props,
  };

  const headers = {
    "User-Agent": request.headers["user-agent"],
    "X-Forwarded-For": request.headers["x-forwarded-for"] || request.socket.remoteAddress,
    "Content-Type": "application/json",
  };

  // We don't care about the response.
  return axios.post(PLAUSIBLE_EVENT_ENDPOINT, payload, {
    headers,
  });
};

module.exports = {
  trackPlausibleEvent,
};
