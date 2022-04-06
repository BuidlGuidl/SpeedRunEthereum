import { socials } from "../data/socials";

// NOTE: Actual regex is way more complex. The goal is to remove big problems.
const validateEmail = email => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// source: https://discord.com/developers/docs/resources/user
const validateDiscordUsername = username => {
  if (username.length < 2 || username.length > 32) {
    return false;
  }
  return !/(```|discord|everyone|here|[@:])/gi.test(username);
};

// NOTE: the goal is to remove big problems, but this will have false positives for some applications
const validateGenericUsername = username => {
  return /^[a-z0-9\-_.]+$/i.test(username);
};

const validatorNameToFunctionMap = {
  email: validateEmail,
  discord: validateDiscordUsername,
  generic: validateGenericUsername,
};

export const validateSocials = socialsObject => {
  const invalidSocials = [];
  Object.entries(socialsObject).forEach(([socialProvider, username]) => {
    const validatorName = socials[socialProvider].validator ?? "generic";
    const validatorFunction = validatorNameToFunctionMap[validatorName] ?? (() => false);
    const isValid = validatorFunction(username);
    if (!isValid) {
      invalidSocials.push([socialProvider, username]);
    }
  });
  return invalidSocials;
};
