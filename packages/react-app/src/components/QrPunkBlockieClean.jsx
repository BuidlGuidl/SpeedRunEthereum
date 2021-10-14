import React from "react";
import QR from "qrcode.react";
import Blockies from "react-blockies";

export default function QRPunkBlockieClean(props) {
  const punkSize = 112; // punk size with scale = 1
  const originalPunkSize = 24; // punk size pixels in the original file

  const part1 = props.address?.slice(2, 22);
  const part2 = props.address?.slice(-20);

  const x = parseInt(part1, 16) % 100;
  const y = parseInt(part2, 16) % 100;

  const scale = props.scale ?? 1;
  const punkRatio = punkSize / originalPunkSize;

  const QrComponent = () => {
    if (!props.withQr) {
      return null;
    }

    // TODO not implemented yet

    return (
      <QR
        level="H"
        includeMargin={false}
        // ethereum:0x34aA3F359A9D614239015126635CE7732c18fDF3
        value={props.address ? `ethereum:${props.address}` : ""}
        size={320}
        imageSettings={{ width: 105, height: 105, excavate: true }}
      />
    );
  };

  return (
    <button
      type="button"
      style={{
        width: punkSize * scale,
        height: punkSize * scale,
        margin: 0,
        display: "block",
      }}
      onClick={() => {
        navigator.clipboard
          .writeText(props.address)
          .then(() => {
            console.log("successfully copied address to clipboard", props.address);
          })
          .catch(err => {
            console.log("error copying address");
            console.log(err);
          });
        // ToDo. Prop to control this (we might not want to copy when clicking the avatar)
        // ToDo. Show alert / notification message.
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          id="blockie"
          style={{
            opacity: 0.4,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <Blockies seed={props.address.toLowerCase()} scale={(punkSize / 8) * scale} />
        </div>
        <div
          id="punk"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url(/punks.png)",
            backgroundSize: `${2400 * punkRatio * scale}px ${2400 * punkRatio * scale}px`,
            backgroundPosition: `${-punkSize * x * scale}px ${-punkSize * y * scale}px`,
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        />
      </div>
    </button>
  );
}
