declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      profileId?: string;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    profileId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    profileId?: string;
  }
}
