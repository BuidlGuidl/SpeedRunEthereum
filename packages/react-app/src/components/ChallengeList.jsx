import React from "react";
import { chakra } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";
import { challengeSequence, challengeInfo } from "../data/challenges";

export default function ChallengeList({ userChallenges }) {
  return (
    <chakra.ul listStyleType="none">
      {challengeSequence.map((challengeKeyOrGroup, idx) => {
        if (Array.isArray(challengeKeyOrGroup)) {
          // this steps has multiple challenges
          const challengeGroup = challengeKeyOrGroup;
          return (
            <li key={`challenge-group-step-${idx}`} style={{ marginTop: 8 }}>
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
