
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Produto {
  codigo: string;
  descricao: string;
  preco: number;
  estoque: number;
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
}
