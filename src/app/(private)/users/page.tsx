'use client'
import * as React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  ListFilter,
  File,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface Usuario {
  codigo: string
  nome: string
  login: string
  senha: string
  role: string
}

export default function Users() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [editRole, setEditRole] = useState<{ [codigo: string]: string }>({})

  useEffect(() => {
    axios.get("http://192.168.1.104:8089/api/v1/usuarios")
      .then(response => {
        setUsuarios(response.data)
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error)
      })
  }, [])

  const handleRoleChange = (codigo: string, role: string) => {
    setEditRole({ ...editRole, [codigo]: role })
  }

  const handleSaveRole = (codigo: string) => {
    const usuario = usuarios.find(u => u.codigo === codigo)
    if (usuario) {
      axios.patch(`http://192.168.1.104:8089/api/v1/usuarios/${codigo}`, {
        ...usuario,
        role: editRole[codigo]
      })
      .then(response => {
        // Atualiza a lista de usuários após a edição
        setUsuarios(usuarios.map(u => u.codigo === codigo ? { ...u, role: editRole[codigo] } : u))
      })
      .catch(error => {
        console.error("Erro ao atualizar usuário:", error)
      })
    }
  }

  return (
    <div className="flex h-[94.5vh] w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="users">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem>
                        Admin
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        User
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="users">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Usuários</CardTitle>
                    <CardDescription>
                      Lista de usuários registrados.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Login</TableHead>
                          <TableHead>Senha</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usuarios.map((usuario, index) => (
                          <TableRow key={index}>
                            <TableCell>{usuario.codigo}</TableCell>
                            <TableCell>{usuario.nome}</TableCell>
                            <TableCell>{usuario.login}</TableCell>
                            <TableCell>{usuario.senha}</TableCell>
                            <TableCell>
                              <input
                                type="text"
                                value={editRole[usuario.codigo] || usuario.role}
                                onChange={(e) => handleRoleChange(usuario.codigo, e.target.value)}
                                className="border p-1 rounded"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleSaveRole(usuario.codigo)}
                              >
                                Salvar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}