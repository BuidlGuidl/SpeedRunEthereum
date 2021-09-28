import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Typography, Space } from "antd";
import { challengeInfo } from "../data/challenges";
import ChallengeSubmission from "../components/ChallengeSubmission";

const { Title, Paragraph, Link: AntdLink } = Typography;

export default function ChallengeDetailView({ serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const history = useHistory();

  const challenge = challengeInfo[challengeId];
  if (!challenge) {
    // TODO implement a 404 page
    // this looks good: https://ant.design/components/result/#components-result-demo-404
    history.push("/404");
  }

  return (
    <div className="container">
      <Title>{challenge.label}</Title>
      <Space direction="vertical">
        <Link to="/home">{"<"}Back to challenges</Link>
        <Paragraph>{challenge.description}</Paragraph>

        <AntdLink href={challenge.url} target="_blank">
          Link to challenge
        </AntdLink>
        <ChallengeSubmission
          challenge={challenge}
          serverUrl={serverUrl}
          address={address}
          userProvider={userProvider}
        />
      </Space>
    </div>
  );
}
