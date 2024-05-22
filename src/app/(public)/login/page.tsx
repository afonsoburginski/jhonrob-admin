// src/app/(public)/login/page.tsx
'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    console.log("handleSubmit foi chamada");
    event.preventDefault();
  
    try {
      console.log(`Fazendo login com usuário: ${login} e senha: ${senha}`);

      const response = await signIn('credentials', { 
        redirect: false, 
        login, 
        senha 
      });
  
      if (response.error) {
        throw new Error(response.error);
      }
  
      toast({
        title: "Sucesso!",
        description: (
          <div className=" flex justify-between item-center">
            Login realizado com sucesso.
            <CheckCircle className="ml-2 text-blue-500" size="24" />
          </div>
        )
      });
      setTimeout(() => {
        router.push("/");
      }, 200);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Falha no login. Por favor, tente novamente.",
      });
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card className="w-full max-w-sm">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Insira seu usuario e senha abaixo para entrar em sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="login">Usuario</Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder="Insira seu usuário"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Insira sua senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Entrar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}