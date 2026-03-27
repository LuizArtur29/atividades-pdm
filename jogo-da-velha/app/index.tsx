import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.85;
const SQUARE_SIZE = BOARD_SIZE / 3;

export default function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(true);

  const checkWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  useEffect(() => {
    if (!isUserTurn) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn]);

  const makeComputerMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === '' ? idx : null))
      .filter((val) => val !== null) as number[];

    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleWin(winner);
    } else if (!newBoard.includes('')) {
      handleDraw();
    } else {
      setIsUserTurn(true);
    }
  };

  const handlePress = (index: number) => {
    if (board[index] !== '' || !isUserTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleWin(winner);
    } else if (!newBoard.includes('')) {
      handleDraw();
    } else {
      setIsUserTurn(false);
    }
  };

  const handleWin = (winner: string) => {
    if (winner === 'X') {
      setUserScore((prev) => prev + 1);
      Alert.alert('Fim de Jogo', 'Você venceu!');
    } else {
      setComputerScore((prev) => prev + 1);
      Alert.alert('Fim de Jogo', 'O Computador venceu!');
    }
    resetBoard();
  };

  const handleDraw = () => {
    Alert.alert('Fim de Jogo', 'Deu velha!');
    resetBoard();
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(''));
    setIsUserTurn(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreBoard}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Você (X)</Text>
          <Text style={styles.scoreValue}>{userScore}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Computador (O)</Text>
          <Text style={styles.scoreValue}>{computerScore}</Text>
        </View>
      </View>

      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {board.map((cell, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.square,
                index < 3 && styles.topRow,
                index % 3 === 0 && styles.leftColumn,
                index > 5 && styles.bottomRow,
                index % 3 === 2 && styles.rightColumn,
              ]}
              onPress={() => handlePress(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cellText, cell === 'X' ? styles.xText : styles.oText]}>
                {cell}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetBoard}>
        <Text style={styles.resetButtonText}>Reiniciar Partida</Text>
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