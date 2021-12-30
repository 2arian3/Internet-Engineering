import React, { useState } from 'react';
import Keypad from '../keypad';
import Screen from '../screen';
import s from './calculator.module.css';

export default function Calculator() {
  const [state, setState] = useState({
    currentNum: '0',
    result: '0',
    op: '='
  });

  function calculation() {
    return  state.op === '+' ? (+state.currentNum) + (+state.result) :
            state.op === '-' ? (+state.result) - (+state.currentNum) :
            state.op === 'x' ? (+state.currentNum) * (+state.result) :
            state.op === '÷' && (+state.currentNum) !== 0 ? (+state.result) / (+state.currentNum) :
            'undefined';
  }

  function handlePressedKey(pressedKey) {
    if (pressedKey) {
      switch (pressedKey) {
        case '+':
          setState({
            currentNum: '0',
            result: state.currentNum,
            op: '+'
          });
          break;
        case '-':
          setState({
            currentNum: '0',
            result: state.currentNum,
            op: '-'
          });
          break;
        case 'x':
          setState({
            currentNum: '0',
            result: state.currentNum,
            op: 'x'
          });
          break;
        case '÷':
          setState({
            currentNum: '0',
            result: state.currentNum,
            op: '÷'
          });
          break;
        case '%':
          setState({
            currentNum: String(parseFloat(state.currentNum) / 100),
            result: state.result,
            op: state.op
          });
          break;
        case '.':
          if (!state.currentNum.includes('.')) {
            setState({
              currentNum: state.currentNum + '.',
              result: state.result,
              op: state.op
            });
          }
          break;
        case '+/-':
          setState({
            currentNum: String(-state.currentNum),
            result: state.result,
            op: state.op
          });
          break;
        case '=':
          if (state.op !== '=') {
            const resultOfCalc = String(calculation());
            if (resultOfCalc !== 'undefined') {
              setState({
                currentNum: String(calculation()),
                result: '0',
                op: '='
              });
            } else {
              setState({
                currentNum: 'Invalid Input',
                result: '0',
                op: '='
              });
              setTimeout(() => {
                setState({
                  currentNum: '0',
                  result: '0',
                  op: '='
                });
              }, 500);
            }
          }
          break;
        case 'C':
          setState({
            currentNum: '0',
            result: '0',
            op: '='
          });
          break;
        default:
          const newValue = state.currentNum === '0' ? pressedKey : state.currentNum + pressedKey;
          setState({
            currentNum: newValue,
            result: state.result,
            op: state.op
          });
          break;
      }
    }
  }

  return (
    <div className={s.calculator}>
      <Screen text={ state.currentNum }/>
      <Keypad pressedKey={ handlePressedKey }/>
    </div>
  );
}
