import axios from "axios";

import { SERVER_URL as serverUrl } from "../constants";

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${serverUrl}/events`);
    return response.data;
  } catch (err) {
    console.log("error fetching events", err);
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
