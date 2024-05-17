'use client'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { DataContext } from '@/context/DataProvider';
import { ExpeditionContext } from '@/context/ExpeditionProvider';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GroupedMultiSelect from '@/components/GroupedMultiSelect';
import Select from 'react-select';
import {

  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import React from 'react';

export default function Settings() {
  const [selectedDocument, setSelectedDocument] = useState('0');
  const [selectedItem, setSelectedItem] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [shipmentItems, setShipmentItems] = useState([]);
  const { documentData, setSelectedData, shipmentData, setShipmentData } = useContext(DataContext);
  
  function groupByFirstLevelProduct(data) {
    return data.reduce((groups, item) => {
      const group = (groups[item.codigoProdutoPrimeiroNivel] || []);
      group.push(item);
      groups[item.codigoProdutoPrimeiroNivel] = group;
      return groups;
    }, {});
  }
  
  const groupedData = groupByFirstLevelProduct(shipmentData);
  const { saveData } = useContext(ExpeditionContext);
  
  useEffect(() => {
    axios.get('http://192.168.1.104:8089/api/v1/ordens-de-producao/ofs?page=0&size=999')
      .then(response => {
        setDocuments(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedDocument !== '0' && selectedItem) {
      axios.get(`http://192.168.1.104:8089/api/v1/itens-de-embarque?empresa=1&documento=${selectedDocument}&item=${selectedItem}`)
        .then(response => {
          setShipmentItems(response.data);
        });
    }
  }, [selectedDocument, selectedItem]);

  useEffect(() => {
    setShipmentData(shipmentData);
  }, [shipmentData, setShipmentData]);


  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Ordens de produção</legend>
          <div className="grid gap-3">
            <Select
              value={documents.find(doc => doc.documento.toString() === selectedDocument && doc.item === selectedItem)}
              onChange={(selectedDocumentData) => {
                if (selectedDocumentData) {
                  setSelectedDocument(selectedDocumentData?.documento?.toString());
                  setSelectedItem(selectedDocumentData?.item);
                  setSelectedData(prevData => ({ ...prevData, documentData: selectedDocumentData }));
                  axios.get(`http://192.168.1.104:8089/api/v1/itens-de-embarque?empresa=1&documento=${selectedDocumentData?.documento?.toString()}&item=${selectedDocumentData?.item}&produto=${selectedDocumentData?.produto?.codigo}`)
                    .then(response => {
                      setShipmentItems(response.data);
                      if (response.data.length >= 5) {
                        const selectedData = response.data.slice(0, 50);
                        setShipmentData(selectedData);
                        setSelectedData(prevData => ({ ...prevData, shipmentData: selectedData }));
                      }
                    })
                }
              }}
              options={documents}
              getOptionLabel={(option) => `OF ${option.documento} Item: ${option.item} (${option.produto?.codigo}) ${option.produto?.descricao}`}
              getOptionValue={(option) => `${option.documento.toString()}-${option.item}-${option.produto?.codigo}`}
              placeholder="Selecione o documento"
            />
          </div>
          <div className="grid gap-3 max-w-[1118px]">
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
                  <div className="flex flex-col w-1/12">
                    <CardDescription><b>Tag:</b> {documentData?.tag}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[32vh] min-h-[32vh]">
                <Table>
                  <thead>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd</TableHead>
                    </TableRow>
                  </thead>
                  <tbody>
                  {Object.entries(groupedData).map(([codigoProdutoPrimeiroNivel, group], groupIndex) => {
                    const descricaoProdutoPrimeiroNivel = group[0].descricaoProdutoPrimeiroNivel;
                    return (
                      <React.Fragment key={groupIndex}>
                        <TableRow className="bg-gray-200">
                          <TableHead colSpan={10} className="w-full text-start text-xs font-bold h-6">({codigoProdutoPrimeiroNivel}) {descricaoProdutoPrimeiroNivel}</TableHead>
                        </TableRow>
                        {group.map((item, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className="text-xs py-1">
                                {item.codigoProduto}
                              </TableCell>
                              <TableCell className="py-1" >
                                <Label htmlFor={`name-${index}`} className="sr-only">
                                  Produto
                                </Label>
                                <Input className="h-7 text-xs min-w-[720px] max-w-[70px]" id={`name-${index}`} type="button" defaultValue={item.descricaoProduto} />
                              </TableCell>
                              <TableCell className="py-1">
                                <Label htmlFor={`quantity-${index}`} className="sr-only">
                                  Qtd
                                </Label>
                                <Input className="h-7 text-xs max-w-[70px]" id={`quantity-${index}`} type="number" defaultValue={item.quantidade} max={item.quantidade} step="1" onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </React.Fragment>
                    );
                    })}
                  </tbody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-1">
              <Button size="sm" variant="ghost" className="gap-1" onClick={() => {
                const dataToSave = { documentData, shipmentData };
                saveData(dataToSave);
                console.log("Dados salvos no contexto:", dataToSave);
              }}>
                <CheckCircle className="h-3.5 w-3.5" />
                Save
              </Button>
              </CardFooter>
            </Card>
          </div>
        </fieldset>
      </form>
    </div>
  )
}