// TaskManagerApp.jsx

import { Routes, Route, useNavigate } from 'react-router-dom';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { useMemo, useState, useEffect } from 'react';
import './App.css';
import { DialogWrapper } from './DialogWrapper';
import { NavBar } from './NavBar';
import { TaskWrapper } from './TaskWrapper';
import { UpComing } from './upComing';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import TokenLoginPage from './TokenLoginPage';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [titleValue, setTitleValue] = useState('All ');
  const [folders, setFolders] = useState([
    { id: '1', folderText: 'Work' },
    { id: '2', folderText: 'Personal' }
  ]);
  const [dialog, setDialog] = useState({ isOpen: false, type: null, data: null });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const openDialog = (type, data) => setDialog({ isOpen: true, type, data });
  const closeDialog = () => setDialog({ isOpen: false, type: null, data: null });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 't') openDialog("addTask", {});
      if (event.shiftKey && event.key.toLowerCase() === 'f') openDialog("addFolder", {});
      if (event.shiftKey && event.key.toLowerCase() === 'p') setShowFavorites(true);
      if (event.shiftKey && event.key.toLowerCase() === 'a') setShowFavorites(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addTask = async (task) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add tasks");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3001/api/tasks", task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prev => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to save task", error);
      alert("Failed to save task");
    }
  };

  const handleFolderSubmit = (folderText) => {
    if (!folderText?.trim()) return;
    setFolders(prev => [...prev, { id: String(prev.length + 1), folderText: folderText.trim() }]);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete tasks");
      return;
    }
    try {
      await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update tasks");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${updatedTask._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      setTasks(prev => prev.map(task => task._id === data._id ? data : task));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getConfirmAction = () => {
    switch (dialog.type) {
      case "deleteTask": return handleDelete;
      case "deleteFolder": return (id) => setFolders(prev => prev.filter(f => f.id !== id));
      case "addFolder": return handleFolderSubmit;
      case "addTask": return addTask;
      case "editTask": return handleUpdateTask;
      case "addUser": return async (email) => {
        try {
          const res = await axios.post('/api/login', { email });
          console.log("Login link sent:", res.data);
        } catch (err) {
          console.error("Failed to send login link:", err);
        }
      };
      default: return () => {};
    }
  };

  const showCurrentList = useMemo(() => selectedFolder
    ? tasks.filter(task => task.currentList === selectedFolder)
    : tasks, [tasks, selectedFolder]);

  return (
    <Routes>
      <Route path="/" element={
        <DialogsProvider>
          <DialogWrapper
            confirmDelete={handleDelete}
            confirmAction={getConfirmAction()}
            dialogType={dialog.type}
            isOpen={dialog.isOpen}
            handleClose={closeDialog}
            tasks={tasks}
            dialogData={dialog.data}
            folders={folders}
            addTask={addTask} />

          <div className='App'>
            <div className='left-side'>
              <NavBar
                tasks={tasks}
                favorites={tasks.filter(task => task.isFavorite)}
                toggleFavorites={() => setShowFavorites(true)}
                showAllTasks={() => setShowFavorites(false)}
                setTitle={setTitleValue}
                handleFolderClick={(folderName) => {
                  setShowFavorites(false);
                  setSelectedFolder(folderName === "All Tasks" ? null : folderName);
                }}
              />
              <UpComing
                folders={folders}
                addFolder={(name) => setFolders(prev => [...prev, { id: uuidv4(), folderText: name }])}
                setFolders={setFolders}
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogType={dialog.type}
                showCurrentList={(name) => setSelectedFolder(name)}
              />
            </div>

            <div className='right-side'>
              <TaskWrapper
                tasks={showFavorites ? tasks.filter(task => task.isFavorite) : showCurrentList}
                setTasks={setTasks}
                addTask={addTask}
                handleDelete={handleDelete}
                titleValue={titleValue}
                openDialog={openDialog}
                closeDialog={closeDialog}
                dialogType={dialog.type}
                folders={folders}
                setFolders={setFolders}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </DialogsProvider>
      } />
      <Route path="/token-login" element={<TokenLoginPage />} />
    </Routes>
  );
}

export default App;
