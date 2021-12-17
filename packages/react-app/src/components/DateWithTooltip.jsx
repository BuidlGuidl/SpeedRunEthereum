import React from "react";
import moment from "moment";
import { Box, Tooltip } from "@chakra-ui/react";

const DateWithTooltip = ({ timestamp }) => {
  const timestampMoment = moment(timestamp);
  return (
    <Tooltip label={timestampMoment.format("YYYY-MM-DD, HH:mm")}>
      <Box cursor="pointer">{timestampMoment.fromNow()}</Box>
    </Tooltip>
  );
};

export default DateWithTooltip;
