import React from "react";
import {
  chakra,
  Badge,
  Box,
  Button,
  Flex,
  Spacer,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";

const ChallengeStatusTag = ({ status, comment, autograding }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  let colorScheme;
  let label;

  switch (status) {
    case CHALLENGE_SUBMISSION_STATUS.ACCEPTED: {
      colorScheme = "green";
      label = "Accepted";
      break;
    }
    case CHALLENGE_SUBMISSION_STATUS.REJECTED: {
      colorScheme = "red";
      label = "Rejected";
      break;
    }
    case CHALLENGE_SUBMISSION_STATUS.SUBMITTED: {
      label = "Submitted";
      break;
    }
    default:
    // do nothing
  }

  return (
    <>
      <Flex align="center">
        <Box>
          <Badge borderRadius="xl" colorScheme={colorScheme} textTransform="none" py={0.5} px={2.5}>
            {label}
          </Badge>
        </Box>
        <Spacer />
        {status !== CHALLENGE_SUBMISSION_STATUS.SUBMITTED && comment && (
          <Tooltip label="See comment">
            <Button variant="ghost" onClick={onOpen} p={0} ml={1}>
              <QuestionOutlineIcon ml="2px" />
            </Button>
          </Tooltip>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="56rem">
          <ModalHeader>Review feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6} overflowX="auto">
            {autograding ? (
              <chakra.pre fontSize={14}>{comment}</chakra.pre>
            ) : (
              <ReactMarkdown components={ChakraUIRenderer(chakraMarkdownComponents)} remarkPlugins={[remarkBreaks]}>
                {comment}
              </ReactMarkdown>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChallengeStatusTag;
