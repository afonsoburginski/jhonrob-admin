import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { AppearanceForm } from "./appearence-form"

const user = {
  name: "Nome do Usuário",
  image: "url_da_imagem_do_usuario",
  password: "senha_do_usuario",
  companyEmail: "email_da_empresa"
}

export default function Settings() {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Configurações</h1>
      </div>
      <div className="grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
        >
          <Link href="#" className="font-semibold text-primary">
            Perfil
          </Link>
          <Link href="#">Aparência</Link>
          <Link href="#">Configurações</Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Dados do Usuário</CardTitle>
              <CardDescription>
                Suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <Label className="font-medium">Imagem</Label>
                    <Input placeholder="Image URL" defaultValue={user.image} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <Label className="font-medium">Nome</Label>
                    <Input placeholder="User Name" defaultValue={user.name} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <Label className="font-medium">Senha</Label>
                    <Input placeholder="Password" defaultValue={user.password} type="password" />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <Label className="font-medium">Email da empresa</Label>
                  <Input placeholder="Company Email" defaultValue={user.companyEmail} />
                </div>
                <Label className="font-medium">Regra do usuário</Label>
                <RadioGroup defaultValue="user">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                </RadioGroup>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Salvar</Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-04-chunk-2">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}