
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { carregarDados, salvarDados } from './banco-dados';

interface Produto {
  codigo: string;
  descricao: string;
  preco: number;
  estoque: number;
}

interface Venda {
  codigoProduto: string;
  descricaoProduto: string;
  quantidade: number;
  valorTotal: number;
  data: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  tela = 'inicio';

  produtos: Produto[] = [];
  vendas: Venda[] = [];

  novoProduto: Produto = {
    codigo: '',
    descricao: '',
    preco: 0,
    estoque: 0
  };

  codigoVenda = '';
  quantidadeVenda = 1;
  mensagem = '';

  // Controla o carregamento inicial do banco.
  carregando = true;

  async ngOnInit(): Promise<void> {
    try {
      const dados = await carregarDados();

      if (dados) {
        this.produtos = dados.produtos;

        this.vendas = dados.vendas.map(venda => ({
          ...venda,
          data: new Date(venda.data)
        }));
      }
    } catch (erro) {
      console.error('Erro ao carregar os dados:', erro);
      this.mensagem = 'Não foi possível carregar os dados salvos.';
    } finally {
      this.carregando = false;
    }
  }

  async persistirDados(): Promise<void> {
    try {
      await salvarDados({
        produtos: this.produtos,
        vendas: this.vendas.map(venda => ({
          ...venda,
          data: venda.data.toISOString()
        }))
      });
    } catch (erro) {
      console.error('Erro ao salvar os dados:', erro);
      this.mensagem = 'Erro ao salvar os dados no navegador.';
    }
  }

  abrirTela(tela: string) {
    this.tela = tela;
    this.mensagem = '';
  }

  cadastrarProduto() {
    if (this.carregando) return;

    const produto = this.novoProduto;

    if (!produto.codigo.trim() || !produto.descricao.trim()) {
      this.mensagem = 'Preencha o código e a descrição.';
      return;
    }

    if (
      !Number.isFinite(produto.preco) ||
      produto.preco <= 0 ||
      !Number.isInteger(produto.estoque) ||
      produto.estoque < 0
    ) {
      this.mensagem = 'Informe preço válido e estoque inteiro não negativo.';
      return;
    }

    
    const codigoNormalizado = produto.codigo.trim().toUpperCase();

    if (
     this.produtos.some(
      p => p.codigo.trim().toUpperCase() === codigoNormalizado
  )
) 
{
  this.mensagem = 'Já existe um produto com esse código.';
  return;
}

produto.codigo = codigoNormalizado;
produto.descricao = produto.descricao.trim();


    this.produtos.push({ ...produto });

    this.novoProduto = {
      codigo: '',
      descricao: '',
      preco: 0,
      estoque: 0
    };

    this.mensagem = 'Produto cadastrado com sucesso!';
    void this.persistirDados();
  }

  adicionarEstoque(codigo: string, quantidade: number) {
    if (this.carregando) return;

    const produto = this.produtos.find(p => p.codigo === codigo);

    if (!produto) {
      this.mensagem = 'Produto não encontrado.';
      return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      this.mensagem = 'Informe uma quantidade inteira maior que zero.';
      return;
    }

    produto.estoque += quantidade;
    this.mensagem = 'Estoque atualizado com sucesso!';
    void this.persistirDados();
  }

  retirarEstoque(codigo: string, quantidade: number) {
    if (this.carregando) return;

    const produto = this.produtos.find(p => p.codigo === codigo);

    if (!produto) {
      this.mensagem = 'Produto não encontrado.';
      return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      this.mensagem = 'Informe uma quantidade inteira maior que zero.';
      return;
    }

    if (quantidade > produto.estoque) {
      this.mensagem = 'Estoque insuficiente para esta retirada.';
      return;
    }

    produto.estoque -= quantidade;
    this.mensagem = 'Retirada registrada com sucesso!';
    void this.persistirDados();
  }

  registrarVenda() {
    if (this.carregando) return;

    const produto = this.produtos.find(
      p => p.codigo === this.codigoVenda
    );

    if (!produto) {
      this.mensagem = 'Selecione um produto válido.';
      return;
    }

    if (
      !Number.isInteger(this.quantidadeVenda) ||
      this.quantidadeVenda <= 0
    ) {
      this.mensagem = 'Informe uma quantidade inteira maior que zero.';
      return;
    }

    if (this.quantidadeVenda > produto.estoque) {
      this.mensagem = 'Estoque insuficiente para realizar a venda.';
      return;
    }

    const venda: Venda = {
      codigoProduto: produto.codigo,
      descricaoProduto: produto.descricao,
      quantidade: this.quantidadeVenda,
      valorTotal: produto.preco * this.quantidadeVenda,
      data: new Date()
    };

    produto.estoque -= this.quantidadeVenda;
    this.vendas.push(venda);

    this.codigoVenda = '';
    this.quantidadeVenda = 1;
    this.mensagem = 'Venda registrada com sucesso!';
    void this.persistirDados();
  }
}
