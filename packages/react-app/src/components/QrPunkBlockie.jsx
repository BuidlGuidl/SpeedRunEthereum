import React from "react";
import QR from "qrcode.react";
import Blockies from "react-blockies";

export default function QRPunkBlockie(props) {
  const punkSize = 112;

  const part1 = props.address && props.address.substr(2, 20);
  const part2 = props.address && props.address.substr(22);
  const x = parseInt(part1, 16) % 100;
  const y = parseInt(part2, 16) % 100;

  return (
    <div
      style={{
        transform: "scale(" + (props.scale ? props.scale : "1") + ")",
        transformOrigin: "50% 50%",
        margin: "auto",
        position: "absolute",
        left: "0",
        top: "0",
      }}
      onClick={() => {
        const el = document.createElement("textarea");
        el.value = props.address;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        const iconPunkSize = 40;
        // ToDo. Prop to control this (we might not want to copy when clicking the avatar)
        // ToDo. Show alert / notification message.
        console.log(
          <span style={{ position: "relative" }}>
            Copied Address
            <div style={{ position: "absolute", left: -60, top: -14 }}>
              <div style={{ position: "relative", width: iconPunkSize, height: iconPunkSize - 1, overflow: "hidden" }}>
                <img
                  alt="avatar punk"
                  src="/punks.png"
                  style={{
                    position: "absolute",
                    left: -iconPunkSize * x,
                    top: -iconPunkSize * y,
                    width: iconPunkSize * 100,
                    height: iconPunkSize * 100,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            </div>
          </span>,
        );
      }}
    >
      <div
        style={{
          position: "absolute",
          opacity: 0.5,
          left: 0,
          top: 0,
        }}
      >
        <Blockies seed={props.address.toLowerCase()} scale={11.5} />
      </div>

      <div style={{ position: "absolute", left: "-5px", top: "-20px" }}>
        <div style={{ position: "relative", width: punkSize, height: punkSize - 1, overflow: "hidden" }}>
          <img
            alt="avatar punk"
            src="/punks.png"
            style={{
              position: "absolute",
              left: -punkSize * x,
              top: -punkSize * y - 1,
              width: punkSize * 100,
              height: punkSize * 100,
              imageRendering: "pixelated",
              maxWidth: "none",
            }}
          />
        </div>
      </div>

      {props.withQr ? (
        <QR
          level="H"
          includeMargin={false}
          // ethereum:0x34aA3F359A9D614239015126635CE7732c18fDF3
          value={props.address ? "ethereum:" + props.address : ""}
          size={320}
          imageSettings={{ width: 105, height: 105, excavate: true }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
