'use client'
import axios from 'axios';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { DataContext } from '@/context/DataProvider';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GroupedMultiSelect from '@/components/GroupedMultiSelect';
import AsyncSelect from 'react-select/async';
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

interface Item {
  codigoProduto: string;
  descricaoProduto: string;
  quantidade: number;
  quantidadeEnviada: number | null;
  descricaoProdutoPrimeiroNivel?: string;
}

interface DocumentData {
  documento: string;
  item: string;
  pessoa: {
    codigo: string;
    descricao: string;
  };
  dataCadastro: string;
  dataPrevEntrega: string;
  tag: string;
}

interface SelectedDocument {
  documento: string;
  item: string;
  produto: {
    codigo: string;
    descricao: string;
  } | null;
}

export default function Settings() {
  const { documentData, setSelectedData, shipmentData, setShipmentData, selectedDocument, setSelectedDocument } = useContext(DataContext);
  const { saveData } = useContext(ExpeditionContext);
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [shipmentItems, setShipmentItems] = useState<Item[]>([]);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  function groupByFirstLevelProduct(data: Item[]): { [key: string]: Item[] } {
    return data.reduce((groups, item) => {
      const group = (groups[item.descricaoProdutoPrimeiroNivel || ''] || []);
      group.push(item);
      return { ...groups, [item.descricaoProdutoPrimeiroNivel || '']: group };
    }, {} as { [key: string]: Item[] });
  }

  const groupedData = useMemo(() => groupByFirstLevelProduct(shipmentData), [shipmentData]);

  useEffect(() => {
    axios.get<DocumentData[]>('http://192.168.1.104:8089/api/v1/ordens-de-producao/ofs?page=0&size=100')
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar documentos:', error);
        setErrorMessages(prev => ({ ...prev, documents: 'Erro ao carregar documentos' }));
      });
  }, []);

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
              value: item,
              label: `Item:${item.item} - ${item.produto.codigo} - ${item.produto.descricao}`
            });
          } else {
            acc.push({
              label,
              options: [{
                value: item,
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

  const handleDocumentSelect = (selectedOption: any) => {
    if (selectedOption) {
      const selectedDocument = selectedOption.value;
      setSelectedDocument(selectedDocument);
      setSelectedData((prevData: any) => ({ ...prevData, documentData: selectedDocument }));
      
      axios.get<Item[]>(`http://192.168.1.104:8089/api/v1/itens-de-embarque?empresa=1&documento=${selectedDocument.documento}&item=${selectedDocument.item}`)
        .then(response => {
          const items = response.data.map(item => ({
            ...item,
            quantidadeEnviada: 0 // Inicializa a quantidadeEnviada com 0
          }));
          setShipmentItems(items);
          setShipmentData(items);
          setSelectedData((prevData: any) => ({ ...prevData, shipmentData: items }));
        })
        .catch(error => {
          console.error('Erro ao carregar itens de embarque:', error);
          setErrorMessages(prev => ({ ...prev, shipmentItems: 'Erro ao carregar itens de embarque' }));
        });
    }
  };

  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Ordens de produção</legend>
          <div className="grid gap-3">
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              placeholder="Selecione o documento"
              value={selectedDocument ? { 
                label: `OF:${selectedDocument.documento} - Cliente: ${selectedDocument.pessoa.descricao}`, 
                value: selectedDocument 
              } : null}
              onChange={handleDocumentSelect}
              formatGroupLabel={(data) => (
                <div className="text-gray-700 text-base font">
                  <strong>{data.label}</strong>
                </div>
              )}
            />
          </div>
          <div className="grid gap-3 max-w-[795px]">
            <Label htmlFor="product">Itens de Embarque</Label>
            <GroupedMultiSelect
              shipmentItems={shipmentItems}
              placeholder="Selecione os Items"
              value={Array.isArray(shipmentData) ? shipmentData.map(data => ({ value: data.codigoProduto, label: data.codigoProduto })) : []}
              onChange={(selectedOptions: any[]) => {
                const selectedCodes = selectedOptions.map((option: { value: any; }) => option.value);
                const selectedData = shipmentItems.filter(item => selectedCodes.includes(item.codigoProduto));
                setShipmentData(selectedData);
                setSelectedData((prevData: any) => ({ ...prevData, shipmentData: selectedData }));
                console.log("Dados enviados para DataContext: ", selectedData);
              }}
            />
          </div>
        </fieldset>
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Dados da OF</legend>
          <div className="grid gap-3">
            <Card>
              <CardHeader>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                {Object.entries(groupedData).map(([descricaoProdutoPrimeiroNivel, group], groupIndex) => {
                  return (
                    <React.Fragment key={groupIndex}>
                      <TableRow className="bg-gray-200">
                        <TableHead colSpan={3} className="text-start text-xs font-bold h-6">
                          <div className="w-[37rem] truncate">
                            {descricaoProdutoPrimeiroNivel}
                          </div>
                        </TableHead>
                      </TableRow>
                      {group.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-xs py-1 w-1/5">{item.codigoProduto}</TableCell>
                            <TableCell className="text-xs py-1 w-96" >{item.descricaoProduto}</TableCell>
                              <TableCell className="text-xs py-1 w-1/5">
                              <Input
                                className="h-6 text-xs"
                                id={`quantity-${item.codigoProduto}`}
                                type="number"
                                value={item.quantidadeEnviada !== null ? item.quantidadeEnviada : 0}
                                max={item.quantidade}
                                step="1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') e.preventDefault();
                                }}
                                onChange={(e) => {
                                  let newQuantity = parseInt(e.target.value);
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
                              {errorMessages[item.codigoProduto] && <span className="text-red-500">{errorMessages[item.codigoProduto]}</span>}
                              </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                  })}
                </TableBody>
              </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-1">
                <Button size="sm" variant="ghost" className="gap-1" onClick={(event) => {
                  event.preventDefault();
                  const dataToSave = { documentData, shipmentData };
                  saveData(dataToSave);
                  const { documento, item, produto } = documentData;
                  const savedProducts = shipmentData.map((product: { descricaoProduto: any; }) => product.descricaoProduto).join(', ');
                  toast({
                    title: "Dados enviados para Expedição",
                    description: `Documento: ${documento}, Item: ${item}, Produto: ${produto?.codigo} - ${produto?.descricao}`,
                    duration: 3000,
                  });
                }}>
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