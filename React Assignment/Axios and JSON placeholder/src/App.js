import styles from './App.module.css';
import gif from './loading.gif';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList/UserList';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      setUsers((await axios.get('https://jsonplaceholder.typicode.com/users')).data);
      setLoaded(true);
    }
    getUsers();
  }, []);

  return (
    <div className={ styles.App }>
      {
        loaded ? <UserList users={ users }></UserList> : <img src={ gif } alt='loading' width={100} className={ styles.loading }></img>
      }
    </div>
  );
}

export default App;
