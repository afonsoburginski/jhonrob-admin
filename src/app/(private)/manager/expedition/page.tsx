// src/app/(private)/manager/expedition/Expedition.tsx
'use client'
import React, { useState, useContext } from 'react';
import { ExpeditionTable } from './ExpeditionTable';
import Settings from './settings';
import Romaneio from './Romaneio';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";

type Entrada = {
  codigoProduto: string;
  documentoOp: number;
  itemOp: number;
  empresaOp: number;
  quantidade: number;
};

export default function Expedition() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [gerarRomaneio, setGerarRomaneio] = useState(true);
  const [placa, setPlaca] = useState('0');
  const [mercado, setMercado] = useState('i');
  const itemsPerPage = 18;
  const { expeditionData, removeMultipleData } = useContext(ExpeditionContext);
  const totalItems = expeditionData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { toast } = useToast();

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

  const generateLogs = (data: any) => {
    console.log('Data to be sent:', JSON.stringify(data, null, 2));
  };

  const handleSend = async () => {
    setIsLoading(true); // Inicia o carregamento
    const entradas: Entrada[] = expeditionData.map((expedition: any) => {
      const { documentData, shipmentData } = expedition;
      return shipmentData.map((shipment: any) => ({
        codigoProduto: shipment.codigoProduto,
        documentoOp: parseInt(documentData.documento, 10),
        itemOp: parseInt(documentData.item, 10),
        empresaOp: parseInt(shipment.empresa, 10),
        quantidade: shipment.quantidadeEnviada,
      }));
    }).flat();

    const payload = { 
      entradas,
      gerarRomaneio,
      placa,
      mercado
    };

    try {
      generateLogs(payload);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/expedicao/entrada`, payload);
      console.log('Response:', response.data);

      // Exibir os toasts
      entradas.forEach((item: Entrada, index: number) => {
        setTimeout(() => {
          toast({
            title: `Documento OP: ${item.documentoOp}`,
            description: `Empresa OP: ${item.empresaOp}\nItem: ${item.itemOp} | Código: ${item.codigoProduto} | Quantidade: ${item.quantidade}`,
          });
        }, index * 500);
      });

      // Remover os itens enviados do contexto
      const sentIndices = expeditionData.map((_, index) => index);
      removeMultipleData(sentIndices);

    } catch (error) {
      console.error('Error sending data:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar os dados.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, entradas.length * 500);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:pt-4 ">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="boarding">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="boarding">Embarque</TabsTrigger>
                <TabsTrigger value="expedition">Expedição</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="boarding" className="flex flex-row justify-around gap-6">
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
              </Card>
              <Romaneio />
            </TabsContent>
            <TabsContent value="expedition">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Expedição</CardTitle>
                  <div className="flex justify-between items-center">
                    <CardDescription>
                      Lista de itens enviados para expedição
                    </CardDescription>
                    <Button
                      size="default"
                      variant="default"
                      className="h-10"
                      onClick={handleSend}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "ENVIAR"
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <ExpeditionTable currentPage={currentPage} itemsPerPage={itemsPerPage} />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</strong> de <strong>{totalItems}</strong> itens
                  </div>
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
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
