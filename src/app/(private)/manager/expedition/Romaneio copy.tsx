'use client'
import React, { useContext, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DataContext } from '@/context/DataProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

interface ShipmentData {
  peso?: string;
  quantidade?: string;
  quantidadeEnviada?: string;
  codigoProdutoPrimeiroNivel?: string;
  descricaoProdutoPrimeiroNivel?: string;
  [key: string]: any;
}

export default function Romaneio() {
  const { documentData, shipmentData } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const totalWeight = shipmentData?.reduce((total: number, item: ShipmentData) => total + (item?.peso ? parseFloat(item.peso) : 0), 0);
  const totalQuantity = shipmentData?.reduce((total: number, item: ShipmentData) => total + (item?.quantidade ? parseFloat(item.quantidade) : 0), 0);
  const totalBalance = shipmentData?.reduce((total: number, item: ShipmentData) => total + (item?.quantidadeEnviada ? parseFloat(item.quantidadeEnviada) : 0), 0);

  const groupedShipmentData = groupBy(shipmentData, 'codigoProdutoPrimeiroNivel');

  function groupBy(array: ShipmentData[], key: string) {
    return array.reduce((result: { [key: string]: ShipmentData[] }, currentValue: ShipmentData) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (tableContainerRef.current) {
        const containerHeight = tableContainerRef.current.clientHeight;
        const rowHeight = 24; // Assuming an average row height (adjust as necessary)
        const headerHeight = 24; // Assuming the height of the header (adjust as necessary)
        const availableHeight = containerHeight - headerHeight;
        const calculatedItemsPerPage = Math.floor(availableHeight / rowHeight);
        setItemsPerPage(calculatedItemsPerPage);
        setTotalPages(Math.ceil(shipmentData.length / calculatedItemsPerPage));
      }
    };

    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);

    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, [shipmentData.length]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentData = shipmentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Card x-chunk="dashboard-06-chunk-1" className="w-[900px] min-h-[105vh] max-h-[105vh] p-6">
      <CardHeader className="border-t-2 border-gray-400 p-0 mb-1">
        <div className="flex justify-between items-center h-10">
          <div className='flex flex-col items-start'>
            <Image src="/logo.png" alt="Logo" width={150} height={50} priority />
          </div>
          <div className="flex flex-col items-center">
            <CardDescription className="font-bold">JHONROB</CardDescription>
            <CardDescription>Relação Item Embarque</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <CardDescription className="text-xs">CNPJ: 02.053.879/0001-65</CardDescription>
            <CardDescription className="text-xs">Página {currentPage} De {totalPages}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="border-2 rounded-lg border-gray-400 p-0 px-4 grid grid-cols-4 gap-2 items-start">
        <div>
          <CardDescription className="text-xs"><b>O.F:</b> {documentData?.documento || ''} {documentData?.item || ''}</CardDescription>
          <CardDescription className="text-xs whitespace-nowrap"><b>Cliente:</b> {`(${documentData?.pessoa?.codigo || ''}) ${documentData?.pessoa?.descricao || ''}`}</CardDescription>
          <CardDescription className="text-xs whitespace-nowrap"><b>Produto:</b> {`(${documentData?.produto?.codigo || ''}) ${documentData?.produto?.descricao || ''}`}</CardDescription>
        </div>
        <div>
          <CardDescription className="text-xs"><b>Quantidade:</b>{String(documentData?.quantidade || 0)}</CardDescription>
        </div>
        <div>
          <CardDescription className="text-xs"><b>Dt.Emissão:</b> {documentData?.dataCadastro ? new Date(documentData?.dataCadastro).toLocaleDateString() : ''}</CardDescription>
          <CardDescription className="text-xs"><b>Dt.Entrega:</b> {documentData?.dataPrevEntrega ? new Date(documentData?.dataPrevEntrega).toLocaleDateString() : ''}</CardDescription>
        </div>
        <div className="flex items-center justify-center">
          <CardDescription className="font-bold">Tag: {documentData?.tag || ''}</CardDescription>
        </div>
      </CardContent>
      <CardDescription className="text-xs font-bold mt-5">{'Status = { P = Pendente, E = Embarcado, C = Cancelado, N = Não Retirado, R = Retirado }'}</CardDescription>
      <div ref={tableContainerRef} className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs text-right font-bold h-6 px-1">Qdt</TableHead>
              <TableHead className="text-xs text-right font-bold h-6 px-1">Saldo</TableHead>
              <TableHead className="text-xs text-right font-bold h-6 px-1">Código</TableHead>
              <TableHead className="text-xs text-center font-bold h-6 px-1">RD</TableHead>
              <TableHead className="text-xs text-start font-bold h-6 px-1">Produto</TableHead>
              <TableHead className="text-xs text-center font-bold h-6 px-1">UN</TableHead>
              <TableHead className="text-xs text-center font-bold h-6 px-1">Cor</TableHead>
              <TableHead className="text-xs text-center font-bold h-6 px-1">Material</TableHead>
              <TableHead className="text-xs text-center font-bold h-6 px-1">(AxLxC)</TableHead>
              <TableHead className="text-xs text-right font-bold h-6 pr-0">Peso tot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-gray-200">
              <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-6">Local: Expedição</TableHead>
            </TableRow>
            <TableRow>
              <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-1.5" />
            </TableRow>
            {Object.entries(groupBy(currentData, 'codigoProdutoPrimeiroNivel')).map(([codigoProdutoPrimeiroNivel, group], groupIndex) => {
              const descricaoProdutoPrimeiroNivel = group[0].descricaoProdutoPrimeiroNivel;
              return (
                <React.Fragment key={groupIndex}>
                  <TableRow className="bg-gray-200">
                    <TableHead colSpan={10} className="w-full text-start text-xs font-bold h-6">({codigoProdutoPrimeiroNivel}) {descricaoProdutoPrimeiroNivel}</TableHead>
                  </TableRow>
                  {group.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs text-right py-1 px-1 border-r">{item?.quantidade ?? '-'}</TableCell>
                      <TableCell className="text-xs text-right py-1 px-1 border-r">
                        {item?.quantidade ? parseFloat(item.quantidade) - parseFloat(item.quantidadeEnviada ?? '0') : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-right py-1 px-1 border-r">{item?.codigoProduto ?? '-'}</TableCell>
                      <TableCell className="text-xs text-center py-1 px-1 border-r">{item?.revisaoDesenho ?? '-'}</TableCell>
                      <TableCell className="text-xs text-start py-1 px-1 border-r">{item?.descricaoProduto ?? '-'}</TableCell>
                      <TableCell className="text-xs text-center py-1 px-1 border-r">{item?.unidade ?? '-'}</TableCell>
                      <TableCell className="text-xs text-start py-1 px-1 border-r">{item?.cor ?? '-'}</TableCell>
                      <TableCell className="text-[10px] text-center py-1 px-0 border-r min-w-16">{item?.material ?? '-'}</TableCell>
                      <TableCell className="text-[10px] text-center py-1 px-0 border-r">
                        {item?.medidas
                          ? item.medidas.split('x').map((num: string) => parseFloat(num).toFixed(2)).join('x')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-right py-1 px-1">{item?.peso ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <CardContent className="flex justify-between items-center p-0 mt-2">
        <div className="flex gap-1 w-24 px-2 justify-end">
          <div className="flex flex-col items-end gap-4" style={{ flex: '0 0 40px' }}>
            <CardDescription className="text-xs">{Math.round(totalQuantity)}</CardDescription>
            <CardDescription className="text-xs">{Math.round(totalQuantity)}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-4" style={{ flex: '0 0 40px' }}>
            <CardDescription className="text-xs">{Math.round(totalBalance)}</CardDescription>
            <CardDescription className="text-xs">{Math.round(totalBalance)}</CardDescription>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-5 mb-2 border-t px-1">
            <CardDescription className="text-xs font-bold">Total:</CardDescription>
            <CardDescription className="text-xs">{totalWeight.toFixed(2)}</CardDescription>
          </div>
          <div className="flex gap-5 border-t px-1">
            <CardDescription className="text-xs font-bold">Total Geral:</CardDescription>
            <CardDescription className="text-xs">{totalWeight.toFixed(2)}</CardDescription>
          </div>
        </div>
      </CardContent>
      <CardContent className="flex justify-items-start items-center p-0 mt-2">
        <CardDescription className="text-xs">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </CardDescription>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6" onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Página Anterior</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Próxima Página</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
