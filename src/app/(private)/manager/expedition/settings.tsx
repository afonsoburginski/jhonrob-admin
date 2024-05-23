'use client'
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { DataContext } from '@/context/DataProvider';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GroupedMultiSelect from '@/components/GroupedMultiSelect';
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

export default function Settings() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [shipmentItems, setShipmentItems] = useState([]);
  const { documentData, setSelectedData, shipmentData, setShipmentData } = useContext(DataContext);
  const { saveData } = useContext(ExpeditionContext);
  const { toast } = useToast();

  function groupByFirstLevelProduct(data) {
    return data.reduce((groups, item) => {
      const group = (groups[item.codigoProdutoPrimeiroNivel] || []);
      group.push(item);
      groups[item.codigoProdutoPrimeiroNivel] = group;
      return groups;
    }, {});
  }

  const groupedData = groupByFirstLevelProduct(shipmentData);

  useEffect(() => {
    axios.get('http://192.168.1.104:8089/api/v1/ordens-de-producao/ofs?page=0&size=999')
      .then(response => {
        setDocuments(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedDocument) {
      axios.get(`http://192.168.1.104:8089/api/v1/itens-de-embarque?empresa=1&documento=${selectedDocument.documento}&item=${selectedDocument.item}`)
        .then(response => {
          setShipmentItems(response.data);
        });
    }
  }, [selectedDocument]);

  useEffect(() => {
    setShipmentData(shipmentData);
  }, [shipmentData, setShipmentData]);

  const [errorMessages, setErrorMessages] = useState({});

  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Ordens de produção</legend>
          <div className="grid gap-3">
            <DocumentSelect
              documents={documents}
              value={selectedDocument}
              onChange={(selectedDocumentData) => {
                if (selectedDocumentData) {
                  setSelectedDocument(selectedDocumentData);
                  setSelectedData(prevData => ({ ...prevData, documentData: selectedDocumentData }));
                  axios.get(`http://192.168.1.104:8089/api/v1/itens-de-embarque?empresa=1&documento=${selectedDocumentData.documento}&item=${selectedDocumentData.item}&produto=${selectedDocumentData.produto?.codigo}`)
                    .then(response => {
                      setShipmentItems(response.data);
                      if (response.data.length >= 5) {
                        const selectedData = response.data.slice(0, 1000);
                        setShipmentData(selectedData);
                        setSelectedData(prevData => ({ ...prevData, shipmentData: selectedData }));
                      }
                    });
                }
              }}
              placeholder="Selecione o documento"
            />
          </div>
          <div className="grid gap-3 max-w-[795px]">
            <Label htmlFor="product">Itens de Embarque</Label>
            <GroupedMultiSelect
              shipmentItems={shipmentItems}
              value={Array.isArray(shipmentData) ? shipmentData.map(data => ({ value: data.codigoProduto, label: data.codigoProduto })) : []}
              onChange={selectedOptions => {
                const selectedCodes = selectedOptions.map(option => option.value);
                const selectedData = shipmentItems.filter(item => selectedCodes.includes(item.codigoProduto));
                setShipmentData(selectedData);
                setSelectedData(prevData => ({ ...prevData, shipmentData: selectedData }));
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
                                    // Defina a mensagem de erro quando o valor inserido for muito alto
                                    setErrorMessages(prev => ({ ...prev, [item.codigoProduto]: 'Valor excedido' }));
                                    newQuantity = item.quantidade;
                                  } else {
                                    // Limpe a mensagem de erro quando o valor inserido for válido
                                    setErrorMessages(prev => {
                                      const { [item.codigoProduto]: _, ...rest } = prev;
                                      return rest;
                                    });
                                  }
                                  if (newQuantity < 0) {
                                    newQuantity = 0;
                                  }
                                  const updatedShipmentData = shipmentData.map((shipmentItem) => {
                                    if (shipmentItem.codigoProduto === item.codigoProduto) {
                                      return { ...shipmentItem, quantidadeEnviada: newQuantity };
                                    }
                                    return shipmentItem;
                                  });
                                  setShipmentData(updatedShipmentData);
                                  setSelectedData((prevData) => ({
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
                  const savedProducts = shipmentData.map(product => product.descricaoProduto).join(', ');
                  toast({
                    title: "Dados enviados para Expedição",
                    description: `Documento: ${documento}, Item: ${item}, Produto: ${produto?.codigo} - ${produto?.descricao}`,
                    duration: 3000,
                    icon: <CheckCircle className="h-4 w-4" />
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