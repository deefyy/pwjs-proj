import styles from './App.module.css';
import List from './components/List.tsx';
import { collection, getDocs, addDoc, Timestamp} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from './firebase-config.ts';
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  surname: string;
  date: Timestamp; 
  avatar: string;
}

function App() {

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [date, setDate] = useState('')
  const [imageUrl, setImageUrl] = useState('');

  async function getUsers() {

    const querySnapshot = await getDocs(collection(db, "users"));

    const data: User[] = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>)
      })
    });
    setUsers(data)
    
  }

  async function addUsers(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const docRef = await addDoc(collection(db, "users"), {
      name,
      surname,
      date,
    });

    getUsers()
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
    getUsers()
    fetchImageUrl();
  }, [])

  return (
      <div className={styles.app}>
        <List/>
        {users.map(user => (
          <div className={styles.list}>
            <div className={styles.element}>
              <img src={imageUrl} alt="No Avatar" style={{ width: '50px', height: '50px' }}/>
              <div>{user.name}<br></br>{user.surname} {user.date.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })}</div>
            </div>
          </div>
        ))}
      </div>
  )
}

export default App
