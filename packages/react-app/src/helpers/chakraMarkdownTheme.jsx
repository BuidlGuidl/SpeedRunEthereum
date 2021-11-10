/* eslint react/jsx-props-no-spreading: off */
import React from "react";
import { chakra, Code, Heading, Image, Link, Text } from "@chakra-ui/react";

export const chakraMarkdownComponents = {
  a: ({ href, children }) => (
    <Link href={href} color="blue.500">
      {children}
    </Link>
  ),
  blockquote: ({ children }) => (
    <Text mb={4} pl={3} borderLeft="4px solid" borderColor="gray.200">
      {children}
    </Text>
  ),
  code: ({ children }) => (
    <Code borderRadius="md" px={2} py={1}>
      {children}
    </Code>
  ),
  h1: ({ children }) => (
    <Heading as="h1" size="2xl" mt={6} mb={4} pb={2} borderBottom="1px solid" borderColor="gray.100">
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size="xl" mt={6} mb={4}>
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size="lg" mt={6} mb={4}>
      {children}
    </Heading>
  ),
  img: props => <Image {...props} mb={4} />,
  pre: ({ children }) => (
    <chakra.pre display="block" borderRadius="md" mb={4} p={3} bg="gray.100">
      {children}
    </chakra.pre>
  ),
  p: ({ children }) => (
    <Text color="gray.700" mb={4}>
      {children}
    </Text>
  ),
};
