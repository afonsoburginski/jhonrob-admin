// global.d.ts
interface DocumentData {
  quantidade: number;
  documento: string;
  item: string;
  produto: {
    codigo: string;
    descricao: string;
  };
  pessoa: {
    codigo: string;
    descricao: string;
  };
  dataCadastro: string;
  dataPrevEntrega: string;
  tag: string;
}

interface Item {
  local: string;
  codigoProduto: string;
  descricaoProduto: string;
  quantidade: number;
  quantidadeEnviada: number | null;
  descricaoProdutoPrimeiroNivel?: string;
  codigoProdutoPrimeiroNivel?: string;
  caminhoDesenho?: string;
}

interface SelectedDocument {
  documento: string;
  item: string;
  produto: {
    codigo: string;
    descricao: string;
  } | null;
}

interface Produto {
  codigoProduto: string;
}

interface ShipmentData {
  caminhoDesenho?: string;
  codigoComponente?: string;
  codigoProduto: string;
  codigoProdutoPrimeiroNivel: string;
  descricaoComponente?: string;
  descricaoProduto: string;
  descricaoProdutoPrimeiroNivel: string;
  documento: string;
  empresa: number;
  item: string;
  local?: string;
  material?: string;
  medidas?: string;
  peso: number;
  quantidade: number;
  quantidadeEnviada: number;
  revisaoDesenho: number;
  unidade: string;
  [key: string]: any;
}

interface ExpeditionData {
  documentData: DocumentData;
  shipmentData: ShipmentData[];
}
