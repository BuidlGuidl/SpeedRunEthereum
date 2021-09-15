import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Typography, Space } from "antd";
import { challengeInfo } from "../data/challenges";

const { Title, Paragraph, Link: AntdLink } = Typography;

export default function ChallengeDetailView({ userObject }) {
  const { challengeId } = useParams();
  const history = useHistory();
  if (userObject == null || Object.keys(userObject).length === 0) {
    history.push("/");
  }

  const challenge = challengeInfo[challengeId];
  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  return (
    <div>
      <Title>{challenge.label}</Title>
      <Space direction="vertical">
        <Link to="/profile">{"<"}Back to challenges</Link>
        <Paragraph>{challenge.description}</Paragraph>

        <AntdLink href={challenge.url} target="_blank">
          Link to challenge
        </AntdLink>
      </Space>
    </div>
  );
}
