import React from "react";
import { chakra } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";
import { challengeSequence, challengeInfo } from "../data/challenges";

export default function ChallengeList({ userChallenges }) {
  return (
    <chakra.ul listStyleType="none">
      {challengeSequence.map((challengeKeyOrGroup, idx) => {
        const step = idx + 1;
        if (Array.isArray(challengeKeyOrGroup)) {
          // this steps has multiple challenges
          const challengeGroup = challengeKeyOrGroup;
          return (
            <li key={`challenge-group-step-${step}`} style={{ marginTop: 8 }}>
              <strong>Challenge {step}:{" "}</strong>
              <chakra.ul listStyleType="none">
                {challengeGroup.map(challengeKey => (
                  <li key={challengeKey}>
                    <ChallengeCard
                      challengeInfo={challengeInfo[challengeKey]}
                      submissionInfo={userChallenges[challengeKey]}
                      challengeId={challengeKey}
                    />
                  </li>
                ))}
              </chakra.ul>
            </li>
          );
        }

        const challengeKey = challengeKeyOrGroup;
        return (
          <li key={challengeKey} style={{ marginTop: 8 }}>
            <strong>Challenge {step}: </strong>
            <ChallengeCard
              challengeInfo={challengeInfo[challengeKey]}
              submissionInfo={userChallenges[challengeKey]}
              challengeId={challengeKey}
            />
          </li>
        );
      })}
    </chakra.ul>
  );
}
