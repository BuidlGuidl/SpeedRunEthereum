import React from "react";
import { Alert, AlertIcon, VStack } from "@chakra-ui/react";

/**
 * message = {
 *   status: error | success | warning | info,
 *   text: string,
 *   fadeOut: number (ms)
 * }
 */
const FlashMessages = ({ messages }) => {
  // ToDo. Timeout.
  // ToDo. Close icon.

  if (!messages.length) {
    return null;
  }

  return (
    <VStack spacing={4} w="90%" maxW="500px" pos="fixed" top="10px" left="0" right="0" margin="auto">
      {messages.map(message => (
        <Alert status={message.status}>
          <AlertIcon />
          {message.text}
        </Alert>
      ))}
    </VStack>
  );
};

export default FlashMessages;
