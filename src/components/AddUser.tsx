// src/components/AddUser.tsx
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase-config.ts';
import styles from './AddUser.module.css';

function AddUser() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [date, setDate] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const navigate = useNavigate();

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let avatarUrl = '';
    if (avatar) {
      const avatarRef = ref(storage, `avatars/${avatar.name}`);
      await uploadBytes(avatarRef, avatar);
      avatarUrl = await getDownloadURL(avatarRef);
    }
    await addDoc(collection(db, 'users'), {
      name,
      surname,
      date: Timestamp.fromDate(new Date(date)),
      avatar: avatarUrl,
    });
    navigate('/');
  }

  return (
    <div className={styles.addUser}>
      <h2>Add User</h2>
      <form onSubmit={handleAdd}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Surname" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="file" onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)} />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;