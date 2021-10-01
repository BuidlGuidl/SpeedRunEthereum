// TODO we could check here if the payload is correct for the type
const createEvent = (type, payload, signature) => ({
  type,
  timestamp: new Date().getTime(),
  signature,
  payload,
});

module.exports = {
  createEvent,
};
