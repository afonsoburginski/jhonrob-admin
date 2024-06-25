import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

type CustomUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  empresa: string;
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "Login", type: "text" },
        senha: { label: "Senha", type: "password" },
        empresa: { label: "Empresa", type: "text" }
      },
      async authorize(credentials) {
        const { login, senha, empresa } = credentials ?? {};
        if (!login || !senha || !empresa) {
          throw new Error("Missing login, senha, or empresa");
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
        return { id: user.login, name: user.nome, email: user.login, role: user.role, image: null, empresa } as CustomUser; // Include empresa in the returned user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role;
        token.empresa = (user as CustomUser).empresa; // Include empresa in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = (token as { role: string }).role;
        session.user.empresa = (token as { empresa: string }).empresa; // Include empresa in the session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
