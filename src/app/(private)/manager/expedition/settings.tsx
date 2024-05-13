'use client'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { DataContext } from '@/context/DataProvider';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GroupedMultiSelect from '@/components/GroupedMultiSelect';
import {
  Select,
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

export default function Settings() {
  const [selectedDocument, setSelectedDocument] = useState('0');
  const [selectedItem, setSelectedItem] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [shipmentItems, setShipmentItems] = useState([]);
  const { documentData, setSelectedData, shipmentData, setShipmentData } = useContext(DataContext);

  useEffect(() => {
    axios.get('http://192.168.1.104:8089/api/v1/ordens-de-producao/ofs?page=0&size=100')
      .then(response => {
        console.log(response.data);
        setDocuments(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar documentos:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedDocument !== '0' && selectedItem) {
      axios.get(`http://192.168.1.104:8089/api/v1/itens-de-embarque?empresa=1&documento=${selectedDocument}&item=${selectedItem}`)
        .then(response => {
          console.log(response.data);
          setShipmentItems(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar itens de embarque:', error);
        });
    }
  }, [selectedDocument, selectedItem]);

  useEffect(() => {
    setShipmentData(shipmentData);
    console.log("Dados enviados para DataContext: ", shipmentData);
  }, [shipmentData, setShipmentData]);


  return (
    <div
      className="relative hidden flex-col items-start gap-8 md:flex"
    >
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Ordens de produção</legend>
          <div className="grid gap-3">
          <Select value={`item-${documents.findIndex(doc => doc.documento.toString() === selectedDocument)}-${selectedDocument}`} onValueChange={(value) => {
            const documentIndex = value.split('-')[1];
            const selectedDocumentData = documents[documentIndex];
            if (selectedDocumentData) {
              setSelectedDocument(selectedDocumentData?.documento?.toString());
              setSelectedItem(selectedDocumentData?.item);
              setSelectedData({ documentData: selectedDocumentData });
            }
          }}>
              <SelectTrigger id="document" className="items-start [&_[data-description]]:hidden">
                <SelectValue placeholder="Selecione o documento" />
              </SelectTrigger>
              <SelectContent>
                {documents.map((documentItem, index) => (
                  <SelectItem key={index} value={`item-${index}-${documentItem?.documento.toString()}`}>
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <FileText className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">OF {documentItem?.documento}</span>{" "}
                          <span className="font-medium text-muted-foreground ml-2">Item: {documentItem?.item}</span>
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                setSelectedData({ shipmentData: selectedData });
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
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="w-[100px]">Peso</TableHead>
                      <TableHead className="w-[100px]">Qtd</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {shipmentData.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-xs py-1">{item.codigoProduto}</TableCell>
                          <TableCell className="py-1">
                            <Label htmlFor={`name-${index}`} className="sr-only">
                              Produto
                            </Label>
                            <Input className="h-8 text-xs" id={`name-${index}`} type="button" defaultValue={item.descricaoProduto} />
                          </TableCell>
                          <TableCell className="py-1">
                            <Label htmlFor={`weight-${index}`} className="sr-only">
                              Peso
                            </Label>
                            <Input className="h-8 text-xs" id={`weight-${index}`} type="button" defaultValue={item.peso}/>
                          </TableCell>
                          <TableCell className="py-1">
                            <Label htmlFor={`quantity-${index}`} className="sr-only">
                              Qtd
                            </Label>
                            <Input className="h-8 text-xs" id={`quantity-${index}`} type="number" defaultValue={item.quantidade} max={item.quantidade} step="1" onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-1">
                <Button size="sm" variant="ghost" className="gap-1">
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