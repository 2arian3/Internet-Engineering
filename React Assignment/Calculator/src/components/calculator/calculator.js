import React, { useState } from 'react';
import Keypad from '../keypad';
import Screen from '../screen';
import s from './calculator.module.css';

export default function Calculator() {
  const [state, setState] = useState({
    currentNum: null,
    lastNum: null,
    op: ''
  });
  const [result, setResult] = useState('0');
  const [enteredNum, setEnteredNum] = useState(false);
  const [lastOpNum, setLastOpNum] = useState(null);
  const [pressedEqual, setPressedEqual] = useState(false);

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
          if (state.currentNum && state.lastNum && !pressedEqual) {
            setResult(String(calculation()));
            setState({
              currentNum: null,
              lastNum: String(calculation()),
              op: '+'
            });
          } else if (enteredNum && state.currentNum) {
            setState({
              currentNum: null,
              lastNum: state.currentNum,
              op: '+'
            });
          } else {
            setState({
              currentNum: state.currentNum,
              lastNum: state.lastNum,
              op: '+'
            });
          }
          setPressedEqual(false);
          setEnteredNum(false);
          break;
        case '-':
          setLastOpNum(null);
          if (state.currentNum && state.lastNum && !pressedEqual) {
            setResult(String(calculation()));
            setState({
              currentNum: null,
              lastNum: String(calculation()),
              op: '-'
            });
          } else if (enteredNum && state.currentNum) {
            setState({
              currentNum: null,
              lastNum: state.currentNum,
              op: '-'
            });
          } else {
            setState({
              currentNum: state.currentNum,
              lastNum: state.lastNum,
              op: '-'
            });
          }
          setPressedEqual(false);
          setEnteredNum(false);
          break;
        case 'x':
          setLastOpNum(null);
          if (state.currentNum && state.lastNum && !pressedEqual) {
            setResult(String(calculation()));
            setState({
              currentNum: null,
              lastNum: String(calculation()),
              op: 'x'
            });
          } else if (enteredNum && state.currentNum) {
            setState({
              currentNum: null,
              lastNum: state.currentNum,
              op: 'x'
            });
          } else {
            setState({
              currentNum: state.currentNum,
              lastNum: state.lastNum,
              op: 'x'
            });
          }
          setPressedEqual(false);
          setEnteredNum(false);
          break;
        case '÷':
          setLastOpNum(null);
          let resultOfCalc = String(calculation());
          if (state.currentNum && state.lastNum && resultOfCalc !== 'undefined' && !pressedEqual) {
            setResult(resultOfCalc);
            setState({
              currentNum: null,
              lastNum: String(resultOfCalc),
              op: '÷'
            });
          } else if (state.currentNum && state.lastNum && resultOfCalc === 'undefined') {
            setResult('Invalid Input');
            setTimeout(() => {
              setResult('0');
              setState({
                currentNum: null,
                lastNum: null,
                op: '÷'
              });
            }, 500);
          } else if (enteredNum && state.currentNum) {
            setState({
              currentNum: null,
              lastNum: state.currentNum,
              op: '÷'
            });
          } else {
            setState({
              currentNum: state.currentNum,
              lastNum: state.lastNum,
              op: '÷'
            });
          }
          setPressedEqual(false);
          setEnteredNum(false);
          break;
        case '%':
          setLastOpNum(null);
          setPressedEqual(true);
          setResult(String(parseFloat(state.currentNum) / 100));
          setState({
            currentNum: String(parseFloat(state.currentNum) / 100),
            lastNum: state.lastNum,
            op: state.op
          });
          break;
        case '.':
          if ((state.currentNum && !state.currentNum.includes('.')) || !state.currentNum) {
            setLastOpNum(null);
            setResult(state.currentNum + '.');
            setState({
              currentNum: state.currentNum ? state.currentNum + '.' : '0.',
              lastNum: state.lastNum,
              op: state.op
            });
          }
          break;
        case '+/-':
          setLastOpNum(null);
          setResult(String(-state.currentNum));
          setPressedEqual(true);
          setState({
            currentNum: String(-state.currentNum),
            lastNum: state.lastNum,
            op: state.op
          });
          break;
        case '=':
          if (state.op && state.currentNum && state.lastNum) {
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
                  currentNum: null,
                  lastNum: null,
                  op: ''
                });
              }, 500);
            }
            setPressedEqual(true);
          }
          break;
        case 'C':
          setEnteredNum(false);
          setLastOpNum(null);
          setPressedEqual(false);
          setResult('0');
          setState({
            currentNum: null,
            lastNum: null,
            op: ''
          });
          break;
        default:
          const newValue = state.currentNum === null || lastOpNum ? pressedKey : state.currentNum + pressedKey;
          setResult(newValue);
          setEnteredNum(true);
          setPressedEqual(false);
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
