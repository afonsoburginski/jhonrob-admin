'use client'
import React, { useContext, useState } from 'react';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { FileText, MoreHorizontal } from 'lucide-react';
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

// Adicionando tipos para currentPage e itemsPerPage
interface ExpeditionTableProps {
  currentPage: number;
  itemsPerPage: number;
}

interface DocumentData {
  documento: string;
  item: string;
  produto: {
    codigo: string;
    descricao: string;
  };
}

interface ExpeditionData {
  documentData: DocumentData;
}

export function ExpeditionTable({ currentPage, itemsPerPage }: ExpeditionTableProps) {
  const { expeditionData, removeData } = useContext(ExpeditionContext);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = expeditionData.slice(startIndex, endIndex);

  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs font-bold h-6" style={{ width: '8%' }}>Documento</TableHead>
          <TableHead className="text-xs font-bold h-6" style={{ width: '5%' }}>Item</TableHead>
          <TableHead className="text-xs font-bold h-6" style={{ width: '8%' }}>Código do Produto</TableHead>
          <TableHead className="text-xs font-bold h-6" style={{ width: '64%' }}>Descrição do Produto</TableHead>
          <TableHead style={{ width: '5%' }}>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems && currentItems.map((data: ExpeditionData, index: number) => (
          data.documentData && data.documentData.produto && (
            <TableRow key={index}>
              <TableCell className="text-xs py-0 border-x" style={{ width: '8%' }}>{data.documentData.documento}</TableCell>
              <TableCell className="text-xs py-0 border-r" style={{ width: '5%' }}>{data.documentData.item}</TableCell>
              <TableCell className="text-xs py-0 border-r" style={{ width: '8%' }}>{data.documentData.produto.codigo}</TableCell>
              <TableCell className="text-xs py-0 border-r" style={{ width: '64%' }}>{data.documentData.produto.descricao}</TableCell>
              <TableCell className="text-xs py-0 border-r" style={{ width: '5%' }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => removeData(index)}>Delete</DropdownMenuItem>
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
