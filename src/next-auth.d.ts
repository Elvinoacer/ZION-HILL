import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];
      photo?: string | null;
      profileComplete?: boolean;
    };
  }

  interface User {
     roles?: string[];
     photo?: string | null;
     profileComplete?: boolean;
  }

  interface JWT {
    id: string;
    roles?: string[];
    photo?: string | null;
    profileComplete?: boolean;
  }
}
