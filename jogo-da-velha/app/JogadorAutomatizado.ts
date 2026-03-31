import { Jogador } from './Jogador';
import { Peca } from './Peca';

export class JogadorAutomatizado extends Jogador {
  constructor(nome: string = "Computador") {
    super(nome);
  }

  public realizaJogada(tabuleiro: (Peca | null)[][]): [number, number] {
    const jogadasDisponiveis: [number, number][] = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tabuleiro[i][j] === null) {
          jogadasDisponiveis.push([i, j]);
        }
      }
    }

    if (jogadasDisponiveis.length === 0) {
      return [-1, -1];
    }

    const indiceAleatorio = Math.floor(Math.random() * jogadasDisponiveis.length);
    return jogadasDisponiveis[indiceAleatorio];
  }
}