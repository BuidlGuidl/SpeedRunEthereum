/* eslint react/jsx-props-no-spreading: off */
import React from "react";
import { chakra, Code, Divider, Heading, Image, Link, UnorderedList, Text, useToken } from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";

const MdBlockQuote = ({ children }) => {
  const { borderColor } = useCustomColorModes();
  return (
    <Text mb={4} pl={3} borderLeft="4px solid" borderColor={borderColor} color="red.500">
      {children}
    </Text>
  );
};

const MdCode = ({ children }) => {
  const { codeFontColor, codeBgColor } = useCustomColorModes();

  return (
    <Code borderRadius="md" px={2} py={1} color={codeFontColor} bg={codeBgColor}>
      {children}
    </Code>
  );
};

const MdH1 = ({ children }) => {
  const { borderColor } = useCustomColorModes();
  const { primaryFontColor } = useCustomColorModes();

  return (
    <Heading
      as="h1"
      size="xl"
      mt={6}
      mb={4}
      pb={2}
      borderBottom="1px solid"
      borderColor={borderColor}
      color={primaryFontColor}
    >
      {children}
    </Heading>
  );
};

const MdH2 = ({ children }) => {
  const { primaryFontColor } = useCustomColorModes();

  return (
    <Heading as="h2" size="lg" mt={6} mb={4} color={primaryFontColor}>
      {children}
    </Heading>
  );
};

const MdPre = ({ children }) => {
  const { codeBgColor } = useCustomColorModes();

  return (
    <chakra.pre display="block" borderRadius="md" mb={4} p={3} bg={codeBgColor} overflowX="auto">
      {children}
    </chakra.pre>
  );
};

const MdP = ({ children }) => {
  const { primaryFontColor } = useCustomColorModes();

  return (
    <Text color={primaryFontColor} mb={4}>
      {children}
    </Text>
  );
};

const MdLink = ({ href, children }) => {
  const { linkAltColor } = useCustomColorModes();

  return (
    <Link href={href} color={linkAltColor}>
      {children}
    </Link>
  );
};

const MdSummary = ({ children }) => {
  const { primaryFontColor } = useCustomColorModes();
  const [color] = useToken("colors", [primaryFontColor]);

  return <summary style={{ color, cursor: "pointer" }}>{children}</summary>;
};

const MdDetails = ({ children }) => {
  return <details style={{ marginBottom: 10 }}>{children}</details>;
};

export const chakraMarkdownComponents = {
  a: props => <MdLink {...props} />,
  blockquote: props => <MdBlockQuote {...props} />,
  code: props => <MdCode {...props} />,
  h1: props => <MdH1 {...props} />,
  h2: props => <MdH2 {...props} />,
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
  details: ({ children }) => <MdDetails>{children}</MdDetails>,
  summary: ({ children }) => <MdSummary>{children}</MdSummary>,
};
