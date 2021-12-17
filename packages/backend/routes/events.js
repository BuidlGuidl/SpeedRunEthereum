const express = require("express");
const db = require("../services/db");
const { queryParamsToConditions, validateEventsQueryParams } = require("../utils/events");

const router = express.Router();

/**
 * Valid query params:
 *  - type: to filter by a given type
 *  - time: to filter by a time range. Not implemented yet (TODO)
 *  - user: to filter by the user that caused the event. It's usually going to
 *    be the builder
 *  - challengeId: to filter by a given challenge
 *  - buildId: to filter by a given build
 *  - reviewAction: to filter by 'approve' or 'reject'. Only works when type is
 *    not present or includes challenge.review
 *  - reviewer: to filter by reviewer. Only works when type is
 *    not present or includes challenge.review
 *
 * All params accept a comma separated list of values, allowing to filter for
 * multiple values at once. They act as an OR.
 * Every query param condition must be met for a event to pass the filter. Each query param acts as an AND.
 */
router.get("/", async (req, res) => {
  console.log("/events");
  const query = req.query;
  const failingQueries = validateEventsQueryParams(query);
  if (failingQueries.length !== 0) {
    res.status(400).json({
      error: `The following query params are invalid: ${failingQueries
        .map(([name, value]) => `${name} (${value})`)
        .join(", ")}`,
    });
    return;
  }

  const conditions = queryParamsToConditions(query);

  let matchingEvents;
  if (Object.keys(conditions).length) {
    matchingEvents = await db.findEventsWhere({ conditions });
  } else {
    matchingEvents = await db.findAllEvents({ limit: query?.limit });
  }

  res.json(matchingEvents);
});

module.exports = router;
