'use client'
import axios from 'axios';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { DataContext } from '@/context/DataProvider';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AsyncSelect from 'react-select/async';
import DocumentSelect from '@/components/DocumentSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

export default function Settings() {
  const { documentData, shipmentData, setSelectedData, setShipmentData, selectedDocument, setSelectedDocument } = useContext(DataContext);
  const { saveData } = useContext(ExpeditionContext);
  const { toast } = useToast();
  const [savedDocuments, setSavedDocuments] = useState<Set<string>>(new Set());
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  const { data: session } = useSession();

  function sortNumeric(a: string, b: string) {
    return parseInt(a, 10) - parseInt(b, 10);
  }

  function groupByFirstLevelProduct(data: Item[]): { [key: string]: Item[] } {
    const grouped = data.reduce((groups, item) => {
      const group = (groups[item.codigoProdutoPrimeiroNivel || ''] || []);
      group.push(item);
      return { ...groups, [item.codigoProdutoPrimeiroNivel || '']: group };
    }, {} as { [key: string]: Item[] });

    const sortedKeys = Object.keys(grouped).sort(sortNumeric);

    return sortedKeys.reduce((sortedGrouped, key) => {
      sortedGrouped[key] = grouped[key];
      return sortedGrouped;
    }, {} as { [key: string]: Item[] });
  }

  const groupedData = useMemo(() => groupByFirstLevelProduct(shipmentData), [shipmentData]);

  const downloadDrawing = async (codigoProduto: string, event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (!codigoProduto) return;
  
    event.preventDefault();
  
    try {
      const response = await axios.get(`http://192.168.1.104:8089/api/v1/desenhos-produto/${codigoProduto}/caminho-desenho`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const fileName = `${codigoProduto}.dwf`;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };
  
  const handleSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
  
    if (selectedDocument && savedDocuments.has(selectedDocument.documento)) {
      toast({
        title: "Erro",
        description: "Este documento já foi salvo.",
        duration: 3000,
        variant: "destructive",
      });
      console.log(`Tentativa de salvar documento duplicado: ${selectedDocument.documento}`);
      return;
    }
  
    const filteredShipmentData = shipmentData.filter((item: { quantidadeEnviada: number; }) => item.quantidadeEnviada > 0);
    const dataToSave = { documentData, shipmentData: filteredShipmentData };
    console.log('Dados a serem salvos:', dataToSave);
    saveData(dataToSave);
    setSavedDocuments(prev => new Set(prev).add(selectedDocument.documento));
    const { documento, item, produto } = documentData;
    toast({
      title: "Dados enviados para Expedição",
      description: `Documento: ${documento}, Item: ${item}, Produto: ${produto?.codigo} - ${produto?.descricao}`,
      duration: 3000,
    });
    console.log(`Documento salvo com sucesso: ${documento}, Item: ${item}, Produto: ${produto?.codigo} - ${produto?.descricao}`);
  };

  return (
    <div className="relative hidden flex-col items-start w-full md:flex">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-2">
          <legend className="-ml-1 px-1 text-sm font-medium">Ordens de produção</legend>
          <div className="grid gap-3">
            <DocumentSelect />
          </div>
        </fieldset>
        <fieldset className="grid gap-6 rounded-lg border p-2">
          <legend className="-ml-1 px-1 text-sm font-medium">Dados da OF</legend>
          <div className="grid gap-3">
            <Card>
              <CardHeader className="py-2">
                <div className="flex justify-between">
                  <div className="flex flex-col w-1/2">
                    <CardDescription><b>OF:</b> {documentData?.documento}</CardDescription>
                    <CardDescription><b>Cliente:</b> ({documentData?.pessoa?.codigo}) {documentData?.pessoa?.descricao}</CardDescription>
                  </div>
                  <div className="flex flex-col w-1/4">
                    <CardDescription><b>Dt.Emissão:</b> {new Date(documentData?.dataCadastro).toLocaleDateString()}</CardDescription>
                    <CardDescription><b>Dt.Entrega</b> {new Date(documentData?.dataPrevEntrega).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex flex-col w-1/6">
                    <CardDescription><b>Tag:</b> {documentData?.tag}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[47vh] min-h-[47vh]">
              <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs h-6">Código</TableHead>
                      <TableHead className="text-xs h-6">Produto</TableHead>
                      <TableHead className="text-xs h-6">Qtd</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border">
                    {Object.entries(groupedData).map(([codigoProdutoPrimeiroNivel, group], groupIndex) => {
                      const descricaoProdutoPrimeiroNivel = group[0].descricaoProdutoPrimeiroNivel;
                      return (
                        <React.Fragment key={groupIndex}>
                          <TableRow className="bg-gray-200">
                            <TableHead colSpan={3} className="text-start text-xs font-bold h-6">
                              <div className="w-[37rem] truncate">
                                ({codigoProdutoPrimeiroNivel}) {descricaoProdutoPrimeiroNivel}
                              </div>
                            </TableHead>
                          </TableRow>
                          {group.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-xs py-1 w-1/12 cursor-pointer" onClick={(event) => downloadDrawing(item.codigoProduto, event)}>
                                {item.codigoProduto}
                              </TableCell>
                              <TableCell className="text-xs py-1 w-96">{item.descricaoProduto}</TableCell>
                              <TableCell className="text-xs py-1 w-1/5">
                                <Input
                                  className="h-5 text-xs"
                                  id={`quantity-${item.codigoProduto}`}
                                  type="number"
                                  value={item.quantidadeEnviada !== null ? item.quantidadeEnviada : ''}
                                  max={item.quantidade}
                                  step="1"
                                  placeholder="0"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') e.preventDefault();
                                  }}
                                  onFocus={(e) => {
                                    if (e.target.value === '0') {
                                      e.target.value = '';
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === '') {
                                      e.target.value = '0';
                                    }
                                  }}
                                  onChange={(e) => {
                                    let newValue = e.target.value;

                                    // Remove leading zeros
                                    newValue = newValue.replace(/^0+(?=\d)/, '');

                                    let newQuantity = parseInt(newValue, 10);

                                    if (isNaN(newQuantity)) {
                                      newQuantity = 0;
                                    }

                                    if (newQuantity > item.quantidade) {
                                      setErrorMessages(prev => ({ ...prev, [item.codigoProduto]: 'Valor excedido' }));
                                      newQuantity = item.quantidade;
                                    } else {
                                      setErrorMessages(prev => {
                                        const { [item.codigoProduto]: _, ...rest } = prev;
                                        return rest;
                                      });
                                    }

                                    if (newQuantity < 0) {
                                      newQuantity = 0;
                                    }

                                    const updatedShipmentData = shipmentData.map((shipmentItem: { codigoProduto: string; }) => {
                                      if (shipmentItem.codigoProduto === item.codigoProduto) {
                                        return { ...shipmentItem, quantidadeEnviada: newQuantity };
                                      }
                                      return shipmentItem;
                                    });

                                    setShipmentData(updatedShipmentData);
                                    setSelectedData((prevData: any) => ({
                                      ...prevData,
                                      shipmentData: updatedShipmentData,
                                    }));
                                  }}
                                />
                                {errorMessages[item.codigoProduto] && <span className="text-xs text-red-500">{errorMessages[item.codigoProduto]}</span>}
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-1">
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1 w-56"
                  onClick={handleSave}
                >
                  <FileText className="h-4 w-4" />
                  Salvar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </fieldset>
      </form>
    </div>
  )
}