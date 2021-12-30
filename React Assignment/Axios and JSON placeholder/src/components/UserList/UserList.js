import React from 'react';
import User from '../User/User';
import styles from './UserList.module.css';

function UserList({ users }) {
    return (
        <div className={ styles.container }>
            <div className={ styles.header }>
                <div className={ styles.field }>ID</div>
                <div className={ styles.field }>Email</div>
                <div className={ styles.field }>Name</div>
                <div className={ styles.field }>Phone</div>
                <div className={ styles.field }>Website</div>
            </div>
            { users.map(user => <User key={ user.id } id={ user.id } phone={ user.phone } email={ user.email } name={user.name} website={ user.website }></User>) }
        </div>
    )
}

export default UserList;
