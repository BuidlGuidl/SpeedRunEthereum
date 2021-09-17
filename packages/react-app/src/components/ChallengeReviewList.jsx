import React from "react";
import { List, Button, Input } from "antd";
import { challengeInfo } from "../data/challenges";

export default function ChallengeReviewList({ challengeSubmissions, isLoading, approveClick, rejectClick }) {
  const [commentMap, setCommentMap] = React.useState({});
  return (
    <List
      loading={isLoading}
      itemLayout="vertical"
      dataSource={challengeSubmissions}
      renderItem={challenge => (
        <List.Item
          actions={[
            <Button type="link" href={challenge.branchUrl} target="_blank">
              Code
            </Button>,
            <Button type="link" href={challenge.deployedUrl} target="_blank">
              Live Demo
            </Button>,
          ]}
          extra={
            <div>
              <Input.TextArea
                onChange={e => {
                  const currentCommentMap = commentMap;
                  currentCommentMap[challenge.userAddress + challenge.id] = e.target.value;
                  setCommentMap(currentCommentMap);
                }}
                value={commentMap[challenge.userAddress + challenge.id]}
                placeholder="Comment for builder"
                style={{ marginBottom: 10 }}
                rows={2}
              />
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() =>
                  approveClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
                }
              >
                Approve Button
              </Button>
              <Button
                danger
                onClick={() =>
                  rejectClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
                }
              >
                Reject
              </Button>
            </div>
          }
        >
          <List.Item.Meta
            title={challengeInfo[challenge.id].label}
            description={challengeInfo[challenge.id].description}
          />
        </List.Item>
      )}
    />
  );
}
