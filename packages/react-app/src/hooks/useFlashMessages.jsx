import { useContext } from "react";
import FlashMessagesContext from "../context/FlashMessagesContext";

export default function useFlashMessages() {
  return useContext(FlashMessagesContext).flashMessages;
}
