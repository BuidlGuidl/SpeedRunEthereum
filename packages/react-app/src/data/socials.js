import TelegramIcon from "../components/icons/TelegramIcon";
import TwitterIcon from "../components/icons/TwitterIcon";
import DiscordIcon from "../components/icons/DiscordIcon";
import GithubIcon from "../components/icons/GithubIcon";
import EmailIcon from "../components/icons/EmailIcon";
import IntagramIcon from "../components/icons/IntagramIcon";

export const socials = {
  telegram: {
    label: "Telegram",
    placeholder: "Your Telegram handle without the @",
    icon: TelegramIcon,
    getLink: value => `https://telegram.me/${value}`,
    weight: 0,
  },
  twitter: {
    label: "Twitter",
    placeholder: "Your Twitter username without the @",
    icon: TwitterIcon,
    getLink: value => `https://twitter.com/${value}`,
    weight: 1,
  },
  discord: {
    label: "Discord",
    placeholder: "Your Discord username#id",
    icon: DiscordIcon,
    getLink: _ => null,
    weight: 2,
  },
  github: {
    label: "GitHub",
    placeholder: "Your GitHub username",
    icon: GithubIcon,
    getLink: value => `https://github.com/${value}`,
    weight: 3,
  },
  email: {
    label: "E-mail",
    placeholder: "Your e-mail address",
    icon: EmailIcon,
    getLink: value => `mailto:${value}`,
    weight: 4,
  },
  instagram: {
    label: "Instagram",
    placeholder: "Your Instagram handle without the @",
    icon: IntagramIcon,
    getLink: value => `https://instagram.com/${value}`,
    weight: 5,
  },
};

export const bySocialWeight = (socialEntry1, socialEntry2) =>
  socials[socialEntry1[0]].weight - socials[socialEntry2[0]].weight;
