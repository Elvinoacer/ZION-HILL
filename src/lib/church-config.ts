import { StaticImageData } from "next/image";

// You can replace these with actual image imports
import PastorImage from "../../public/images/pastor.png";

interface ChurchTeamMember {
  name: string;
  role: string;
  image: StaticImageData | string;
}

interface ChurchConfig {
  name: string;
  fullName: string;
  logo: string; // Path to the logo
  mission: string;
  vision: string;
  coreValues: string[];
  team: ChurchTeamMember[];
  contact: {
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
  socials: {
    facebook: string;
    twitter: string;
    youtube: string;
    instagram: string;
  };
}

export const churchConfig: ChurchConfig = {
  name: "Kenya Assemblies of God (KAG)",
  fullName: "Kenya Assemblies of God - Central Church",
  logo: "/church-init.svg",
  mission:
    "To be a Christ-centered, Holy Spirit-filled, and mission-oriented church that transforms communities.",
  vision:
    "A transformed community of believers impacting the world for Christ.",
  coreValues: [
    "Faith",
    "Love",
    "Integrity",
    "Excellence",
    "Community",
    "Servanthood",
  ],
  team: [
    {
      name: "Rev. John Doe",
      role: "Senior Pastor",
      image: PastorImage,
    },
    {
      name: "Jane Smith",
      role: "Associate Pastor",
      image: PastorImage,
    },
    {
      name: "Peter Jones",
      role: "Youth Pastor",
      image: PastorImage,
    },
    {
      name: "Mary Williams",
      role: "Worship Leader",
      image: PastorImage,
    },
    {
      name: "David Brown",
      role: "Head of Ministries",
      image: PastorImage,
    },
  ],
  contact: {
    email: "info@kagcentral.org",
    phone: "+254 700 000 000",
    address: "123 Gospel Lane, Nairobi, Kenya",
    mapUrl: "https://goo.gl/maps/your-map-link",
  },
  socials: {
    facebook: "https://www.facebook.com/kagcentral",
    twitter: "https://twitter.com/kagcentral",
    youtube: "https://www.youtube.com/kagcentral",
    instagram: "https://www.instagram.com/kagcentral",
  },
};
