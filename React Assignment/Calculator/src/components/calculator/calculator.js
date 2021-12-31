import React, { useState } from 'react';
import Keypad from '../keypad';
import Screen from '../screen';
import s from './calculator.module.css';

export default function Calculator() {
  const [state, setState] = useState({
    currentNum: '0',
    lastNum: '0',
    op: '='
  });
  const [result, setResult] = useState('0');

  function calculation() {
    return  state.op === '+' ? (+state.currentNum) + (+state.lastNum) :
            state.op === '-' ? (+state.lastNum) - (+state.currentNum) :
            state.op === 'x' ? (+state.currentNum) * (+state.lastNum) :
            state.op === '÷' && (+state.currentNum) !== 0 ? (+state.lastNum) / (+state.currentNum) :
            state.op === '=' ? +state.currentNum : 'undefined';
  }

  function handlePressedKey(pressedKey) {
    if (pressedKey) {
      switch (pressedKey) {
        case '+':
          setResult(String(calculation()));
          setState({
            currentNum: '0',
            lastNum: String(calculation()),
            op: '+'
          });
          break;
        case '-':
          setResult(String(calculation()));
          setState({
            currentNum: '0',
            lastNum: String(calculation()),
            op: '-'
          });
          break;
        case 'x':
          setResult(String(calculation()));
          setState({
            currentNum: '0',
            lastNum: String(calculation()),
            op: 'x'
          });
          break;
        case '÷':
          setResult(String(calculation()));
          setState({
            currentNum: '0',
            lastNum: String(calculation()),
            op: '÷'
          });
          break;
        case '%':
          setResult(String(parseFloat(state.currentNum) / 100));
          setState({
            currentNum: String(parseFloat(state.currentNum) / 100),
            lastNum: state.lastNum,
            op: state.op
          });
          break;
        case '.':
          if (!state.currentNum.includes('.')) {
            setState({
              currentNum: state.currentNum + '.',
              lastNum: state.lastNum,
              op: state.op
            });
          }
          break;
        case '+/-':
          setResult(String(-state.currentNum));
          setState({
            currentNum: String(-state.currentNum),
            lastNum: state.lastNum,
            op: state.op
          });
          break;
        case '=':
          if (state.op !== '=') {
            const resultOfCalc = String(calculation());
            if (resultOfCalc !== 'undefined') {
              setResult(String(calculation()));
              setState({
                currentNum: String(calculation()),
                lastNum: '0',
                op: '='
              });
            } else {
              setResult('Invalid Input');
              setTimeout(() => {
                setResult('0');
                setState({
                  currentNum: '0',
                  lastNum: '0',
                  op: '='
                });
              }, 500);
            }
          }
          break;
        case 'C':
          setResult('0');
          setState({
            currentNum: '0',
            lastNum: '0',
            op: '='
          });
          break;
        default:
          const newValue = state.currentNum === '0' ? pressedKey : state.currentNum + pressedKey;
          setResult(newValue);
          setState({
            currentNum: newValue,
            lastNum: state.lastNum,
            op: state.op
          });
          break;
      }
    }
  }

  return (
    <div className={s.calculator}>
      <Screen text={ result }/>
      <Keypad pressedKey={ handlePressedKey } currentOp={ state.op }/>
    </div>
  );
}
