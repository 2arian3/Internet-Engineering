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
  const [entered, setEntered] = useState(false);
  const [lastOpNum, setLastOpNum] = useState(null);

  function calculation() {
    let firstNum = state.currentNum;
    let secondNum = state.lastNum;
    if (lastOpNum) {
      if (['+', 'x'].includes(state.op)) {
        secondNum = lastOpNum;
      } else if (['-', '÷'].includes(state.op)) {
        secondNum = state.currentNum;
        firstNum = lastOpNum;
      }
    }
    return  state.op === '+' ? (+secondNum) + (+firstNum) :
            state.op === '-' ? (+secondNum) - (+firstNum) :
            state.op === 'x' ? (+secondNum) * (+firstNum) :
            state.op === '÷' && (+firstNum) !== 0 ? (+secondNum) / (+firstNum) :
            state.op === '' ? +state.currentNum : 'undefined';
  }

  function handlePressedKey(pressedKey) {
    if (pressedKey) {
      switch (pressedKey) {
        case '+':
          setLastOpNum(null);
          if (entered) {
            setResult(String(calculation()));
            setState({
              currentNum: '0',
              lastNum: String(calculation()),
              op: '+'
            });
          } else {
            setState({
              currentNum: '0',
              lastNum: state.currentNum,
              op: '+'
            });
          }
          setEntered(false);
          break;
        case '-':
          setLastOpNum(null);
          if (entered) {
            setResult(String(calculation()));
            setState({
              currentNum: '0',
              lastNum: String(calculation()),
              op: '-'
            });
          } else {
            setState({
              currentNum: '0',
              lastNum: state.currentNum,
              op: '-'
            });
          }
          setEntered(false);
          break;
        case 'x':
          setLastOpNum(null);
          if (entered) {
            setResult(String(calculation()));
            setState({
              currentNum: '0',
              lastNum: String(calculation()),
              op: 'x'
            });
          } else {
            setState({
              currentNum: '0',
              lastNum: state.currentNum,
              op: 'x'
            });
          }
          setEntered(false);
          break;
        case '÷':
          setLastOpNum(null);
          let resultOfCalc = String(calculation());
          if (resultOfCalc !== 'undefined' && entered) {
            setResult(resultOfCalc);
            setState({
              currentNum: '0',
              lastNum: String(resultOfCalc),
              op: '÷'
            });
          } else if (resultOfCalc === 'undefined') {
            setResult('Invalid Input');
            setTimeout(() => {
              setResult('0');
              setState({
                currentNum: '0',
                lastNum: '0',
                op: ''
              });
            }, 500);
          } else {
            setState({
              currentNum: '0',
              lastNum: state.currentNum,
              op: '÷'
            });
          }
          setEntered(false);
          break;
        case '%':
          setLastOpNum(null);
          setResult(String(parseFloat(state.currentNum) / 100));
          setState({
            currentNum: String(parseFloat(state.currentNum) / 100),
            lastNum: state.lastNum,
            op: state.op
          });
          break;
        case '.':
          if (!state.currentNum.includes('.')) {
            setLastOpNum(null);
            setResult(state.currentNum + '.');
            setState({
              currentNum: state.currentNum + '.',
              lastNum: state.lastNum,
              op: state.op
            });
          }
          break;
        case '+/-':
          setLastOpNum(null);
          setResult(String(-state.currentNum));
          setState({
            currentNum: String(-state.currentNum),
            lastNum: state.lastNum,
            op: state.op
          });
          break;
        case '=':
          if (state.op) {
            setEntered(false);
            let resultOfCalc = String(calculation());
            if (resultOfCalc !== 'undefined') {
              if (!lastOpNum) {
                setLastOpNum(state.currentNum);
              }
              setResult(resultOfCalc);
              setState({
                currentNum: resultOfCalc,
                lastNum: state.currentNum,
                op: state.op
              });
            } else {
              setLastOpNum(null);
              setResult('Invalid Input');
              setTimeout(() => {
                setResult('0');
                setState({
                  currentNum: '0',
                  lastNum: '0',
                  op: ''
                });
              }, 500);
            }
          }
          break;
        case 'C':
          setLastOpNum(null);
          setEntered(false);
          setResult('0');
          setState({
            currentNum: '0',
            lastNum: '0',
            op: ''
          });
          break;
        default:
          const newValue = state.currentNum === '0' || lastOpNum ? pressedKey : state.currentNum + pressedKey;
          setEntered(true);
          setResult(newValue);
          setState({
            currentNum: newValue,
            lastNum: state.lastNum,
            op: lastOpNum ? '' : state.op
          });
          setLastOpNum(null);
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
