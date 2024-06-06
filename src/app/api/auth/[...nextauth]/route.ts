// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "Login", type: "text" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const { login, senha } = credentials ?? {};
        if (!login || !senha) {
          throw new Error("Missing login or senha");
        }
        const response = await axios.post<{ token: string }>(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`, {
          login,
          senha
        });
        if (response.status !== 200) {
          throw new Error("Invalid login or senha");
        }
        const userResponse = await axios.get<{ nome: string; login: string; role: string }[]>(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });
        if (userResponse.status !== 200) {
          throw new Error("Failed to fetch user");
        }
        const user = userResponse.data.find(user => user.login === login);
        if (!user) {
          throw new Error("Failed to fetch user");
        }
        return { id: user.login, name: user.nome, email: user.login, role: user.role, image: null } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
