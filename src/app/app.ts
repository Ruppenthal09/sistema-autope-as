
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class App {
  tela = 'inicio';

  produtos: Produto[] = [];

  vendas: Venda[] = [];


  codigoVenda = '';
  quantidadeVenda = 1;

  novoProduto: Produto = {
    codigo: '',
    descricao: '',
    preco: 0,
    estoque: 0
  
  };

  mensagem = '';

  abrirTela(tela: string) {
    this.tela = tela;
    this.mensagem = '';
  }

  cadastrarProduto() {
    const produto = this.novoProduto;

    if (!produto.codigo.trim() || !produto.descricao.trim()) {
      this.mensagem = 'Preencha o código e a descrição.';
      return;
    }

    if (!Number.isFinite(produto.preco) || produto.preco <= 0 ||
        !Number.isInteger(produto.estoque) || produto.estoque < 0) {
      this.mensagem = 'Informe preço válido e estoque inteiro não negativo.';
      return;
    }

    if (this.produtos.some(p => p.codigo === produto.codigo)) {
      this.mensagem = 'Já existe um produto com esse código.';
      return;
    }

    this.produtos.push({ ...produto });

    this.novoProduto = {
      codigo: '',
      descricao: '',
      preco: 0,
      estoque: 0
    };

    this.mensagem = 'Produto cadastrado com sucesso!';
  }

  adicionarEstoque(codigo: string, quantidade: number) {
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
  }

  retirarEstoque(codigo: string, quantidade: number) {
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
  }
  registrarVenda() {
  const produto = this.produtos.find(
    p => p.codigo === this.codigoVenda
  );

  if (!produto) {
    this.mensagem = 'Selecione um produto válido.';
    return;
  }

  if (!Number.isInteger(this.quantidadeVenda) || this.quantidadeVenda <= 0) {
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
}
}

