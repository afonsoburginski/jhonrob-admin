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

const data = {
  "of": [
    {
      "id": 100,
      "amount": 10,
      "client": "Cliente 1",
      "emission": "2022-01-01",
      "delivery": "2022-01-10",
      "tag": "SP-1",
      "products": [16000411, 16000412],
    },
  ],
  "product": [
    {
      "id": 16000411,
      "name": "FIXDR LONG TC",
      "pieces": [102, 103]
    },
    {
      "id": 16000412,
      "name": "FIXDR SHORT TC",
      "pieces": [100, 101]
    },
  ],
  "piece": [
    {
      "id": 100,
      "name": "CONE EXT TAMPA SL 00 CONJ SOLDA",
      "quantity": 10,
      "balance": 10,
      "rdProduct": "1",
      "unit": "PÇ", 
      "color": "",
      "material": "CH 12 GALV",
      "dimensions": "10x20x30",
      "weight": "2"
    },
    {
      "id": 101,
      "name": "CONE EXT TAMPA SL 01 CONJ SOLDA",
      "quantity": 20,
      "balance": 20,
      "rdProduct": "2",
      "unit": "PÇ",
      "color": "",
      "material": "CH 12 GALV",
      "dimensions": "15x25x35",
      "weight": "3"
    },
    {
      "id": 102,
      "name": "CONE EXT TAMPA SL 02 CONJ SOLDA",
      "quantity": 15,
      "balance": 15,
      "rdProduct": "1",
      "unit": "PÇ",
      "color": "",
      "material": "CH 12 GALV",
      "dimensions": "12x22x32",
      "weight": "2.5"
    },
    {
      "id": 103,
      "name": "CONE EXT TAMPA SL 03 CONJ SOLDA",
      "quantity": 25,
      "balance": 25,
      "rdProduct": "1",
      "unit": "PÇ",
      "color": "",
      "material": "CH 12 GALV",
      "dimensions": "14x24x34",
      "weight": "3.5"
    },
  ]
};

export default function Settings() {
  const [selectedOf, setSelectedOf] = useState('0');
  const [selectedProduct, setSelectedProduct] = useState<number[]>([]);
  const [selectedPieces, setSelectedPieces] = useState<number[]>([]);
  const { setSelectedData } = useContext(DataContext);

  const selectedOfData = data.of.find(ofItem => ofItem.id == Number(selectedOf));
  const relevantProducts = selectedOfData ? data.product.filter(productItem => selectedOfData.products.includes(productItem.id)) : [];

  const piecesOptions = relevantProducts.flatMap(product => {
    const pieces = product.pieces.map(pieceId => data.piece.find(pieceItem => pieceItem.id == pieceId)).filter(Boolean);
    return pieces.map(piece => piece && { id: piece.id, name: piece.name, group: product.name }).filter(Boolean);
  }).filter(Boolean);

  useEffect(() => {
    if (selectedOf && selectedPieces.length > 0) {
      const selectedProductData = relevantProducts.filter(product => product.pieces.some(piece => selectedPieces.includes(piece)));
      setSelectedProduct(selectedProductData.map(product => product.id));
      const piecesData = selectedProductData.flatMap(productItem => productItem.pieces.map(pieceId => data.piece.find(pieceItem => pieceItem.id == Number(pieceId)))).filter(piece => piece && selectedPieces.includes(piece.id));
      setSelectedData({ selectedOfData, selectedProductData, piecesData, data });
      console.log('OF selecionada:', selectedOf);
      console.log('Peças selecionadas:', selectedPieces);
      console.log('Produtos selecionados:', selectedProductData);
    }
  }, [selectedOf, selectedPieces]);

  return (
    <div
      className="relative hidden flex-col items-start gap-8 md:flex"
    >
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Configuração</legend>
          <div className="grid gap-3">
            <Select value={selectedOf} onValueChange={setSelectedOf}>
              <SelectTrigger id="of" className="items-start [&_[data-description]]:hidden">
                <SelectValue placeholder="Selecione a OF" />
              </SelectTrigger>
              <SelectContent>
                {data.of.map((ofItem, index) => (
                  <SelectItem key={index} value={ofItem.id.toString()}>
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <FileText className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">OF {ofItem.id}</span>{" "}
                          <span className="text-muted-foreground">{ofItem.tag}</span>
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="product">Produtos</Label>
            <MultiSelect 
              options={piecesOptions}
              value={selectedPieces ? piecesOptions.filter(item => selectedPieces.map(String).includes(item.id.toString())) : []}
              onValueChange={selectedOptions => setSelectedPieces(selectedOptions.map(option => Number(option.id)))}
              placeholder="Selecione as peças..."
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
              </CardHeader>
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