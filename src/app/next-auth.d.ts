// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      image: string;
      role?: string;
      empresa?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    empresa?: string;
  }
}