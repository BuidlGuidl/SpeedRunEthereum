/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be extensible by any wrapper (chakra or other hoc)

import React from "react";
import Blockies from "react-blockies";

const PUNK_SIZE = 112; // punk size with scale = 1
const ORIGINAL_PUNK_SIZE = 24; // punk size pixels in the original file
const PUNK_SIZE_RATIO = PUNK_SIZE / ORIGINAL_PUNK_SIZE;

// TODO QrComponent not implemented yet

const Wrapper = ({ address, copyAddressOnClick, children, ...otherProps }) => {
  if (copyAddressOnClick) {
    return (
      <button
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
      </button>
    );
  }

  return <div {...otherProps}>{children}</div>;
};

/**
 * Cleaner version of QrPunkBlockie
 *
 * @param {{
 *  address: string,
 *  copyAddressOnClick: boolean,
 *  scale: number,
 *  width: number,
 *  withQr: boolean,
 * ...otherProps: any
 * }} props Some notes on the props:
 *  - `withQr` is not implemented yet
 *  - `width` is the desired size in pixels
 *  - Both `width` and `scale` are used for setting the dimensions. When
 *    conflicting, `width` has preference over `scale`. `scale` is only
 *    supported for QrPunkBlockie compatibility
 *
 * @returns React component
 */
export default function QRPunkBlockie({ address, copyAddressOnClick, scale: scaleArg, width, withQr, ...extraProps }) {
  const part1 = address?.slice(2, 22);
  const part2 = address?.slice(-20);

  const x = parseInt(part1, 16) % 100;
  const y = parseInt(part2, 16) % 100;

  const scale = width ? width / PUNK_SIZE : scaleArg ?? 1;

  const { style: extraStyle, ...otherExtraProps } = extraProps;

  return (
    <Wrapper
      style={{
        width: PUNK_SIZE * scale,
        height: PUNK_SIZE * scale,
        margin: 0,
        display: "block",
        position: "relative",
        overflow: "hidden",
        ...extraStyle,
      }}
      {...otherExtraProps}
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
