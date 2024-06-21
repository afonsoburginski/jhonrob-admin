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