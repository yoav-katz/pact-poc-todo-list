import { DialogsProvider } from '@toolpad/core/useDialogs';
import { useMemo, useState } from 'react';
import './App.css';
import { DialogWrapper } from './DialogWrapper';
import { NavBar } from './NavBar';
import { TaskWrapper } from './TaskWrapper';
import { UpComing } from './upComing';
import  { FolderForm }  from './FolderForm';
import { v4 as uuidv4 } from 'uuid';
import CustomizedMenus from './IconMenu'


function App() {
  const [tasks, setTasks] = useState([
    {id: uuidv4(), taskText: "walk leah", isFavorite: true, currentList: 'Personal', dueDate: "March 12" },
    {id: uuidv4(), taskText: "Build app", isFavorite: false, currentList: 'Work', dueDate: "March 17" }

  ]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [titleValue, setTitleValue] = useState('All Tasks:')
  const [folders, setFolders] = useState([
      { id: "1", folderText: "Work"},
      { id: "2", folderText: "Personal"}
    ]); // ✅ Ensure folders exist


    console.log("Folders in App.jsx:", folders); // ✅ Debugging output

  const [dialog, setDialog] = useState({
    isOpen: false,
    type: null, // "deleteTask", "editTask"
    data: null,
  });

  const [selectedFolder, setSelectedFolder] = useState(null);


  console.log("Folders in App.jsx:", folders);


  const openDialog = (type, data) => {
    console.log("Opening Dialog with Data:", data); // Debugging output
    setDialog({ isOpen: true, type, data });
  };
  
  const closeDialog = () => {
    setDialog({ isOpen: false, type: null, data: null });
  };

  const addTask = (task) => {
    setTasks((prev) => [...prev, task]);
    console.log("adding task: ", task)
  };

  const addFolder = (folder) => {
    setFolders((prev) => [...prev, folder]);
    console.log(folders)
  };

  const favorites = useMemo(() => tasks.filter(task => task.isFavorite), [tasks]);

  const showCurrentList = useMemo(() => {
    console.log("📌 Selected Folder:", selectedFolder); 
    console.log("📌 All Tasks:", tasks); 
  
    if (!selectedFolder) {
      console.log("📌 Showing all tasks.");
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
    setTitleValue(title); 
    console.log('changing title...')
 };



 const handleDelete = (id) => {
  console.log("Deleting Task ID:", id); // ✅ Debugging output

  if (!id) {
    console.warn("Error: Missing Task ID!"); 
    return;
  }

  setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
};



const handleFolderDelete = (id) => {
  console.log("Deleting Folder ID:", id); // ✅ Debugging output

  if (!id) {
    console.warn("Error: Missing Folder ID!"); 
    return;
  }

  setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== id));
};
const getConfirmAction = () => {
  switch (dialog.type) {
    case "deleteTask": return handleDelete;
    case "deleteFolder": return handleFolderDelete;
    case "addFolder": return handleFolderSubmit;
    default: return () => console.warn("No confirm action assigned"); // ✅ Avoids errors
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
  <DialogsProvider>
    <DialogWrapper className='dialog-task-wrapper'
    confirmDelete={handleDelete}
    dialogType={dialog.type} 
    isOpen={dialog.isOpen}
    handleClose={closeDialog}
    tasks={tasks}
    confirmAction={getConfirmAction()}
    dialogData={dialog.data} /> 
    <DialogWrapper className='dialog-task-wrapper'
    confirmDelete={handleFolderDelete}
    dialogType={dialog.type} 
    isOpen={dialog.isOpen}
    handleClose={closeDialog}
    folders={folders}
    confirmAction={getConfirmAction()}
    dialogData={dialog.data}/>
    <DialogWrapper className='dialog-task-wrapper'
    dialogType={dialog.type} 
    isOpen={dialog.isOpen}
    handleClose={closeDialog}
    folders={folders}
    confirmAction={getConfirmAction()}
    dialogData={dialog.data}/>

     
    
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

      <TaskWrapper 
        tasks={showFavorites ? favorites : showCurrentList} 
        setTasks={setTasks} 
        addTask={addTask} 
        titleValue={titleValue} 
        openDialog={openDialog}
        closeDialog={closeDialog}    
        dialogType={dialog.type}
        folders={folders}
        setFolders={setFolders}
        
       
      />
    </div>

  </DialogsProvider>
);
}

export default App;