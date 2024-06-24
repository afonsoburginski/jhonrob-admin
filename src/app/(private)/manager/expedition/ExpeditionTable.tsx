// exeditionTable.tsx
'use client'
import React, { useContext, useState } from 'react';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { Eye, MoreHorizontal } from 'lucide-react';
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
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import RomaneioDetalhes from './RomaneioDetalhes';

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

interface ShipmentData {
  caminhoDesenho?: string;
  codigoComponente?: string;
  codigoProduto: string;
  codigoProdutoPrimeiroNivel: string;
  descricaoComponente?: string;
  descricaoProduto: string;
  descricaoProdutoPrimeiroNivel: string;
  documento: string;
  empresa: number;
  item: string;
  local: string;
  material?: string;
  medidas?: string;
  peso: number;
  quantidade: number;
  quantidadeEnviada: number;
  revisaoDesenho: number;
  unidade: string;
}

interface ExpeditionData {
  documentData: DocumentData;
  shipmentData: ShipmentData[];
}

export function ExpeditionTable({ currentPage, itemsPerPage }: ExpeditionTableProps) {
  const { expeditionData, removeData } = useContext(ExpeditionContext);
  const [selectedShipmentData, setSelectedShipmentData] = useState<ShipmentData[]>([]);
  const [selectedDocumentData, setSelectedDocumentData] = useState<DocumentData | null>(null);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = expeditionData.slice(startIndex, endIndex);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const handleOpenDialog = (documentData: DocumentData, shipmentData: ShipmentData[]) => {
    setSelectedDocumentData(documentData);
    setSelectedShipmentData(shipmentData);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Table className="w-full border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-bold h-6" style={{ width: '8%' }}>Documento</TableHead>
            <TableHead className="text-xs font-bold h-6" style={{ width: '5%' }}>Item</TableHead>
            <TableHead className="text-xs font-bold h-6" style={{ width: '8%' }}>Código do Produto</TableHead>
            <TableHead className="text-xs font-bold h-6" style={{ width: '70%' }}>Descrição do Produto</TableHead>
            <TableHead className="text-xs font-bold h-6" style={{ width: '5%' }}>Detalhes</TableHead>
            <TableHead style={{ width: '5%' }}>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems && currentItems.map((data: ExpeditionData, index: number) => (
            data.documentData && data.documentData.produto && (
              <TableRow key={index}>
                <TableCell className="text-xs py-0 border-x" style={{ width: '8%' }}>
                  <p className="text-sm">{data.documentData.documento}</p>
                </TableCell>
                <TableCell className="text-xs py-0 border-r" style={{ width: '5%' }}>{data.documentData.item}</TableCell>
                <TableCell className="text-xs py-0 border-r" style={{ width: '8%' }}>{data.documentData.produto.codigo}</TableCell>
                <TableCell className="text-xs py-0 border-r" style={{ width: '70%' }}>{data.documentData.produto.descricao}</TableCell>
                <TableCell className="text-xs py-0 border-r" style={{ width: '5%' }}>
                  {isDesktop ? (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleOpenDialog(data.documentData, data.shipmentData)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[1050px]">
                        <DialogHeader>
                          <DialogTitle>Itens do Embarque</DialogTitle>
                          <DialogDescription>
                            Informações detalhadas dos itens do embarque.
                          </DialogDescription>
                        </DialogHeader>
                        <RomaneioDetalhes documentData={selectedDocumentData} shipmentData={selectedShipmentData} />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Drawer open={open} onOpenChange={setOpen}>
                      <DrawerTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleOpenDialog(data.documentData, data.shipmentData)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader className="text-left">
                          <DrawerTitle>Itens do Embarque</DrawerTitle>
                          <DrawerDescription>
                            Informações detalhadas dos itens do embarque.
                          </DrawerDescription>
                        </DrawerHeader>
                        <RomaneioDetalhes documentData={selectedDocumentData} shipmentData={selectedShipmentData} className="px-4" />
                        <DrawerFooter className="pt-2">
                          <DrawerClose asChild>
                            <Button variant="outline">Fechar</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </TableCell>
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
    </>
  );
}
