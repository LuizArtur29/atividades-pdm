import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Jogo } from './Jogo';
import { Jogador } from './Jogador';
import { JogadorAutomatizado } from './JogadorAutomatizado';
import { SituacaoPartida } from './SituacaoPartida';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.85;
const SQUARE_SIZE = BOARD_SIZE / 3;

export default function TicTacToeOO() {
  const [jogo] = useState(() => new Jogo(new Jogador("Você"), new JogadorAutomatizado("CPU")));
  const [partida, setPartida] = useState(() => jogo.iniciaPartida());
  
  const [boardState, setBoardState] = useState(partida.getTabuleiro());
  const [vezHumano, setVezHumano] = useState(partida.getVezJogador1());
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);
  
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const atualizaTela = () => {
    setBoardState([...partida.getTabuleiro().map(row => [...row])]);
    setVezHumano(partida.getVezJogador1());
  };

  const processaFimDeTurno = () => {
    const situacao = partida.verificaFim();
    
    if (situacao !== SituacaoPartida.EmAndamento) {
      setPartidaFinalizada(true);
      
      if (situacao === SituacaoPartida.VitoriaJogador1) {
        jogo.getJogador1().adicionaVitoria();
        Alert.alert('Fim de Jogo', 'Você venceu!');
      } else if (situacao === SituacaoPartida.VitoriaJogador2) {
        jogo.getJogador2().adicionaVitoria();
        Alert.alert('Fim de Jogo', 'A CPU venceu!');
      } else {
        Alert.alert('Fim de Jogo', 'Deu velha!');
      }

      setUserScore(jogo.getJogador1().getVitorias());
      setComputerScore(jogo.getJogador2().getVitorias());
    }
  };

  const handlePress = (linha: number, coluna: number) => {
    if (partidaFinalizada || !vezHumano) return;

    const jogadaValida = partida.joga(linha, coluna);
    if (!jogadaValida) return;

    atualizaTela();
    processaFimDeTurno();
  };

  useEffect(() => {
    if (!vezHumano && !partidaFinalizada) {
      const timer = setTimeout(() => {
        const cpu = jogo.getJogador2() as JogadorAutomatizado;
        const [linha, coluna] = cpu.realizaJogada(partida.getTabuleiro());
        
        if (linha !== -1 && coluna !== -1) {
          partida.joga(linha, coluna);
          atualizaTela();
          processaFimDeTurno();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [vezHumano, partidaFinalizada]);

  const resetBoard = () => {
    const novaPartida = jogo.iniciaPartida();
    setPartida(novaPartida);
    setPartidaFinalizada(false);
    setBoardState([...novaPartida.getTabuleiro().map(row => [...row])]);
    setVezHumano(novaPartida.getVezJogador1());
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreBoard}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>{jogo.getJogador1().getNome()} (X)</Text>
          <Text style={styles.scoreValue}>{userScore}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>{jogo.getJogador2().getNome()} (O)</Text>
          <Text style={styles.scoreValue}>{computerScore}</Text>
        </View>
      </View>

      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {boardState.map((linhaArray, linha) =>
            linhaArray.map((celula, coluna) => {
              const index = linha * 3 + coluna;
              return (
                <TouchableOpacity
                  key={`${linha}-${coluna}`}
                  style={[
                    styles.square,
                    linha === 0 && styles.topRow,
                    coluna === 0 && styles.leftColumn,
                    linha === 2 && styles.bottomRow,
                    coluna === 2 && styles.rightColumn,
                  ]}
                  onPress={() => handlePress(linha, coluna)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cellText, celula === 'X' ? styles.xText : styles.oText]}>
                    {celula || ''}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetBoard}>
        <Text style={styles.resetButtonText}>Nova Partida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  topRow: {
    borderTopWidth: 0,
  },
  bottomRow: {
    borderBottomWidth: 0,
  },
  leftColumn: {
    borderLeftWidth: 0,
  },
  rightColumn: {
    borderRightWidth: 0,
  },
  cellText: {
    fontSize: SQUARE_SIZE * 0.6,
    fontWeight: 'bold',
  },
  xText: {
    color: '#2196F3',
  },
  oText: {
    color: '#FF5252',
  },
  resetButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});