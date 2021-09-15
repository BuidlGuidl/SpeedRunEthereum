import React from "react";
import { useHistory } from "react-router-dom";
import ChallengeCard from "../components/ChallengeCard";
import { challengeSequence, challengeInfo } from "../data/challenges";

export default function ProfileView({ userObject, userName }) {
  const history = useHistory();
  if (userObject == null || Object.keys(userObject).length === 0) {
    history.push("/");
  }

  return (
    <div>
      <h1>Welcome {userName}!</h1>
      <div style={{ textAlign: "start" }}>
        <ul>
          {challengeSequence.map((challengeKeyOrGroup, idx) => {
            const step = idx + 1;
            if (Array.isArray(challengeKeyOrGroup)) {
              // this steps has multiple challenges
              const challengeGroup = challengeKeyOrGroup;
              return (
                <li key={`challenge-group-step-${step}`} style={{ marginTop: 8 }}>
                  Challenge {step} (choose one):{" "}
                  <ul>
                    {challengeGroup.map(challengeKey => (
                      <li key={challengeKey}>
                        <ChallengeCard
                          challengeInfo={challengeInfo[challengeKey]}
                          submissionInfo={userObject.challenges[challengeKey]}
                          challengeId={challengeKey}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            const challengeKey = challengeKeyOrGroup;
            return (
              <li key={challengeKey} style={{ marginTop: 8 }}>
                Challenge {step}:{" "}
                <ChallengeCard
                  challengeInfo={challengeInfo[challengeKey]}
                  submissionInfo={userObject.challenges[challengeKey]}
                  challengeId={challengeKey}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
