import styles from './App.module.css';
import Counter from './components/Counter/Counter';

const App = () => {
  return (
    <div className={ styles.App }>
      <Counter></Counter>
    </div>
  );
}

export default App;
