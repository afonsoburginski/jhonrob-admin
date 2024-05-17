'use client'
import React, { useContext } from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { FileText, MoreHorizontal } from 'lucide-react';

export function ExpeditionTable () {
  const { expeditionData } = useContext(ExpeditionContext);

  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Documento</TableHead>
          <TableHead className="font-bold">Item</TableHead>
          <TableHead className="font-bold">Código do Produto</TableHead>
          <TableHead className="font-bold">Descrição do Produto</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expeditionData && expeditionData.map((data, index) => (
          data.documentData && data.documentData.produto && (
            <TableRow key={index}>
              <TableCell className="w-10 py-0 border-x">{data.documentData.documento}</TableCell>
              <TableCell className="w-10 py-0 border-r">{data.documentData.item}</TableCell>
              <TableCell className="py-0 border-r">{data.documentData.produto.codigo}</TableCell>
              <TableCell className="py-0 border-r">{data.documentData.produto.descricao}</TableCell>
              <TableCell className="py-0 border-r">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
            </TableRow>
          )
        ))}
      </TableBody>
    </Table>
  )
}