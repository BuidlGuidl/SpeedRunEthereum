import React from "react";
import {
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
import { FormattedMessage, useIntl } from "react-intl";
import { CHALLENGE_SUBMISSION_STATUS } from "../helpers/constants";
import { chakraMarkdownComponents } from "../helpers/chakraMarkdownTheme";

const ChallengeStatusTag = ({ status, comment, autograding }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const intl = useIntl();

  let colorScheme;
  let label;

  switch (status) {
    case CHALLENGE_SUBMISSION_STATUS.ACCEPTED: {
      colorScheme = "green";
      label = intl.formatMessage({
        id: "accepted",
        defaultMessage: "Accepted",
      });
      break;
    }
    case CHALLENGE_SUBMISSION_STATUS.REJECTED: {
      colorScheme = "red";
      label = intl.formatMessage({ id: "rejected", defaultMessage: "Rejected" });
      break;
    }
    case CHALLENGE_SUBMISSION_STATUS.SUBMITTED: {
      label = intl.formatMessage({ id: "submitted", defaultMessage: "Submitted" });
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
          <Tooltip
            label={intl.formatMessage({
              id: "challengeStatusTag.see-comments",
              defaultMessage: "See comments",
            })}
          >
            <Button variant="ghost" onClick={onOpen} p={0} ml={1}>
              <QuestionOutlineIcon ml="2px" />
            </Button>
          </Tooltip>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="56rem">
          <ModalHeader>
            <FormattedMessage id="challengeStatusTag.modal.header" defaultMessage="Review feedback" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6} overflowX="auto">
            {autograding ? (
              <Box className="autograding-feedback">
                <style>
                  {`
                    .autograding-feedback a { text-decoration: underline; color: var(--chakra-colors-teal-500) }
                    .autograding-feedback p { margin-bottom: 10px; }
                    .autograding-feedback pre { white-space: pre-wrap; font-size: 12px; }
                  `}
                </style>
                <Box fontSize={14} whiteSpace="pre-wrap" dangerouslySetInnerHTML={{ __html: comment }} />
              </Box>
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
