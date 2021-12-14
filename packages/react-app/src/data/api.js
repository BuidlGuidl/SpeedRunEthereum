import axios from "axios";

import { SERVER_URL as serverUrl } from "../constants";
import { getGithubChallengeReadmeUrl } from "./challenges";

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${serverUrl}/events`);
    return response.data;
  } catch (err) {
    console.log("error fetching events", err);
    return [];
  }
};

export const getChallengeEventsForUser = async userId => {
  try {
    const response = await axios.get(`${serverUrl}/events?user=${userId}&type=challenge.submit,challenge.review`);
    return response.data;
  } catch (err) {
    console.log(`error fetching events for user ${userId}.`, err);
    return [];
  }
};

export const getSubmitChallengeEventsForUserAndChallenges = async (userId, challengeIds) => {
  try {
    const response = await axios.get(
      `${serverUrl}/events?user=${userId}&type=challenge.submit&challengeId=${challengeIds.join(",")}`,
    );
    return response.data;
  } catch (err) {
    console.log(`error fetching submit challenge events for user ${userId}.`, err);
    return [];
  }
};

export const getDraftBuildEventsForBuildId = async buildId => {
  try {
    const response = await axios.get(`${serverUrl}/events?buildId=${buildId}&type=build.create`);
    return response.data;
  } catch (err) {
    console.log(`error fetching draft build events for user build ${buildId}.`, err);
    return [];
  }
};

export const getAllBuilds = async () => {
  try {
    const response = await axios.get(`${serverUrl}/builds`);
    return response.data;
  } catch (err) {
    console.log("error fetching builds", err);
    return [];
  }
};

export const getBuildSubmitSignMessage = async (address, buildUrl) => {
  try {
    const signMessageResponse = await axios.get(serverUrl + `/sign-message`, {
      params: {
        messageId: "buildSubmit",
        address,
        buildUrl,
      },
    });

    return JSON.stringify(signMessageResponse.data);
  } catch (error) {
    console.error(error);
    throw new Error(`Couldn't get the signature message`);
  }
};

export const postBuildSubmit = async (address, signature, { buildUrl, desc, image, name }) => {
  try {
    await axios.post(
      `${serverUrl}/builds`,
      {
        buildUrl,
        desc,
        image,
        name,
        signature,
      },
      {
        headers: {
          address,
        },
      },
    );
  } catch (error) {
    if (error.request?.status === 401) {
      const WrongRoleError = new Error(`User doesn't have builder role or higher`);
      WrongRoleError.status = 401;
      throw WrongRoleError;
    }
    console.error(error);
    throw new Error(`Couldn't save the build submission on the server`);
  }
};

export const getSubmittedChallenges = async address => {
  try {
    const response = await axios.get(`${serverUrl}/challenges`, {
      params: { status: "SUBMITTED" },
      headers: {
        address,
      },
    });
    return response.data;
  } catch (err) {
    console.log("error fetching submitted challenges", err);
    throw new Error("Error fetching submitted challenges");
  }
};

export const getChallengeReviewSignMessage = async (reviewerAddress, userAddress, challengeId, reviewType) => {
  try {
    const signMessageResponse = await axios.get(`${serverUrl}/sign-message`, {
      params: {
        messageId: "challengeReview",
        address: reviewerAddress,
        userAddress,
        challengeId,
        newStatus: reviewType,
      },
    });

    return JSON.stringify(signMessageResponse.data);
  } catch (error) {
    console.error(error);
    throw new Error(`Couldn't get the signature message`);
  }
};

export const patchChallengeReview = async (address, signature, { userAddress, challengeId, newStatus, comment }) => {
  try {
    await axios.patch(
      `${serverUrl}/challenges`,
      {
        userAddress,
        challengeId,
        comment,
        newStatus,
        signature,
      },
      {
        headers: {
          address,
        },
      },
    );
  } catch (error) {
    if (error.request?.status === 401) {
      const WrongRoleError = new Error(`User doesn't have builder role or higher`);
      WrongRoleError.status = 401;
      throw WrongRoleError;
    }
    console.error(error);
    throw new Error(`Couldn't save the build submission on the server`);
  }
};

export const getBuildReviewSignMessage = async (reviewerAddress, buildId, reviewType) => {
  try {
    const signMessageResponse = await axios.get(`${serverUrl}/sign-message`, {
      params: {
        messageId: "buildReview",
        address: reviewerAddress,
        buildId,
        newStatus: reviewType,
      },
    });

    return JSON.stringify(signMessageResponse.data);
  } catch (error) {
    console.error(error);
    throw new Error(`Couldn't get the signature message`);
  }
};

export const patchBuildReview = async (address, signature, { userAddress, buildId, newStatus }) => {
  try {
    await axios.patch(
      `${serverUrl}/builds`,
      { userAddress, buildId, newStatus, signature },
      {
        headers: {
          address,
        },
      },
    );
  } catch (error) {
    if (error.request?.status === 401) {
      const WrongRoleError = new Error(`User doesn't have builder role or higher`);
      WrongRoleError.status = 401;
      throw WrongRoleError;
    }
    console.error(error);
    throw new Error(`Couldn't save the build submission on the server`);
  }
};

export const getDraftBuilds = async address => {
  try {
    const response = await axios.get(`${serverUrl}/builds`, {
      params: { isDraft: true },
      headers: {
        address,
      },
    });
    return response.data;
  } catch (err) {
    console.log("error fetching draft builds", err);
    throw new Error("Error fetching draft builds");
  }
};

export const getChallengeReadme = async (challengeId, version) => {
  try {
    const response = await axios.get(getGithubChallengeReadmeUrl(challengeId, version));
    return response.data;
  } catch (err) {
    console.log("error fetching challenge README", err);
    throw new Error("error fetching challenge README");
  }
};
