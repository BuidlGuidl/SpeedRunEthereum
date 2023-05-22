export const getChallengeInfo = intl => ({
  "simple-nft-example": {
    id: 0,
    branchName: "challenge-0-simple-nft",
    label: intl.formatMessage({
      id: "challenges.challenge-0-simple-nft.label",
      defaultMessage: "🚩 Challenge 0: 🎟 Simple NFT Example",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-0-simple-nft.description",
      defaultMessage:
        "🎫 Create a simple NFT to learn basics of 🏗 scaffold-eth. You'll use 👷‍♀️ HardHat to compile and deploy smart contracts. Then, you'll use a template React app full of important Ethereum components and hooks. Finally, you'll deploy an NFT to a public network to share with friends! 🚀",
    }),
    previewImage: "/assets/challenges/simpleNFT.svg",
    dependencies: [],
  },
  "decentralized-staking": {
    id: 1,
    branchName: "challenge-1-decentralized-staking",
    label: intl.formatMessage({
      id: "challenges.challenge-1-decentralized-staking.label",
      defaultMessage: "🚩 Challenge 1: 🥩 Decentralized Staking App ",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-1-decentralized-staking.description",
      defaultMessage:
        "🦸 A superpower of Ethereum is allowing you, the builder, to create a simple set of rules that an adversarial group of players can use to work together. In this challenge, you create a decentralized application where users can coordinate a group funding effort. The users only have to trust the code.",
    }),
    previewImage: "/assets/challenges/stakingToken.svg",
    dependencies: [],
  },
  "token-vendor": {
    id: 2,
    branchName: "challenge-2-token-vendor",
    label: intl.formatMessage({
      id: "challenges.challenge-2-token-vendor.label",
      defaultMessage: "🚩 Challenge 2: 🏵 Token Vendor",
    }),
    icon: "/assets/key_icon.svg",
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-2-token-vendor.description",
      defaultMessage:
        '🤖 Smart contracts are kind of like "always on" vending machines that anyone can access. Let\'s make a decentralized, digital currency (an ERC20 token). Then, let\'s build an unstoppable vending machine that will buy and sell the currency. We\'ll learn about the "approve" pattern for ERC20s and how contract to contract interactions work.',
    }),
    previewImage: "/assets/challenges/tokenVendor.svg",
    dependencies: [],
  },
  "buidl-guidl": {
    id: 4,
    branchName: "",
    label: intl.formatMessage({
      id: "challenges.buidl-guidl.label",
      defaultMessage: "Eligible to join 🏰️ BuidlGuidl",
    }),
    icon: "/assets/vault_icon.svg",
    // Not a challenge, just a checkpoint in the Challenge timeline.
    checkpoint: true,
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.buidl-guidl.description",
      defaultMessage:
        "The BuidlGuidl is a curated group of Ethereum builders creating products, prototypes, and tutorials to enrich the web3 ecosystem. A place to show off your builds and meet other builders. Start crafting your Web3 portfolio by submitting your DEX, Multisig or SVG NFT build.",
    }),
    previewImage: "/assets/bg.png",
    dependencies: ["simple-nft-example", "decentralized-staking", "token-vendor"],
    externalLink: {
      link: "https://buidlguidl.com/",
      claim: "Join the 🏰️ BuidlGuidl",
    },
  },
  "dice-game": {
    id: 3,
    branchName: "challenge-3-dice-game",
    label: intl.formatMessage({
      id: "challenges.challenge-3-dice-game.label",
      defaultMessage: "🚩 Challenge 3: 🎲 Dice Game",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-3-dice-game.description",
      defaultMessage:
        "🎰 Randomness is tricky on a public deterministic blockchain. The block hash is the result proof-of-work (for now) and some builders use this as a weak form of randomness.  In this challenge you will take advantage of a Dice Game contract by predicting the randomness in order to only roll winning dice!",
    }),
    previewImage: "/assets/challenges/diceGame.svg",
    dependencies: ["simple-nft-example", "decentralized-staking", "token-vendor"],
  },
  "minimum-viable-exchange": {
    id: 5,
    branchName: "challenge-4-dex",
    label: intl.formatMessage({
      id: "challenges.challenge-4-dex.label",
      defaultMessage: "⚖️ Build a DEX Challenge",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-4-dex.description",
      defaultMessage:
        "💵 Build an exchange that swaps ETH to tokens and tokens to ETH. 💰 This is possible because the smart contract holds reserves of both assets and has a price function based on the ratio of the reserves. Liquidity providers are issued a token that represents their share of the reserves and fees...",
    }),
    previewImage: "/assets/challenges/dex.svg",
    dependencies: ["simple-nft-example", "decentralized-staking", "token-vendor", "dice-game"],
  },
  "state-channels": {
    id: 9,
    branchName: "challenge-9-state-channels",
    label: intl.formatMessage({
      id: "challenges.challenge-9-state-channels.label",
      defaultMessage: "📺 A State Channel Application Challenge",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-9-state-channels.description",
      defaultMessage:
        "🛣️ The Ethereum blockchain has great decentralization & security properties but these properties come at a price: transaction throughput is low, and transactions can be expensive. This makes many traditional web applications infeasible on a blockchain... or does it?  State channels look to solve these problems by allowing participants to securely transact off-chain while keeping interaction with Ethereum Mainnet at a minimum.",
    }),
    previewImage: "/assets/challenges/state.svg",
    dependencies: ["simple-nft-example", "decentralized-staking", "token-vendor", "dice-game"],
  },
  "learn-multisig": {
    id: 6,
    branchName: "challenge-3-multi-sig",
    label: intl.formatMessage({
      id: "challenges.challenge-3-multi-sig.label",
      defaultMessage: "👛 Multisig Wallet Challenge",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-3-multi-sig.description",
      defaultMessage:
        '👩‍👩‍👧‍👧 Using a smart contract as a wallet we can secure assets by requiring multiple accounts to "vote" on transactions. The contract will keep track of transactions in an array of structs and owners will confirm or reject each one. Any transaction with enough confirmations can "execute".',
    }),
    previewImage: "/assets/challenges/multiSig.svg",
    // Challenge locked until the builder completed these challenges
    dependencies: ["simple-nft-example", "decentralized-staking", "token-vendor", "dice-game"],
    // Once the dependencies are completed, lock the challenge until
    // This will make the challenge to link to the externalLink, instead of the challenge detail view.
    externalLink: {
      link: "https://t.me/+zKllN8OlGuxmYzFh",
      claim: "Join the 👛 Multisig Build cohort",
    },
  },
  "nft-cohort": {
    id: 7,
    branchName: "challenge-5-svg-nft-cohort",
    label: intl.formatMessage({
      id: "challenges.challenge-5-svg-nft-cohort.label",
      defaultMessage: "🎁 SVG NFT 🎫 Building Cohort Challenge",
    }),
    disabled: false,
    description: intl.formatMessage({
      id: "challenges.challenge-5-svg-nft-cohort.description",
      defaultMessage:
        "🧙 Tinker around with cutting edge smart contracts that render SVGs in Solidity. 🧫 We quickly discovered that the render function needs to be public... 🤔 This allows NFTs that own other NFTs to render their stash. Just wait until you see an Optimistic Loogie and a Fancy Loogie swimming around in the same Loogie Tank!",
    }),
    previewImage: "/assets/challenges/dynamicSvgNFT.svg",
    // Challenge locked until the builder completed these challenges
    dependencies: ["simple-nft-example", "decentralized-staking", "token-vendor", "dice-game"],
    // Once the dependencies are completed, lock the challenge until
    // This will make the challenge to link to the externalLink, instead of the challenge detail view.
    externalLink: {
      link: "https://t.me/+mUeITJ5u7Ig0ZWJh",
      claim: "Join the 🎁 SVG NFT 🎫 Building Cohort",
    },
  },
});

const githubChallengesRepoBaseRawUrl = {
  js: "https://raw.githubusercontent.com/scaffold-eth/scaffold-eth-challenges",
  ts: "https://raw.githubusercontent.com/scaffold-eth/scaffold-eth-typescript-challenges",
};

export const getGithubChallengeReadmeUrl = (challengeId, version, intl) =>
  `${githubChallengesRepoBaseRawUrl[version]}/${getChallengeInfo(intl)[challengeId].branchName}/README.md`;
