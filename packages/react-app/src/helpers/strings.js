// Update after merge.
export const VALID_BLOCK_EXPLORER_HOSTS = [
  "sepolia.etherscan.io",
  "sepolia-optimism.etherscan.io",
  "sepolia.arbiscan.io",
  "amoy.polygonscan.com",
  "sepolia.basescan.org",
];

export const ellipsizedAddress = longAddress =>
  longAddress ? `${longAddress.slice(0, 6)}...${longAddress.slice(-4)}` : "";

export const parseGithubReadme = text =>
  text
    .replace("# 🏗 scaffold-eth | 🏰 BuidlGuidl", "")
    .replace(/🏆.*?🍾/g, "")
    .replace(/🎖.*?🎖/g, "");

export const isValidUrl = urlText => {
  let url;

  try {
    url = new URL(urlText);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const isValidEtherscanTestnetUrl = urlText => {
  let url;

  try {
    url = new URL(urlText);
  } catch (_) {
    return false;
  }

  const { host } = url;

  return host && VALID_BLOCK_EXPLORER_HOSTS.includes(host);
};

export const isBoolean = val => typeof val === "boolean";
