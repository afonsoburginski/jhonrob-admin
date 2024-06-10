// expedition.tsx
'use client'
import React, { useState, useContext } from 'react';
import AsyncSelect from 'react-select/async';
import { ExpeditionTable } from './ExpeditionTable';
import Settings from './settings';
import Romaneio from './Romaneio';
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
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import axios from 'axios';

export default function Expedition() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const { expeditionData } = useContext(ExpeditionContext);
  const totalItems = expeditionData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const downloadFile = async () => {
    try {
      const codigo = '210004007';
      const response = await axios.get(`http://192.168.1.104:8089/api/v1/desenhos-produto/${codigo}/caminho-desenho`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const fileName = `${codigo}.dwf`;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };
  
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="boarding">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="boarding">Embarque</TabsTrigger>
                <TabsTrigger value="expedition">Expedição</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="boarding" className="flex flex-row justify-around gap-8">
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
              <Romaneio/>
            </TabsContent>
            <TabsContent value="expedition">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Expedição</CardTitle>
                  <div className="flex justify-between items-center">
                    <CardDescription>
                      Lista de itens enviados para expedição
                    </CardDescription>
                    <Button size="default" variant="outline" className="h-6" onClick={downloadFile}>
                      Download
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
  )
}
