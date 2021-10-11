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
