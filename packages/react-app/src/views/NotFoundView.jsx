import React from "react";
import { Box, Button, Container, Heading, Image, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundView() {
  const bgColor = useColorModeValue("sre.cardBackground", "sreDark.cardBackground");

  return (
    <Box bgColor={bgColor} py={10}>
      <Container maxW="container.lg" centerContent>
        <Image mb="5" src="assets/not_found.svg" maxW="300px" />
        <Heading mb="3">404</Heading>
        <Text
          mb="5"
          fontSize={{
            base: "lg",
            lg: "md",
          }}
          textAlign="center"
        >
          Sorry, the page you visited does not exist.
        </Text>
        <Link as={RouterLink} to="/">
          <Button>Back Home</Button>
        </Link>
      </Container>
    </Box>
  );
}
