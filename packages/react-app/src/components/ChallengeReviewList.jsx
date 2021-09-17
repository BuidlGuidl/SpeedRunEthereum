import React from "react";
import { List, Button } from "antd";
import { challengeInfo } from "../data/challenges";

export default function ChallengeReviewList({ challengeSubmissions, isLoading, approveClick, rejectClick }) {
  return (
    <List
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={challengeSubmissions}
      renderItem={challenge => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => approveClick(challenge.userAddress, challenge.id, "")}>
              Approve Button
            </Button>,
            <Button danger onClick={() => rejectClick(challenge.userAddress, challenge.id, "")}>
              Reject
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={challengeInfo[challenge.id].label}
            description={challengeInfo[challenge.id].description}
          />
          <div>
            <Button type="link" href={challenge.branchUrl} target="_blank">
              Code
            </Button>
            <Button type="link" href={challenge.deployedUrl} target="_blank">
              Live Demo
            </Button>
          </div>
        </List.Item>
      )}
    />
  );
}
