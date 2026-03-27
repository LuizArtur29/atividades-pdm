import React, { useState } from 'react';
import Layout, { Operador } from './layout';

export default function CalculadoraIndex() {
  const [valorAtual, setValorAtual] = useState<string>('0');
  const [valorAnterior, setValorAnterior] = useState<string | null>(null);
  const [operador, setOperador] = useState<Operador>(null);

  const calcular = () => {
    if (!operador || !valorAnterior) return;

    const numAtual = parseFloat(valorAtual);
    const numAnterior = parseFloat(valorAnterior);
    let resultado = 0;

    switch (operador) {
      case '+':
        resultado = numAnterior + numAtual;
        break;
      case '-':
        resultado = numAnterior - numAtual;
        break;
      case '*':
        resultado = numAnterior * numAtual;
        break;
      case '/':
        if (numAtual === 0) {
          setValorAtual('Erro');
          setOperador(null);
          setValorAnterior(null);
          return;
        }
        resultado = numAnterior / numAtual;
        break;
      case '^':
        resultado = Math.pow(numAnterior, numAtual); 
        break;
      default:
        return;
    }

    setValorAtual(String(resultado));
    setOperador(null);
    setValorAnterior(null);
  };

  const lidarComToque = (valorDoBotao: string) => {
    if (valorDoBotao === 'C') {
      setValorAtual('0');
      setValorAnterior(null);
      setOperador(null);
      return;
    }

    if (['+', '-', '*', '/', '^'].includes(valorDoBotao)) {
      if (operador && valorAtual === '0') {
        setOperador(valorDoBotao as Operador);
        return;
      }
      setOperador(valorDoBotao as Operador);
      setValorAnterior(valorAtual);
      setValorAtual('0'); 
      return;
    }

    if (valorDoBotao === '=') {
      calcular();
      return;
    }

    if (valorDoBotao === '.') {
      if (!valorAtual.includes('.')) {
        setValorAtual(valorAtual + '.');
      }
      return;
    }

    if (valorAtual === '0' || valorAtual === 'Erro') {
      setValorAtual(valorDoBotao);
    } else {
      setValorAtual(valorAtual + valorDoBotao);
    }
  };

  return (
    <Layout 
      valorAtual={valorAtual}
      valorAnterior={valorAnterior}
      operador={operador}
      lidarComToque={lidarComToque}
    />
  );
}