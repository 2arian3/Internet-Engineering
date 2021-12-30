import styles from './Button.module.css'

const Button = ({ text, func }) => {
    return (
        <div>
            <button className={ styles.btn } onClick={ func }>
                { text }
            </button>
        </div>
    )
}

export default Button
