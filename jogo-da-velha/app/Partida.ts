import { Jogador } from "./Jogador";
import { Peca } from "./Peca";
import { SituacaoPartida } from "./SituacaoPartida";

export class Partida {
    private jogador1: Jogador;
    private jogador2: Jogador;
    private tabuleiro: (Peca | null)[][];
    private vezJogador1: boolean;

    constructor(jogador1: Jogador, jogador2: Jogador) {
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.vezJogador1 = true;
        this.tabuleiro = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    public getJogador1(): Jogador { return this.jogador1; }
    public getJogador2(): Jogador { return this.jogador2; }
    public getTabuleiro(): (Peca | null)[][] { return this.tabuleiro; }
    public getVezJogador1(): boolean { return this.vezJogador1; }

    public joga(linha: number, coluna: number): boolean {
        if (linha < 0 || linha > 2 || coluna < 0 || coluna > 2) return false;
        if (this.tabuleiro[linha][coluna] !== null) return false;

        const pecaAtual = this.vezJogador1 ? Peca.Xis : Peca.Circulo;
        this.tabuleiro[linha][coluna] = pecaAtual;
        this.vezJogador1 = !this.vezJogador1;

        return true;
    }

    public verificaFim(): SituacaoPartida {
        const t = this.tabuleiro;
        const linhasVencedoras = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (const linha of linhasVencedoras) {
      const [a, b, c] = linha;
      const pecaA = t[a[0]][a[1]];
      const pecaB = t[b[0]][b[1]];
      const pecaC = t[c[0]][c[1]];

      if (pecaA && pecaA === pecaB && pecaA === pecaC) {
        return pecaA === Peca.Xis ? SituacaoPartida.VitoriaJogador1 : SituacaoPartida.VitoriaJogador2;
      }
    }

    const temEspacoVazio = t.some(linha => linha.some(celula => celula === null));
    if (!temEspacoVazio) {
      return SituacaoPartida.Empate;
    }

    return SituacaoPartida.EmAndamento;
  }
}