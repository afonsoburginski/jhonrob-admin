'use client'
import { useContext } from 'react';
import { DataContext } from '@/context/DataProvider';
import Image from 'next/image';
import Settings from './settings';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
interface Product {
  id: number;
  name: string;
  pieces: number[];
}

interface Piece {
  id: number;
  name: string;
  quantity: number;
  balance: number;
  rdProduct: string;
  unit: string;
  color: string;
  material: string;
  dimensions: string;
  weight: string;
}

export default function Expedition() {
  const { piecesData, data } = useContext(DataContext);

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="of">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="of">OF</TabsTrigger>
                <TabsTrigger value="expedition">Expedição</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="of" className="flex flex-row justify-around gap-8">
              <Card x-chunk="dashboard-06-chunk-1" className="flex-grow">
                <CardHeader>
                  <CardTitle>OF</CardTitle>
                  <CardDescription>
                    Selecione a OF para a expedição.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Settings />
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}
                    OFs
                  </div>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-06-chunk-1" className="w-[794px] p-6 ">
                <CardHeader className="border-y-2 border-gray-400 p-0">
                  <div className="flex justify-between items-center h-10">
                    <div className='flex flex-col items-start'>
                      <Image src="/logo.png" alt="Logo" width="150" height="50" priority/>
                    </div>
                    <div className="flex flex-col items-center">
                      <CardDescription className="font-bold">JHONROB</CardDescription>
                      <CardDescription>Relação Item Embarque</CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <CardDescription className="text-xs">CNPJ: 02.053.879/0001-65</CardDescription>
                      <CardDescription className="text-xs">Página 001 De 001</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="border-2 rounded-lg border-gray-400 p-1 px-4 grid grid-cols-4 gap-2 items-start">
                  <div>
                    <CardDescription className="text-xs"><b>O.F:</b> {data?.selectedOfData?.id ?? '-'}</CardDescription>
                    <CardDescription className="text-xs"><b>Cliente:</b> {data?.selectedOfData?.client ?? '-'}</CardDescription>
                    <CardDescription className="text-xs"><b>Produto:</b> {data?.selectedProductData?.id ?? '-'}</CardDescription>
                  </div>
                  <div>
                    <CardDescription className="text-xs"><b>Quantidade:</b> {data?.selectedOfData?.amount ?? '-'}</CardDescription>
                  </div>
                  <div>
                    <CardDescription className="text-xs"><b>Dt.Emissão:</b> {data?.selectedOfData?.emission ?? '-'}</CardDescription>
                    <CardDescription className="text-xs"><b>Dt.Entrega:</b> {data?.selectedOfData?.delivery ?? '-'}</CardDescription>
                  </div>
                  <div className="flex items-center justify-center">
                    <CardDescription className="font-bold">Tag: {data?.selectedOfData?.tag ?? '-'}</CardDescription>
                  </div>
                </CardContent>
                <CardDescription className="text-xs font-bold mt-5">{'Status = { P = Pendente, E = Embarcado, C = Cancelado, N = Não Retirado, R = Retirado }'}</CardDescription>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-right font-bold h-6 px-1">Qdt</TableHead>
                      <TableHead className="text-xs text-right font-bold h-6 px-1">Saldo</TableHead>
                      <TableHead className="text-xs text-right font-bold h-6 px-1">Código</TableHead>
                      <TableHead className="text-xs text-center font-bold h-6 px-1">RD</TableHead>
                      <TableHead className="text-xs text-start font-bold h-6 px-1">Produto</TableHead>
                      <TableHead className="text-xs text-center font-bold h-6 px-1">UN</TableHead>
                      <TableHead className="text-xs text-center font-bold h-6 px-1">Cor</TableHead>
                      <TableHead className="text-xs text-center font-bold h-6 px-1">Material</TableHead>
                      <TableHead className="text-xs text-center font-bold h-6 px-1">(AxLxC)</TableHead>
                      <TableHead className="text-xs text-right font-bold h-6 pr-0">Peso tot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-b">
                    <TableRow className="bg-gray-200">
                      <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-6">Local: Expedição</TableHead>
                    </TableRow>
                    <TableRow className="h-2"></TableRow>
                    {data?.selectedProductData?.map((product: Product) => {
                      const productPieces = piecesData.filter((piece: Piece) => product.pieces.includes(piece.id));
                      return (
                        <>
                          <TableRow className="bg-gray-200">
                            <TableHead colSpan={10} className="w-full text-start text-xs font-bold h-6">
                              ({product.id}) {product.name}
                            </TableHead>
                          </TableRow>
                          {productPieces.map((piece: Piece, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="text-xs text-right py-1 px-1 border-r">{piece.quantity}</TableCell>
                              <TableCell className="text-xs text-right py-1 px-1 border-r">{piece.balance}</TableCell>
                              <TableCell className="text-xs text-right py-1 px-1 border-r">{piece.id}</TableCell>
                              <TableCell className="text-xs text-center py-1 px-1 border-r">{piece.rdProduct}</TableCell>
                              <TableCell className="text-xs text-start py-1 px-1 border-r">{piece.name}</TableCell>
                              <TableCell className="text-xs text-center py-1 px-1 border-r">{piece.unit}</TableCell>
                              <TableCell className="text-xs text-start py-1 px-1 border-r">{piece.color}</TableCell>
                              <TableCell className="text-xs text-center py-1 px-1 border-r">{piece.material}</TableCell>
                              <TableCell className="text-xs text-center py-1 px-1 border-r">{piece.dimensions}</TableCell>
                              <TableCell className="text-xs text-right py-1 px-1">{piece.weight}</TableCell>
                            </TableRow>
                          ))}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
                <CardFooter className="flex justify-between items-center p-0 mt-2">
                  <div className="flex gap-8 w-20 px-1 justify-end">
                    <div className="flex flex-col items-end gap-4">
                      <CardDescription className="text-xs">60</CardDescription>
                      <CardDescription className="text-xs">60</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <CardDescription className="text-xs">70</CardDescription>
                      <CardDescription className="text-xs">70</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-5 mb-2 border-t px-1">
                      <CardDescription className="text-xs font-bold">Total:</CardDescription>
                      <CardDescription className="text-xs">822,53</CardDescription>
                    </div>
                    <div className="flex gap-5 border-t px-1">
                      <CardDescription className="text-xs font-bold">Total Geral:</CardDescription>
                      <CardDescription className="text-xs">822,53</CardDescription>
                    </div>
                  </div>
                </CardFooter>
              </Card>

            </TabsContent>
            <TabsContent value="expedition">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Expedição</CardTitle>
                  <CardDescription>
                    Lista de itens enviados para expedição
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}
                    itens
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}