// src/components/List.tsx
import styles from './List.module.css';
import '../App.tsx';
import { collection, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config.ts';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  surname: string;
  date: Timestamp;
  avatar: string;
}

function List() {
  const [users, setUsers] = useState<User[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data: User[] = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>)
      });
    });
    setUsers(data);
  }

  async function deleteUser(id: string) {
    await deleteDoc(doc(db, "users", id));
    getUsers();
  }

  const fetchImageUrl = async () => {
    const imageRef = ref(storage, 'noavatar.jpg');
    try {
      const imageUrl = await getDownloadURL(imageRef);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Failed to fetch image:', error);
      setImageUrl(''); // Set image URL to empty if there's an error
    }
  };

  useEffect(() => {
    getUsers();
    fetchImageUrl();
  }, []);

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h2>User List</h2>
        <Link to="/add" className={styles.addButton}>Add User</Link>
      </div>
      {users.map((user, index) => (
        <div className={styles.element} key={index}>
          <img src={imageUrl} alt="No Avatar" className={styles.avatar} />
          <div className={styles.details}>
            <div className={styles.name}>{user.name}<br />{user.surname}</div>
            <div className={styles.date}>
              {new Date(user.date.seconds * 1000).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </div>
          </div>
          <div className={styles.buttons}>
            <Link to={`/edit/${user.id}`} className={`${styles.button} ${styles.editButton}`}>Edytuj</Link>
            <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => deleteUser(user.id)}>Usun</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default List;
