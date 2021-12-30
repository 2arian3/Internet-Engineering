import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './Counter.module.css';

function Counter() {
    const [started, setStarted] = useState(false);
    const [counterMode, setCounterMode] = useState(true); // true when up counting.
    const [counter, setCounter] = useState(0);
    const [timerId, setTimerId] = useState(null);
  
    function startOrPause() {
      setStarted(!started);
      if (!started) {
        setTimerId(
          setInterval(() => {
            setCounter(prevCounter => counterMode ? prevCounter+1 : prevCounter-1);
          }, 1000)
        );
      } else {
        clearInterval(timerId);
      }
    }
  
    function toggleMode() {
      setCounterMode(!counterMode);
      if (started) {
        clearInterval(timerId);
        setTimerId(
          setInterval(() => {
            setCounter(prevCounter => !counterMode ? prevCounter+1 : prevCounter-1);
          }, 1000)
        );
      }
    }
  
    function reset() {
      clearInterval(timerId);
      setCounter(0);
      setStarted(false);
    }
    return (
        <div>
            <h1 className={ styles.counter }>Counter: { counter }</h1>
            <div className={ styles.buttons_container }>
                <Button text='Reset' func={ reset }></Button>
                <Button text={ started ? 'Pause' : 'Start' } func={ startOrPause }></Button>
                <Button text={ counterMode ? 'Down Counting' : 'Up Counting' } func={ toggleMode }></Button>
            </div>
        </div>
    )
}

export default Counter;
