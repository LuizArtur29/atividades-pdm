import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const buttonWidth = screenWidth / 4; 

export type Operador = '+' | '-' | '*' | '/' | '^' | null;

interface BotaoProps {
  texto: string;
  onPress: (texto: string) => void;
  destaque?: boolean;
}

const Botao = ({ texto, onPress, destaque }: BotaoProps) => {
  return (
    <TouchableOpacity 
      style={[styles.botao, destaque && styles.botaoDestaque]} 
      onPress={() => onPress(texto)}
    >
      <Text style={[styles.textoBotao, destaque && styles.textoBotaoDestaque]}>
        {texto}
      </Text>
    </TouchableOpacity>
  );
};

interface LayoutProps {
  valorAtual: string;
  valorAnterior: string | null;
  operador: Operador;
  lidarComToque: (valorDoBotao: string) => void;
}

export default function Layout({ valorAtual, valorAnterior, operador, lidarComToque }: LayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.historicoText}>
          {valorAnterior != null ? `${valorAnterior} ${operador}` : ''}
        </Text>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {valorAtual}
        </Text>
      </View>

      <View style={styles.tecladoContainer}>
        <View style={styles.linha}>
          <Botao texto="C" onPress={lidarComToque} destaque />
          <Botao texto=" " onPress={() => {}} destaque /> 
          <Botao texto="^" onPress={lidarComToque} destaque />
          <Botao texto="/" onPress={lidarComToque} destaque />
        </View>
        <View style={styles.linha}>
          <Botao texto="7" onPress={lidarComToque} />
          <Botao texto="8" onPress={lidarComToque} />
          <Botao texto="9" onPress={lidarComToque} />
          <Botao texto="*" onPress={lidarComToque} destaque />
        </View>
        <View style={styles.linha}>
          <Botao texto="4" onPress={lidarComToque} />
          <Botao texto="5" onPress={lidarComToque} />
          <Botao texto="6" onPress={lidarComToque} />
          <Botao texto="-" onPress={lidarComToque} destaque />
        </View>
        <View style={styles.linha}>
          <Botao texto="1" onPress={lidarComToque} />
          <Botao texto="2" onPress={lidarComToque} />
          <Botao texto="3" onPress={lidarComToque} />
          <Botao texto="+" onPress={lidarComToque} destaque />
        </View>
        <View style={styles.linha}>
          <Botao texto="00" onPress={lidarComToque} />
          <Botao texto="0" onPress={lidarComToque} />
          <Botao texto="." onPress={lidarComToque} />
          <Botao texto="=" onPress={lidarComToque} destaque />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#202020' },
  displayContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 20, backgroundColor: '#202020' },
  historicoText: { fontSize: 24, color: '#888888', marginBottom: 10 },
  displayText: { fontSize: 70, color: '#ffffff', fontWeight: '300' },
  tecladoContainer: { flex: 2, backgroundColor: '#303030' },
  linha: { flexDirection: 'row', flex: 1 },
  botao: { width: buttonWidth, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#404040' },
  botaoDestaque: { backgroundColor: '#ff9800' },
  textoBotao: { fontSize: 32, color: '#ffffff' },
  textoBotaoDestaque: { color: '#ffffff', fontWeight: 'bold' },
});