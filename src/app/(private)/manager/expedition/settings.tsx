'use client'
import { useEffect, useState } from 'react';
import { FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from '@/components/ui/multiselect';
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
      "id": "100",
      "amount": 10,
      "client": "Cliente 1",
      "emission": "2022-01-01",
      "delivery": "2022-01-10",
      "tag": "SP-1",
      "products": ["16000411"]
    },
    {
      "id": "101",
      "amount": 20,
      "client": "Cliente 2",
      "emission": "2022-02-02",
      "delivery": "2022-02-12",
      "tag": "SP-2",
      "products": ["16000412"]
    },
  ],
  "product": [
    {
      "id": "16000411",
      "name": "FIXDR LONG TC",
      "pieces": ["100", "102", "103", "104"]
    },
    {
      "id": "16000412",
      "name": "FIXDR SHORT TC",
      "pieces": ["101"]
    }
  ],
  "piece": [
    {
      "id": "100",
      "name": "CONE EXT TAMPA SL 00 CONJ SOLDA",
      "quantity": 10,
      "balance": 10,
      "rdProduct": "1",
      "unit": "Pç",
      "color": "red",
      "material": "iron",
      "dimensions": "10x20x30",
      "weight": "2"
    },
    {
      "id": "101",
      "name": "CONE EXT TAMPA SL 01 CONJ SOLDA",
      "quantity": 20,
      "balance": 20,
      "rdProduct": "2",
      "unit": "Pç",
      "color": "blue",
      "material": "steel",
      "dimensions": "15x25x35",
      "weight": "3"
    },
    {
      "id": "102",
      "name": "CONE EXT TAMPA SL 02 CONJ SOLDA",
      "quantity": 15,
      "balance": 15,
      "rdProduct": "1",
      "unit": "Pç",
      "color": "green",
      "material": "aluminum",
      "dimensions": "12x22x32",
      "weight": "2.5"
    },
    {
      "id": "103",
      "name": "CONE EXT TAMPA SL 03 CONJ SOLDA",
      "quantity": 25,
      "balance": 25,
      "rdProduct": "1",
      "unit": "Pç",
      "color": "yellow",
      "material": "copper",
      "dimensions": "14x24x34",
      "weight": "3.5"
    },
    {
      "id": "104",
      "name": "CONE EXT TAMPA SL 04 CONJ SOLDA",
      "quantity": 30,
      "balance": 30,
      "rdProduct": "1",
      "unit": "Pç",
      "color": "purple",
      "material": "brass",
      "dimensions": "16x26x36",
      "weight": "4.5"
    },
  ]
};

export default function Settings() {
  const [selectedOf, setSelectedOf] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const selectedOfData = data.of.find(ofItem => ofItem.id === selectedOf);
  const selectedProductData = data.product.find(productItem => productItem.id === selectedProduct);
  const piecesData = selectedProductData ? selectedProductData.pieces.map(pieceId => data.piece.find(pieceItem => pieceItem.id === pieceId)) : [];
  const relevantProducts = selectedOfData ? data.product.filter(productItem => selectedOfData.products.includes(productItem.id)) : [];

  useEffect(() => {
    console.log('OF selecionado:', selectedOfData);
  }, [selectedOf]);
  
  useEffect(() => {
    console.log('Produto selecionado:', selectedProductData);
  }, [selectedProduct]);

  return (
    <div
      className="relative hidden flex-col items-start gap-8 md:flex"
    >
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
          <div className="grid gap-3">
            <Select value={selectedOf} onValueChange={setSelectedOf}>
              <SelectTrigger id="of" className="items-start [&_[data-description]]:hidden">
                <SelectValue placeholder="Select the OF" />
              </SelectTrigger>
              <SelectContent>
                {data.of.map((ofItem, index) => (
                  <SelectItem key={index} value={ofItem.id}>
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
            <Label htmlFor="product">Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger id="product" className="items-start [&_[data-description]]:hidden">
                <SelectValue placeholder="Select the Product" />
              </SelectTrigger>
              <SelectContent>
                {relevantProducts.map((productItem, index) => (
                  <SelectItem key={index} value={productItem.id}>
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <FileText className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">{productItem.id}</span>{" "}
                          {productItem.name}
                          <span className="text-muted-foreground"></span>
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </fieldset>
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Body OF</legend>
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
              <CardContent className="overflow-auto max-h-[26vh] min-h-[26vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Piece</TableHead>
                      <TableHead className="w-[100px]">Weight</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {piecesData.map((piece, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold py-2">{piece?.id}</TableCell>
                        <TableCell className="py-2">
                          <Label htmlFor={`stock-${index}`} className="sr-only">
                            Stock
                          </Label>
                          <Input id={`stock-${index}`} type="button" defaultValue={piece?.name} />
                        </TableCell>
                        <TableCell className="py-2">
                          <Label htmlFor={`price-${index}`} className="sr-only">
                            Price
                          </Label>
                          <Input id={`price-${index}`} type="text" defaultValue={piece?.weight}/>
                        </TableCell>
                        <TableCell className="py-2">
                          <Label htmlFor={`quantity-${index}`} className="sr-only">
                            Quantity
                          </Label>
                          <Input id={`quantity-${index}`} type="number" defaultValue={piece?.quantity} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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