'use client'
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { DataContext } from '@/context/DataProvider';
import Image from 'next/image';
import Settings from './settings';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import React from 'react';

export default function Expedition() {
  const { documentData, shipmentData } = useContext(DataContext);
  const totalWeight = shipmentData?.reduce((total, item) => total + (item?.peso ? parseFloat(item.peso) : 0), 0);
  const totalQuantity = shipmentData?.reduce((total, item) => total + (item?.quantidade ? parseFloat(item.quantidade) : 0), 0);
  const totalBalance = shipmentData?.reduce((total, item) => total + (item?.quantidadeEnviada ? parseFloat(item.quantidadeEnviada) : 0), 0);

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="of">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="of">Embarque</TabsTrigger>
                <TabsTrigger value="expedition">Expedição</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="of" className="flex flex-row justify-around gap-8">
              <Card x-chunk="dashboard-06-chunk-1" className="flex-grow">
                <CardHeader>
                  <CardTitle>Embarque</CardTitle>
                  <CardDescription>
                    Selecione a OF e os itens que serão embarcados
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Settings />
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}
                    OFs
                  </div>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-06-chunk-1" className="w-[850px] p-6 ">
                <CardHeader className="border-y-2 border-gray-400 p-0">
                  <div className="flex justify-between items-center h-10">
                    <div className='flex flex-col items-start'>
                      <Image src="/logo.png" alt="Logo" width="150" height="50" priority/>
                    </div>
                    <div className="flex flex-col items-center">
                      <CardDescription className="font-bold">JHONROB</CardDescription>
                      <CardDescription>Relação Item Embarque</CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <CardDescription className="text-xs">CNPJ: 02.053.879/0001-65</CardDescription>
                      <CardDescription className="text-xs">Página 001 De 001</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="border-2 rounded-lg border-gray-400 p-1 px-4 grid grid-cols-4 gap-2 items-start">
                  <div>
                    <CardDescription className="text-xs"><b>O.F:</b> {documentData?.documento || ''}</CardDescription>
                    <CardDescription className="text-xs"><b>Cliente:</b> {`(${documentData?.produto?.codigo || ''}) ${documentData?.pessoa?.descricao || ''}`}</CardDescription>
                    <CardDescription className="text-xs"><b>Produto:</b> {`(${documentData?.produto?.codigo || ''}) ${documentData?.produto?.descricao || ''}`}</CardDescription>
                  </div>
                  <div>
                    <CardDescription className="text-xs"><b>Quantidade:</b> {documentData?.selectedOfData?.amount || ''}</CardDescription>
                  </div>
                  <div>
                    <CardDescription className="text-xs"><b>Dt.Emissão:</b> {documentData?.dataCadastro ? new Date(documentData?.dataCadastro).toLocaleDateString() : ''}</CardDescription>
                    <CardDescription className="text-xs"><b>Dt.Entrega:</b> {documentData?.dataPrevEntrega ? new Date(documentData?.dataPrevEntrega).toLocaleDateString() : ''}</CardDescription>
                  </div>
                  <div className="flex items-center justify-center">
                    <CardDescription className="font-bold">Tag: {documentData?.selectedOfData?.tag || ''}</CardDescription>
                  </div>
                </CardContent>
                <CardDescription className="text-xs font-bold mt-5">{'Status = { P = Pendente, E = Embarcado, C = Cancelado, N = Não Retirado, R = Retirado }'}</CardDescription>
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
                  <TableRow className="bg-gray-200">
                      <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-6">Local: Expedição</TableHead>
                    </TableRow>
                  <TableBody className="border-b">
                    {shipmentData?.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-xs text-right py-1 px-1 border-r">{item?.quantidade ?? '-'}</TableCell>
                          <TableCell className="text-xs text-right py-1 px-1 border-r">{item?.quantidadeEnviada ?? '-'}</TableCell>
                          <TableCell className="text-xs text-right py-1 px-1 border-r">{item?.codigoProduto ?? '-'}</TableCell>
                          <TableCell className="text-xs text-center py-1 px-1 border-r">{item?.revisaoDesenho ?? '-'}</TableCell>
                          <TableCell className="text-xs text-start py-1 px-1 border-r">{item?.descricaoProduto ?? '-'}</TableCell>
                          <TableCell className="text-xs text-center py-1 px-1 border-r">{item?.unidade ?? '-'}</TableCell>
                          <TableCell className="text-xs text-start py-1 px-1 border-r">{item?.cor ?? '-'}</TableCell>
                          <TableCell className="text-xs text-center py-1 px-0 border-r">{item?.material ?? '-'}</TableCell>
                          <TableCell className="text-[10px] text-center py-1 px-0 border-r">  {item?.medidas ? item.medidas.split('x').map(num => parseFloat(num).toFixed(2)).join('x') : '-'}</TableCell>
                          <TableCell className="text-xs text-right py-1 px-1">{item?.peso ?? '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <CardFooter className="flex justify-between items-center p-0 mt-2">
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
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="expedition">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Expedição</CardTitle>
                  <CardDescription>
                    Lista de itens enviados para expedição
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}
                    itens
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}