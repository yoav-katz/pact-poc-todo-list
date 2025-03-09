import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BasicDatePicker from './BasicDatePicker';
import CustomizedMenus from './IconMenu';
// import SelectFolder from './SelectFolder'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { selectChangeEvent } from '@mui/material/Select';


const TaskForm = ( {addTask, folders} ) => {
  console.log("📌 Folders received in TaskForm:", folders); // ✅ Debugging output
  
  const [textValue, setTextValue] = useState('');
  const [dateValue, setDateValue] = useState(null);
  const [folderValue, setFolderValue] = useState(null)

  
  const setDate = (date) => {
    setDateValue(date);
  }

  const setFolder = (folder) => {
    console.log('SELECTED FOLDER:', folder)
    setFolderValue(folder);
  }

  const handleSubmit = () => {
    console.log("Current Date Value:", dateValue); // Debugging output
    console.log("Current Text Value:", textValue); // Debugging output
    console.log("Current Folder Value:", folderValue); // Debugging output


    addTask({
      id: uuidv4(),
      taskText: textValue,
      dueDate: dateValue.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) ,
      isFavorite: false,
      currentList: folderValue || "All Tasks",
    });

    // Clear input fields after submission
    setTextValue('');
    setDateValue(null);
    setFolderValue(null);
  };

  return (
    <div className="task-form">
      <div className='form-header'>
      <TextField
  className='textField'
  label="Task Name"
  variant="standard"
  value={textValue}
  onChange={(e) => setTextValue(e.target.value)}
  sx={{
    input: { color: "white" },  // ✅ Makes text white
    "& .MuiInputBase-root": { backgroundColor: "transparent" },  // ✅ Transparent background
    "& .MuiInputLabel-root": { color: "white" },  // ✅ Label text white
    "& .MuiInput-underline:before": { borderBottomColor: "white" },  // ✅ Bottom border white
    "& .MuiInput-underline:hover:before": { borderBottomColor: "white" },  // ✅ Keeps border white on hover
    "& .MuiInput-underline:after": { borderBottomColor: "white" }  // ✅ Keeps border white after focus
  }}
/>
        <div className="folderMenu">
        <CustomizedMenus
         value={folderValue} 
         variant='standard' 
         folders={folders} 
         setFolder={setFolder}
         onChange={(folder) => setFolder(folder)}/>     
        </div>
      </div>


      <div className='datePickerWrapper'>
        <BasicDatePicker variant='standard' value={dateValue} sx={{height: '10vh'}} onChange={(e)=> setDate(e)}/> 
        <Button variant="contained" color='primary' onClick={handleSubmit} sx={{height: '9.5vh'}}>
          Add
        </Button>
      </div>
      
    </div>
  );

};

export default TaskForm;