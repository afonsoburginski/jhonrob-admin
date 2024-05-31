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
  const itemsPerPage = 15;
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

  const openFileInAutoCAD = () => {
    const filePath = "/assets/010000006_00.dwg";
    const isAutoCADInstalled = true;

    if (isAutoCADInstalled) {
      window.open(filePath, "_blank");
    } else {
      alert("AutoCAD não encontrado. Abrindo no Bloco de Notas.");
      window.open(filePath, "_blank");
    }
  };

  const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
    if (inputValue.trim() === "") {
      callback([]);
      return;
    }

    const apiUrl = `http://192.168.1.104:8089/api/v1/ordens-de-producao/ofs?page=0&size=100000`;

    axios.get(apiUrl)
      .then(response => {
        const data = response.data;
        const filteredData = data.filter((item: any) =>
          item.documento.toString().includes(inputValue) ||
          item.pessoa?.descricao?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.produto.descricao.toLowerCase().includes(inputValue.toLowerCase())
        );

        const limitedData = filteredData.slice(0, 100);

        limitedData.sort((a: any, b: any) => a.item - b.item);

        const groupedOptions = limitedData.reduce((acc: any, item: any) => {
          const label = `OF:${item.documento} - Cliente: ${item.pessoa?.descricao}`;
          const existingGroup = acc.find((group: any) => group.label === label);

          if (existingGroup) {
            existingGroup.options.push({
              value: {
                documento: item.documento,
                codigoProduto: item.produto.codigo,
                item: item.item
              },
              label: `Item:${item.item} - ${item.produto.codigo} - ${item.produto.descricao}`
            });
          } else {
            acc.push({
              label,
              options: [{
                value: {
                  documento: item.documento,
                  codigoProduto: item.produto.codigo,
                  item: item.item
                },
                label: `Item:${item.item} - ${item.produto.codigo} - ${item.produto.descricao}`
              }]
            });
          }

          return acc;
        }, []);

        callback(groupedOptions);
      })
      .catch(error => {
        console.error('Erro ao carregar opções:', error);
        callback([]);
      });
  };
  
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="expedition">
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
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOptions}
                  defaultOptions
                  isMulti
                  formatGroupLabel={(data) => (
                    <div className="text-gray-700 text-base font">
                      <strong>{data.label}</strong>
                    </div>
                  )}
                />
                  <CardTitle>Expedição</CardTitle>
                  <div className="flex justify-between items-center">
                    <CardDescription>
                      Lista de itens enviados para expedição
                    </CardDescription>
                    <Button size="default" variant="outline" className="h-6" onClick={openFileInAutoCAD}>
                      Abrir
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
