import { StaticImageData } from "next/image";

// You can replace these with actual image imports
import PastorImage from "../../public/images/pastor.png";

interface ChurchTeamMember {
  name: string;
  role: string;
  image: StaticImageData | string;
}
//

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
  name: "Kenya Assemblies of God, Eldoret, Kasarani",
  fullName: "Kenya Assemblies of God - Central Church",
  logo: "/images/church-image.png",
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
    email: "thewckagkasaranield@gmail.com",
    phone: "0722 447848",
    address: "P. O. Box 9644 - 30100 Eldoret City",
    mapUrl: "https://maps.app.goo.gl/dZYSeg8TxNheYLnk7",
  },
  socials: {
    facebook: "https://www.facebook.com/WorshipCenterKAGKasaraniEld?mibextid=ZbWKwL",
    twitter: "https://twitter.com/kagcentral",
    youtube: "https://youtube.com/@theworshipcenterkagkasaran7523?si=ueuOyefyKVhK62PY",
    instagram: "https://www.instagram.com/kagcentral",
  },
};
