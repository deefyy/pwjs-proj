// src/components/EditUser.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config.ts';
import styles from './EditUser.module.css';

function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [date, setDate] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState('');

  useEffect(() => {
    async function fetchUser() {
      if (id) {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setSurname(userData.surname);
          setDate(new Date(userData.date.seconds * 1000).toISOString().split('T')[0]);
          setExistingAvatarUrl(userData.avatar);
        }
      }
    }
    fetchUser();
  }, [id]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let avatarUrl = existingAvatarUrl;
    if (avatar) {
      const avatarRef = ref(storage, `avatars/${avatar.name}`);
      await uploadBytes(avatarRef, avatar);
      avatarUrl = await getDownloadURL(avatarRef);
    }
    if (id) {
      const userDoc = doc(db, 'users', id);
      await updateDoc(userDoc, { name, surname, date: Timestamp.fromDate(new Date(date)), avatar: avatarUrl });
      navigate('/');
    }
  }

  return (
    <div className={styles.editUser}>
      <h2>Edit User</h2>
      <form onSubmit={handleUpdate}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Surname" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="file" onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)} />
        {existingAvatarUrl && <img src={existingAvatarUrl} alt="Avatar" className={styles.avatarPreview} />}
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default EditUser;