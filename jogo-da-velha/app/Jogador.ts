export class Jogador {
    private nome: String;
    private vitorias: number;

    constructor(nome: String) {
        this.nome = nome;
        this.vitorias = 0;
    }

    public getNome(): String {
        return this.nome;
    }

    public getVitorias(): number {
        return this.vitorias;
    }

    public adicionaVitoria(): void {
        this.vitorias++;
    }

    public reinicia(): void {
        this.vitorias = 0;
    }
}