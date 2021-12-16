import React from "react";
import { HStack, Skeleton } from "@chakra-ui/react";
import QRPunkBlockie from "../QrPunkBlockie";

const SkeletonAddress = ({ fontSize, w }) => (
  <HStack spacing="20px">
    <Skeleton>
      <span style={{ verticalAlign: "middle" }}>
        <QRPunkBlockie withQr={false} address="0xf39F" w={w ?? 12.5} borderRadius="md" />
      </span>
    </Skeleton>
    <Skeleton>
      <span
        style={{
          verticalAlign: "middle",
          fontSize: fontSize ?? 28,
          fontWeight: "bold",
        }}
      >
        0xf39F
      </span>
    </Skeleton>
  </HStack>
);

export default SkeletonAddress;
