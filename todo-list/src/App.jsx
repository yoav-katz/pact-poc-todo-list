import { DialogsProvider } from '@toolpad/core/useDialogs';
import { useMemo, useState } from 'react';
import './App.css';
import { DialogWrapper } from './DialogWrapper';
import { NavBar } from './NavBar';
import { TaskWrapper } from './TaskWrapper';
import { UpComing } from './upComing'; // Ensure this matches the actual file name
import  { FolderForm }  from './FolderForm';
import { v4 as uuidv4 } from 'uuid';
import CustomizedMenus from './IconMenu';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]); // Start empty

  useEffect(() => {
    // Fetch tasks from backend API on mount
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data); // Set fetched tasks to state
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const [showFavorites, setShowFavorites] = useState(false);
  const [titleValue, setTitleValue] = useState('All ')
  const [folders, setFolders] = useState([
      { id: "1", folderText: "Work"},
      { id: "2", folderText: "Personal"}
    ]); // ✅ Ensure folders exist


  const [dialog, setDialog] = useState({
    isOpen: false,
    type: null, // "deleteTask", "editTask"
    data: null,
  });

  const [selectedFolder, setSelectedFolder] = useState(null);

  

  const openDialog = (type, data) => {
    console.log("Opening Dialog with Data:", data); // Debugging output
    setDialog({ isOpen: true, type, data });
  };
  
  const closeDialog = () => {
    setDialog({ isOpen: false, type: null, data: null });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === "t") {
        event.preventDefault(); // Prevents opening a new tab in browsers
        openDialog("addTask", {});
      }
      if (event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault(); // Prevents opening a new tab in browsers
        openDialog("addFolder", {});
      }
      if (event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault(); // Prevents opening a new tab in browsers
        toggleFavorites();
      }
      if (event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault(); // Prevents opening a new tab in browsers
        showAllTasks();
      }


    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  const addTask = async (task) => {
  try {
    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to save task");
    }

    const savedTask = await response.json();
    console.log("📬 Task saved to DB:", savedTask);

    // Update local state with the saved task (from DB)
    setTasks((prev) => [...prev, savedTask]);
  } catch (error) {
    console.error("❌ Error saving task to backend:", error);
  }
};


  const addFolder = async (folderName) => {
  try {
    const response = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName }),
    });

    const savedFolder = await response.json();
    console.log("Folder saved:", savedFolder);
    
    // Optionally: Update your folder list in the UI
    setFolders((prev) => [...prev, savedFolder]);
  } catch (error) {
    console.error("Error saving folder:", error);
  }
};


  const favorites = useMemo(() => tasks.filter(task => task.isFavorite), [tasks]);

  const showCurrentList = useMemo(() => {
  
    if (!selectedFolder) {
      return tasks; // ✅ Show all tasks when no folder is selected
    }
  
    const filteredTasks = tasks.filter((task) => task.currentList === selectedFolder);
    console.log("📌 Filtered Tasks for Folder:", filteredTasks); 
  
    return filteredTasks;
  }, [tasks, selectedFolder]);

  const handleFolderClick = (folderName) => {
    console.log("📌 Selected Folder:", folderName);
    setShowFavorites(false);
    if (folderName === "All Tasks") {
      setSelectedFolder(null);
    } else {
      setSelectedFolder(folderName);
    }
  
    setTitle(folderName); // ✅ Update UI title
  };

  const toggleFavorites = () => {
    setShowFavorites(true); // Toggle between showing favorites and all
  };
  
  const showAllTasks = () => {
    setShowFavorites(false);
  };

  const setTitle = (title) => {
    setTitleValue(title); // change title above tasks
 };

const handleDelete = async (id) => {
  console.log("Deleting Task ID:", id);

  if (!id) {
    console.warn("Error: Missing Task ID!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }

    setTasks(prev => prev.filter(task => task._id !== id));
    console.log("Task successfully deleted.");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const handleFolderDelete = (id) => {
  console.log("Deleting Folder ID:", id); // ✅ Debugging output

  if (!id) {
    console.warn("Error: Missing Folder ID!"); 
    return;
  }

  setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== id));
};

const handleUpdateTask = async (updatedTask) => {
  console.log("Updating Task:", updatedTask);
  console.log("🆔 ID used:", updatedTask._id);          // ✅ Add this too

  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${updatedTask._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const data = await response.json();

    // Update the frontend state
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === data._id ? data : task
      )
    );

    console.log("Task updated in backend and frontend.");
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const getConfirmAction = () => {
  switch (dialog.type) {
    case "deleteTask": return handleDelete;
    case "deleteFolder": return handleFolderDelete;
    case "addFolder": return handleFolderSubmit;
    case "addTask": return addTask; 
    case "editTask": return handleUpdateTask; // Add case for editing tasks
    case "addUser":
      return async (userEmail) => {
        try {
          console.log("Sending email to:", userEmail);
          const res = await axios.post('/api/email', { to: userEmail });
          console.log("Email sent:", res.data);
        } catch (err) {
          console.error("Failed to send email:", err.response?.data || err.message);
        }
      };
  }
};

const handleFolderSubmit = (folderText) => {
  if (!folderText || !folderText.trim()) return; 

  setFolders((prevFolders) => [
    ...prevFolders,
    { id: String(prevFolders.length + 1), folderText: folderText.trim() }
  ]);

  console.log("Updated folders:", folders);
};

return (
  <DialogsProvider >
    <DialogWrapper className='dialog-task-wrapper' 
    confirmDelete={handleDelete}
    confirmAction={getConfirmAction()}
    dialogType={dialog.type} 
    isOpen={dialog.isOpen}
    handleClose={() => setDialog({ isOpen: false, type: "", data: null })}
    tasks={tasks}
    dialogData={dialog.data}
    folders={folders} /> 
    
    <div className='App'>
      <div className='left-side'>
      <NavBar 
        tasks={tasks}
        favorites={favorites}
        toggleFavorites={toggleFavorites} 
        showAllTasks={showAllTasks} 
        setTitle={setTitle}
        handleFolderClick={handleFolderClick}
        
      />
      <UpComing 
      folders={folders}
      addFolder={addFolder}
      setFolders={setFolders}
      openDialog={openDialog}
      closeDialog={closeDialog}    
      dialogType={dialog.type}
      showCurrentList={handleFolderClick}
        />
      </div>

      <div className='right-side'>
      <TaskWrapper 
        tasks={showFavorites ? favorites : showCurrentList} 
        setTasks={setTasks} 
        addTask={addTask} 
        handleDelete={handleDelete}
        titleValue={titleValue} 
        openDialog={openDialog}
        closeDialog={closeDialog}    
        dialogType={dialog.type}
        folders={folders}
        setFolders={setFolders}
        selectedFolder={selectedFolder} // Pass selectedFolder state
      />
      </div>
    </div>
  </DialogsProvider>
);
}

export default App;