
export interface DadosSistema {
  produtos: {
    codigo: string;
    descricao: string;
    preco: number;
    estoque: number;
  }[];

  vendas: {
    codigoProduto: string;
    descricaoProduto: string;
    quantidade: number;
    valorTotal: number;
    data: string;
  }[];
}

const NOME_BANCO = 'autopecas-pro';
const VERSAO_BANCO = 1;
const NOME_STORE = 'sistema';

function abrirBanco(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const requisicao = indexedDB.open(NOME_BANCO, VERSAO_BANCO);

    requisicao.onupgradeneeded = () => {
      const banco = requisicao.result;

      if (!banco.objectStoreNames.contains(NOME_STORE)) {
        banco.createObjectStore(NOME_STORE);
      }
    };

    requisicao.onsuccess = () => resolve(requisicao.result);
    requisicao.onerror = () => reject(requisicao.error);
  });
}

export async function salvarDados(dados: DadosSistema): Promise<void> {
  const banco = await abrirBanco();

  try {
    await new Promise<void>((resolve, reject) => {
      const transacao = banco.transaction(NOME_STORE, 'readwrite');
      const store = transacao.objectStore(NOME_STORE);

      store.put(dados, 'dados');

      transacao.oncomplete = () => resolve();
      transacao.onerror = () => reject(transacao.error);
      transacao.onabort = () => reject(transacao.error);
    });
  } finally {
    banco.close();
  }
}

export async function carregarDados(): Promise<DadosSistema | null> {
  const banco = await abrirBanco();

  try {
    return await new Promise((resolve, reject) => {
      const transacao = banco.transaction(NOME_STORE, 'readonly');
      const requisicao = transacao.objectStore(NOME_STORE).get('dados');

      requisicao.onsuccess = () => resolve(requisicao.result ?? null);
      requisicao.onerror = () => reject(requisicao.error);
    });
  } finally {
    banco.close();
  }
}
