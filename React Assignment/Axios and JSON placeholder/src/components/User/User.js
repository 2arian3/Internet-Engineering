import React from 'react'
import PropTypes from 'prop-types';
import styles from './User.module.css';

function User({ id, phone, email, name, website }) {
    return (
        <div className={ styles.container }>
            <div className={ styles.field }>{ id }</div>
            <div className={ styles.field }>{ email }</div>
            <div className={ styles.field }>{ name }</div>
            <div className={ styles.field }>{ phone }</div>
            <div className={ styles.field }>{ website }</div>
        </div>
    )
}

User.propTypes = {
    id: PropTypes.number.isRequired,
    phone: PropTypes.string,
    email: PropTypes.string.isRequired,
    name: PropTypes.string,
    website: PropTypes.string
}

User.defaultProps = {
    id: 0,
    phone: '-',
    email: '-',
    name: '-',
    website: '-'
}

export default User;
