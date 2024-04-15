'use client'
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

const data = {
  "of": [
    {
      "id": 100,
      "amount": 10,
      "client": "Cliente 1",
      "emission": "2022-01-01",
      "delivery": "2022-01-10",
      "tag": "SP-1",
      "products": [16000411]
    },
    {
      "id": 101,
      "amount": 20,
      "client": "Cliente 2",
      "emission": "2022-02-02",
      "delivery": "2022-02-12",
      "tag": "SP-2",
      "products": [16000412]
    },
  ],
  "product": [
    {
      "id": 16000411,
      "name": "FIXDR LONG TC",
      "pieces": [100]
    },
    {
      "id": "16000412",
      "name": "FIXDR SHORT TC",
      "pieces": [101]
    }
  ],
  "piece": [
    {
      "id": 100,
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
      "id": 101,
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
  ]
};

export default function Expedition() {
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
                <CardContent className="mt-1 mb-1 p-0">
                  <div className="flex flex-col items-start mb-5">
                    <div className="flex flex-row flex-wrap gap-2">
                      <CardDescription className="text-xs"><b>Status:</b> Pendentes</CardDescription>
                      <CardDescription className="text-xs"><b>Período:</b> Todos</CardDescription>
                      <CardDescription className="text-xs"><b>Tipo Período:</b> Dt.Cadastro</CardDescription>
                      <CardDescription className="text-xs"><b>Ordenação:</b> Código</CardDescription>
                      <CardDescription className="text-xs"><b>Local:</b> Expedição</CardDescription>
                      <CardDescription className="text-xs"><b>Tipo:</b> Não Retirado</CardDescription>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                      <CardDescription className="text-xs"><b>Ordem de Fabricação:</b> Multipla Seleção, 5 Itens Selecionados</CardDescription>
                      <CardDescription className="text-xs"><b>Formato:</b> Retrato</CardDescription>
                      <CardDescription className="text-xs"><b>Listar Apenas Sem Estoque:</b> Não</CardDescription>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="border-2 rounded-lg border-gray-400 p-1 px-4 grid grid-cols-4 gap-2 items-start">
                  <div>
                    <CardDescription className="text-xs"><b>O.F:</b> {data?.of[0]?.id ?? '-'}</CardDescription>
                    <CardDescription className="text-xs"><b>Cliente:</b> {data?.of[0]?.client ?? '-'}</CardDescription>
                    <CardDescription className="text-xs"><b>Produto:</b> {data?.product[0]?.id ?? '-'}</CardDescription>
                  </div>
                  <div>
                    <CardDescription className="text-xs"><b>Quantidade:</b> {data?.of[0]?.amount ?? '-'}</CardDescription>
                  </div>
                  <div>
                    <CardDescription className="text-xs"><b>Dt.Emissão:</b> {data?.of[0]?.emission ?? '-'}</CardDescription>
                    <CardDescription className="text-xs"><b>Dt.Entrega:</b> {data?.of[0]?.delivery ?? '-'}</CardDescription>
                  </div>
                  <div className="flex items-center justify-center">
                    <CardDescription className="font-bold">Tag: {data?.of[0]?.tag ?? '-'}</CardDescription>
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
                    <TableRow className="bg-gray-200">
                      <TableHead colSpan={10} className="w-full text-center text-xs font-bold h-6">Local: Expedição</TableHead>
                    </TableRow>
                    <TableRow className="h-2"></TableRow>
                    <TableRow className="bg-gray-200">
                      <TableHead colSpan={10} className="w-full text-start text-xs font-bold h-6">
                        ({data?.product[0]?.id ?? '-'}) {data?.product[0]?.name ?? '-'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-b">
                    {data?.piece?.map((pieceItem, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs text-right py-1 px-1 border-r">{pieceItem.quantity}</TableCell>
                        <TableCell className="text-xs text-right py-1 px-1 border-r">{pieceItem.balance}</TableCell>
                        <TableCell className="text-xs text-right py-1 px-1 border-r">{pieceItem.id}</TableCell>
                        <TableCell className="text-xs text-center py-1 px-1 border-r">{pieceItem.rdProduct}</TableCell>
                        <TableCell className="text-xs text-start py-1 px-1 border-r">{pieceItem.name}</TableCell>
                        <TableCell className="text-xs text-center py-1 px-1 border-r">{pieceItem.unit}</TableCell>
                        <TableCell className="text-xs text-start py-1 px-1 border-r">{pieceItem.color}</TableCell>
                        <TableCell className="text-xs text-center py-1 px-1 border-r">{pieceItem.material}</TableCell>
                        <TableCell className="text-xs text-center py-1 px-1 border-r">{pieceItem.dimensions}</TableCell>
                        <TableCell className="text-xs text-right py-1 px-1">{pieceItem.weight}</TableCell>
                      </TableRow>
                    ))}
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
                  <CardTitle>Itens</CardTitle>
                  <CardDescription>
                    Selecione os itens para a expedição.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {/* Aqui você pode adicionar a lógica para listar os itens */}
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