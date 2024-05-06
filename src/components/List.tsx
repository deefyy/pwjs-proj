import styles from './List.module.css'
import '../App.tsx'

function List() {
    return (
        <div className={styles.list}>
            {users.map(user => (
                <div style={{borderBottom: '1px solid black'}}>
                    <div>Nazwa: {user.name}</div>
                </div>
            ))}
        </div>
    )
}

export default List