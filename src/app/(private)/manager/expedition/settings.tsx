'use client'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { DataContext } from '@/context/DataProvider';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from '@/components/multiSelect';
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
  const [selectedShipmentItems, setSelectedShipmentItems] = useState([]);
  const { setSelectedData } = useContext(DataContext);

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
                  <SelectItem key={index} value={`item-${index}-${documentItem?.documento?.toString()}`}>
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
          <div className="grid gap-3">
          <Label htmlFor="product">Itens de Embarque</Label>
            <MultiSelect 
              options={shipmentItems.map(item => ({ id: item.produto, name: `Produto: ${item.produto}`, group: `Item ${item.item}` }))}
              value={selectedShipmentItems.length > 0 && shipmentItems.length > 0 ? shipmentItems.filter(item => selectedShipmentItems.includes(item.produto)).map(item => ({ id: item.produto, name: `Produto: ${item.produto}`, group: `Item ${item.item}` })) : []}
              onValueChange={selectedOptions => setSelectedShipmentItems(selectedOptions.map(option => option.id))}
              placeholder="Selecione os itens de embarque..."
            />
          </div>
        </fieldset>
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Dados da OF</legend>
          <div className="grid gap-3">
            <Card>
              {/* <CardHeader>
                <div className="flex justify-between">
                  <div className="flex flex-col w-1/2">
                    <CardDescription><b>OF:</b> {selectedOfData?.id}</CardDescription>
                    <CardDescription><b>Cliente:</b> {selectedOfData?.client}</CardDescription>
                  </div>
                  <div className="flex flex-col w-1/4">
                    <CardDescription><b>Dt.Emissão:</b> {selectedOfData?.emission}</CardDescription>
                    <CardDescription><b>Dt.Entrega</b> {selectedOfData?.delivery}</CardDescription>
                  </div>
                  <div className="flex flex-col w-1/12">
                    <CardDescription><b>Tag:</b> {selectedOfData?.tag}</CardDescription>
                  </div>
                </div>
              </CardHeader> */}
              <CardContent className="overflow-auto max-h-[30vh] min-h-[30vh]">
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Peça</TableHead>
                      <TableHead className="w-[100px]">Peso</TableHead>
                      <TableHead className="w-[100px]">Qtd</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProductData.map((product) => {
                      const productPieces = product.pieces.map(pieceId => data.piece.find(pieceItem => pieceItem.id === pieceId));
                      return (
                        <>
                          <TableRow className="bg-gray-200">
                            <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-6">({product.id}) {product.name}</TableHead>
                          </TableRow>
                          {productPieces.map((piece, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-semibold py-1">{piece?.id}</TableCell>
                              <TableCell className="py-1">
                                <Label htmlFor={`name-${index}`} className="sr-only">
                                  Código
                                </Label>
                                <Input className="h-8 text-xs" id={`name-${index}`} type="button" defaultValue={piece?.name} />
                              </TableCell>
                              <TableCell className="py-1">
                                <Label htmlFor={`weight-${index}`} className="sr-only">
                                  Peso
                                </Label>
                                <Input className="h-8 text-xs" id={`weight-${index}`} type="text" defaultValue={piece?.weight}/>
                              </TableCell>
                              <TableCell className="py-1">
                                <Label htmlFor={`quantity-${index}`} className="sr-only">
                                  Qtd
                                </Label>
                                <Input className="h-8 text-xs" id={`quantity-${index}`} type="number" defaultValue={piece?.quantity} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      );
                    })}
                  </TableBody>
                </Table> */}
              </CardContent>
              <CardFooter className="justify-center border-t p-2">
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