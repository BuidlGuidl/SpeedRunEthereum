export const challengeInfo = {
  "simple-nft-example": {
    url: "https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example",
    label: "Simple NFT Example",
    disabled: false,
    description: "Build a simple NFT example",
    previewImage: "https://user-images.githubusercontent.com/526558/124386983-48965300-dcb3-11eb-88a7-e88ad6307976.png",
  },
  "decentralized-staking": {
    url: "https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking",
    label: "Decentralized Staking",
    disabled: false,
    description: "Build a decentralized staking",
  },
  "token-vendor": {
    url: "https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor",
    label: "Token Vendor",
    disabled: false,
    description: "Build a token vendor",
  },
  "minimum-viable-exchange": {
    url: "https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90",
    label: "Minimum Viable Exchange",
    disabled: false,
    description: "Build a minimum viable exchange",
  },
  "buyer-mints-nft": {
    url: "https://github.com/austintgriffith/scaffold-eth/tree/buyer-mints-nft",
    label: "Buyer Mints NFT",
    disabled: false,
    description: "Extend the buyer mints branch to have a price",
  },
  "learn-randomness": {
    url: "/tbd",
    label: "Learn Randomness",
    disabled: true,
    description: "tbd",
  },
  "learn-oracles": {
    url: "/tbd",
    label: "Learn Oracles",
    disabled: true,
    description: "tbd",
  },
  "learn-signatures": {
    url: "/tbd",
    label: "Learn Signatures",
    disabled: true,
    description: "tbd",
  },
  "learn-multisig": {
    url: "/tbd",
    label: "Learn Multisig",
    disabled: true,
    description: "tbd",
  },
  "sig-base-multisig": {
    url: "/tbd",
    label: "Build a Signature Base Multisig",
    disabled: true,
    description: "tbd",
  },
};

export const challengeSequence = [
  "simple-nft-example",
  "decentralized-staking",
  "token-vendor",
  ["minimum-viable-exchange", "buyer-mints-nft"],
  ["learn-randomness", "learn-oracles", "learn-signatures", "learn-multisig", "sig-base-multisig"],
];
