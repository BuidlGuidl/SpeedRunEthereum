/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be extensible by any wrapper (chakra or other hoc)

import React from "react";
import Blockies from "react-blockies";
import { Box, Button } from "@chakra-ui/react";

const PUNK_SIZE = 112; // punk size with scale = 1
const ORIGINAL_PUNK_SIZE = 24; // punk size pixels in the original file
const PUNK_SIZE_RATIO = PUNK_SIZE / ORIGINAL_PUNK_SIZE;

// TODO QrComponent not implemented yet

const Wrapper = ({ address, copyAddressOnClick, children, ...otherProps }) => {
  if (copyAddressOnClick) {
    return (
      <Button
        type="button"
        onClick={() => {
          navigator.clipboard
            .writeText(address)
            .then(() => {
              console.log("successfully copied address to clipboard", address);
            })
            .catch(err => {
              console.log("error copying address");
              console.log(err);
            });
          // ToDo. Prop to control this (we might not want to copy when clicking the avatar)
          // ToDo. Show alert / notification message.
        }}
        {...otherProps}
      >
        {children}
      </Button>
    );
  }

  return <Box {...otherProps}>{children}</Box>;
};

/**
 * Chakra version of QrPunkBlockie
 *
 * @param {{
 *  address: string,
 *  copyAddressOnClick: boolean,
 *  scale: number,
 *  width: number,
 *  w: number,
 *  withQr: boolean,
 * ...otherProps: import("@chakra-ui/system").ChakraProps
 * }} props Some notes on the props:
 *  - `withQr` is not implemented yet
 *  - `w` is the size in Chakra's fashion. This is, w = 20 would be equivalent
 *    to width = 20 * 4 = 80. We don't check if the given value for `w` is
 *    actually a chakra dimension.
 *  - `width` is the desired size in pixels
 *  - All `w`, `width` and `scale` are used for setting the dimensions. When
 *    conflicting, `w` has preference over `width`, and they have preference
 *    over `scale`. `scale` is only supported for QrPunkBlockie compatibility
 *
 * @returns {import("@chakra-ui/system").ChakraComponent} Chakra component
 */
export default function BaseQRPunkBlockie({
  address,
  copyAddressOnClick,
  scale: scaleArg,
  width: widthArg,
  w,
  withQr,
  ...extraProps
}) {
  if (withQr) {
    console.warn("The chakra punk blockie has not implemented the qr yet");
  }
  const part1 = address?.slice(2, 22);
  const part2 = address?.slice(-20);

  const x = parseInt(part1, 16) % 100;
  const y = parseInt(part2, 16) % 100;

  const width = w ? w * 4 : widthArg;
  const scale = width ? width / PUNK_SIZE : scaleArg ?? 1;

  const { style: extraStyle, ...otherProps } = extraProps;

  return (
    <Wrapper
      style={{
        width: PUNK_SIZE * scale,
        height: PUNK_SIZE * scale,
        display: "block",
        position: "relative",
        overflow: "hidden",
        ...extraStyle,
      }}
      margin={0}
      {...otherProps}
    >
      <div
        style={{
          opacity: 0.4,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <Blockies seed={address.toLowerCase()} scale={(PUNK_SIZE / 8) * scale} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/punks.png)",
          backgroundSize: `${2400 * PUNK_SIZE_RATIO * scale}px ${2400 * PUNK_SIZE_RATIO * scale}px`,
          backgroundPosition: `${-PUNK_SIZE * x * scale}px ${-PUNK_SIZE * y * scale}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
    </Wrapper>
  );
}
