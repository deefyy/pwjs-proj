// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import List from './components/List';
import EditUser from './components/EditUser';
import AddUser from './components/AddUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/edit/:id" element={<EditUser />} />
        <Route path="/add" element={<AddUser />} />
      </Routes>
    </Router>
  );
}

export default App;
