export const challengeInfo = {
  "simple-nft-example": {
    branchName: "challenge-0-simple-nft",
    label: "🚩 Challenge 0: 🎟 Simple NFT Example",
    disabled: false,
    description: "🎫 Create a simple NFT to learn basics of 🏗 scaffold-eth. You'll use 👷‍♀️ HardHat to compile and deploy smart contracts. Then, you'll use a template React app full of important Ethereum components and hooks. Finally, you'll deploy an NFT to a public network to share with friends! 🚀",
    previewImage: "assets/0.png",
  },
  "decentralized-staking": {
    branchName: "challenge-1-decentralized-staking",
    label: "🚩 Challenge 1: 🥩 Decentralized Staking App ",
    disabled: false,
    description: "🦸 A super power of Ethereum is allowing you, the builder, to create a simple set of rules that an adversarial group of players can use to work together. In this challenge, you create a decentralized application where users can coordinate a group funding effort. The users only have to trust the code.",
    previewImage: "assets/1.png",
  },
  "token-vendor": {
    branchName: "challenge-2-token-vendor",
    label: "🚩 Challenge 2: 🏵 Token Vendor",
    disabled: false,
    description: "🤖 Smart contracts are kind of like \"always on\" vending machines that anyone can access. Let's make a decentralized, digital currency (an ERC20 token). Then, let's build an unstoppable vending machine that will buy and sell the currency. We'll learn about the \"approve\" pattern for ERC20s and how contract to contract interactions work.",
    previewImage: "assets/2.png",
  },
  "learn-multisig": {
    branchName: "challenge-3-multi-sig",
    label: "🚩 Challenge 3: 👛 Multisig Wallet",
    disabled: true,
    description: "👩‍👩‍👧‍👧 Using a smart contract as a wallet we can secure assets by requiring multiple accounts to \"vote\" on transactions. The contract will keep track of transactions in an array of structs and owners will confirm or reject each one. Any transaction with enough confirmations can \"execute\".",
    previewImage: "assets/soon.png",
  },
  "minimum-viable-exchange": {
    branchName: "",
    label: "🚩 Challenge 4: ⚖️ Build a DEX",
    disabled: true,
    description: "💵 Build an exchange that swaps ETH to tokens and tokens to ETH. 💰 This is possible because the smart contract holds reserves of both assets and has a price function based on the ratio of the reserves. Liquidity providers are issued a token that represents their share of the reserves and fees...",
    previewImage: "assets/soon.png",
  },
  "learn-oracles": {
    branchName: "challenge-4-oracle",
    label: "🚩 Challenge 5: 🔮 Oracles",
    disabled: true,
    description: "🛰 Off-chain information can be critical for on-chain logic but it's complicated! 🎲 Random numbers are also tricky on a deterministic public blockchain... ",
    previewImage: "assets/soon.png",
  },
};

export const challengeSequence = [
  "simple-nft-example",
  "decentralized-staking",
  "token-vendor",
  "learn-multisig",
  "minimum-viable-exchange",
  "learn-oracles",
/*  "minimum-viable-exchange",
  "buyer-mints-nft",
  "create-stream",*/
];

const githubChallengesRepoBaseRawUrl = {
  js: "https://raw.githubusercontent.com/scaffold-eth/scaffold-eth-challenges",
  ts: "https://raw.githubusercontent.com/scaffold-eth/scaffold-eth-typescript-challenges",
};

export const getGithubChallengeReadmeUrl = (challengeId, version) =>
  `${githubChallengesRepoBaseRawUrl[version]}/${challengeInfo[challengeId].branchName}/README.md`;
