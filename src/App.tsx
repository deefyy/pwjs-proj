import './App.css'
import List from './components/List.tsx'
import { collection, getDocs, addDoc} from "firebase/firestore";
import { db } from './firebase-config.ts'
import { useEffect, useState } from "react";

function App() {

  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [date, setDate] = useState('')
  const [avatar, setAvatar] = useState('')

  async function getUsers() {

    const querySnapshot = await getDocs(collection(db, "users"));

    const data = []
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      })
    });
    setUsers(data)
  }

  async function addUsers(e) {
    e.preventDefault()
    const docRef = await addDoc(collection(db, "users"), {
      name,
      surname,
      date,
      avatar
    });

    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
      <div>
        <List/>
      </div>
  )
}

export default App
