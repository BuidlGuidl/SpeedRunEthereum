import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader title="🔏 scaffold directory" style={{ cursor: "pointer" }} />
    </a>
  );
}
