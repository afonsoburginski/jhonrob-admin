// Romaneio.tsx
'use client'
import React, { useContext, useState, useEffect } from 'react';
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ShipmentData {
  peso?: string;
  quantidade?: string;
  quantidadeEnviada?: string;
  codigoProdutoPrimeiroNivel?: string;
  descricaoProdutoPrimeiroNivel?: string;
  local?: string;
  [key: string]: any;
}

export default function Romaneio() {
  const { documentData, shipmentData } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const totalItems = shipmentData.length;

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

  const createPaginatedData = (groupedData: { [key: string]: ShipmentData[] }, itemsPerPage: number) => {
    const pages: { [key: string]: ShipmentData[] }[] = [];
    let currentPage: { [key: string]: ShipmentData[] } = {};
    let currentItemCount = 0;

    const keys = Object.keys(groupedData);

    keys.forEach((key) => {
      const items = groupedData[key];
      items.forEach(item => {
        if (currentItemCount === itemsPerPage) {
          pages.push(currentPage);
          currentPage = {};
          currentItemCount = 0;
        }
        currentPage[key] = currentPage[key] || [];
        currentPage[key].push(item);
        currentItemCount++;
      });
    });

    if (Object.keys(currentPage).length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  const getLocalLabel = (local: string) => {
    if (local === 'A') return 'Almoxarifado';
    if (local === 'E') return 'Expedição';
    return '';
  };

  const paginatedData = createPaginatedData(groupedShipmentData, itemsPerPage);
  const totalPages = paginatedData.length;

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

  useEffect(() => {
    const updatePage = () => {
      setCurrentPage(currentPage);
    };
    updatePage();
  }, [currentPage]);

  const currentGroupedData = paginatedData[currentPage - 1] || {};

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
      <Carousel className="w-full">
        <CarouselContent>
          {paginatedData.map((pageData, pageIndex) => (
            <CarouselItem key={pageIndex}>
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
                    <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-6">Local: {getLocalLabel(shipmentData[0]?.local)}</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-1.5" />
                  </TableRow>
                  {Object.entries(currentGroupedData).map(([codigoProdutoPrimeiroNivel, group], groupIndex) => {
                    const descricaoProdutoPrimeiroNivel = group[0].descricaoProdutoPrimeiroNivel;
                    return (
                      <React.Fragment key={groupIndex}>
                        <TableRow className="bg-gray-200">
                          <TableHead colSpan={10} className="w-full text-start text-xs font-bold h-6">({codigoProdutoPrimeiroNivel}) {descricaoProdutoPrimeiroNivel}</TableHead>
                        </TableRow>
                        {group.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-xs text-right py-1 px-1 border-r">{item?.quantidade ?? '-'}</TableCell>
                            <TableCell className={`text-xs text-right py-1 px-1 border-r ${item?.quantidadeEnviada ? 'bg-blue-100' : ''}`}>
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
                            <TableCell className="text-xs text-right py-1 px-1">{item?.peso ? parseFloat(item.peso).toFixed(2) : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevPage} className="cursor-pointer text-blue-500 hover:text-blue-700">Anterior</CarouselPrevious>
        <CarouselNext onClick={handleNextPage} className="cursor-pointer text-blue-500 hover:text-blue-700">Próxima</CarouselNext>
      </Carousel>
      <CardContent className="flex justify-items-start items-center p-0 mt-2">
        <CardDescription className="text-xs">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
