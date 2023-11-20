import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { ref, onValue, remove, set, update } from "firebase/database";
import "./homepage.css";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).forEach((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const writeToDatabase = () => {
    const uidd = uid();
    const now = new Date().toISOString();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
      lastOpened: now,
    });
    setTodo("");
  };

  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    const now = new Date().toISOString();
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      uidd: tempUidd,
      lastOpened: now,
    });
    setTodo("");
    setIsEdit(false);
  };

  const handleDelete = (uidd) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uidd}`));
  };

  const reversedTodos = [...todos].reverse();

  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = reversedTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = todos.length; i >= 1; i--) {
    pageNumbers.push(i);
  }

  // Function to format the date
  const formatDate = (isoString) => {
    return isoString ? new Date(isoString).toISOString().split('T')[0] : 'N/A';
  };

  return (
    <div className="homepage">
      <input
        className="add-edit-input"
        type="text"
        placeholder="Add Notes Here..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />

      {currentTodos.map((todo, index) => (
        <div key={index} className="todo">
          <h1>{todo.todo}</h1>
          <p style={{ color: 'white' }}>Date: {formatDate(todo.lastOpened)}</p>
          <EditIcon
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          <DeleteIcon
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
        </div>
      ))}

      <div style={{ marginBottom: '10px' }}>
        {isEdit ? (
          <button onClick={handleEditConfirm}>Confirm Edit</button>
        ) : (
          <button onClick={writeToDatabase}>
            <AddCircleOutlineIcon fontSize="large" />
          </button>
        )}
      </div>

      <button onClick={handleSignOut}>Sign Out</button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            style={{
              border: 'none',
              padding: '10px',
              margin: '5px',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer'
            }}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}
