export const ellipsizedAddress = longAddress =>
  longAddress ? `${longAddress.slice(0, 6)}...${longAddress.slice(-4)}` : "";

export const parseGithubReadme = text =>
  text
    .replace("# 🏗 scaffold-eth | 🏰 BuidlGuidl", "")
    .replace(/🏆.*?🍾/g, "")
    .replace(/🎖.*?🎖/g, "");
