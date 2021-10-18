export const ellipsizedAddress = longAddress =>
  longAddress ? `${longAddress.slice(0, 6)}...${longAddress.slice(-4)}` : "";
