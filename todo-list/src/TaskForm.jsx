import { Button, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import BasicDatePicker from './BasicDatePicker';
import CustomizedMenus from './IconMenu';
import dayjs from 'dayjs'; // Import dayjs

const TaskForm = ({ taskText, setTaskText, folders, folderValue, setFolder, dateValue, setDate, addTask }) => {

  const handleSubmit = () => {
    console.log("Current Date Value:", dateValue); // Debugging output
    console.log("Current Text Value:", taskText); // Debugging output
    console.log("Current Folder Value:", folderValue); // Debugging output

    addTask({
      id: uuidv4(),
      taskText: taskText,
      dueDate: dateValue ? dateValue.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : null,
      isFavorite: false,
      currentList: folderValue || "All Tasks",
    });

    // Clear input fields after submission
    setTaskText('');
    setDate(null);
    setFolder(null);
  };

  return (
    <div className="task-form" style={{ background: 'rgb(24, 28, 35)'}}>
      <div className='form-header'>
        
        <TextField
          className='textField'
          label="Task Name"
          variant="outlined"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          sx={{
            marginTop: '2vh',
            width: '100%',
            input: { color: "white" },  // ✅ Makes text white
            "& .MuiInputBase-root": { backgroundColor: "transparent" },  // ✅ Transparent background
            "& .MuiInputLabel-root": { color: "white" },  // ✅ Label text white
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },  // ✅ Border color white
              "&:hover fieldset": { borderColor: "white" },  // ✅ Border color white on hover
              "&.Mui-focused fieldset": { borderColor: "white" }  // ✅ Border color white on focus
            }  // ✅ Keeps border white after focus
          }}
        />
          
      </div>

      <div className='datePickerWrapper'>
        
        <BasicDatePicker 
          value={dateValue ? dayjs(dateValue) : null} 
          onChange={setDate} 
          sx={{ height: '10vh', color: 'rgb(249, 247, 247)', width: '100%' }} 
        />
 
      </div>
      <CustomizedMenus
            value={folderValue}
            variant='standard'
            folders={folders}
            setFolder={setFolder}
            onChange={(folder) => setFolder(folder)} />
    </div>
  );

};

export default TaskForm;