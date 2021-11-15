/* eslint react/jsx-props-no-spreading: off */
import React from "react";
import { chakra, useColorModeValue, Code, Divider, Heading, Image, Link, UnorderedList, Text } from "@chakra-ui/react";

const MdBlockQuote = ({ children }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Text mb={4} pl={3} borderLeft="4px solid" borderColor={borderColor} color="red.500">
      {children}
    </Text>
  );
};

const MdCode = ({ children }) => {
  const codeFontColor = useColorModeValue("gray.700", "gray.200");
  const codeBgColor = useColorModeValue("gray.100", "gray.900");

  return (
    <Code borderRadius="md" px={2} py={1} color={codeFontColor} bg={codeBgColor}>
      {children}
    </Code>
  );
};

const MdH1 = ({ children }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Heading as="h1" size="xl" mt={6} mb={4} pb={2} borderBottom="1px solid" borderColor={borderColor}>
      {children}
    </Heading>
  );
};

const MdPre = ({ children }) => {
  const codeBgColor = useColorModeValue("gray.100", "gray.900");

  return (
    <chakra.pre display="block" borderRadius="md" mb={4} p={3} bg={codeBgColor} overflowX="auto">
      {children}
    </chakra.pre>
  );
};

const MdP = ({ children }) => {
  const secondaryFontColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Text color={secondaryFontColor} mb={4}>
      {children}
    </Text>
  );
};

export const chakraMarkdownComponents = {
  a: ({ href, children }) => (
    <Link href={href} color="blue.500">
      {children}
    </Link>
  ),
  blockquote: props => <MdBlockQuote {...props} />,
  code: props => <MdCode {...props} />,
  h1: props => <MdH1 {...props} />,
  h2: ({ children }) => (
    <Heading as="h2" size="lg" mt={6} mb={4}>
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size="md" mt={6} mb={4}>
      {children}
    </Heading>
  ),
  hr: () => <Divider my={6} borderBottomWidth="4px" />,
  img: props => <Image {...props} mb={4} />,
  pre: props => <MdPre {...props} />,
  p: props => <MdP {...props} />,
  ul: ({ children }) => <UnorderedList mb={4}>{children}</UnorderedList>,
};
