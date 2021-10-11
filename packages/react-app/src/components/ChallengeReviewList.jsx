import React from "react";
import { challengeInfo } from "../data/challenges";

export default function ChallengeReviewList({ challengeSubmissions, isLoading, approveClick, rejectClick }) {
  const [commentMap, setCommentMap] = React.useState({});

  return (
    <ul>
      {challengeSubmissions.map(challenge => (
        <li key={challenge.userAddress + challenge.id}>
          <div>
            <strong>{challengeInfo[challenge.id].label}</strong>
            <p>{challengeInfo[challenge.id].description}</p>
          </div>
          <a href={challenge.branchUrl} target="_blank" rel="noreferrer">
            Code
          </a>
          ,
          <a href={challenge.deployedUrl} target="_blank" rel="noreferrer">
            Live Demo
          </a>
          <div>
            <textarea
              onChange={e => {
                const value = e.target.value;
                setCommentMap(preCommentMap => {
                  const currentCommentMap = { ...preCommentMap };
                  currentCommentMap[challenge.userAddress + challenge.id] = value;
                  return currentCommentMap;
                });
              }}
              placeholder="Comment for builder"
              style={{ marginBottom: 10 }}
              rows={2}
            />
            <button
              type="button"
              disabled={isLoading}
              style={{ marginRight: 10 }}
              onClick={() =>
                approveClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
              }
            >
              Approve Button
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="danger"
              onClick={() =>
                rejectClick(challenge.userAddress, challenge.id, commentMap[challenge.userAddress + challenge.id])
              }
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
