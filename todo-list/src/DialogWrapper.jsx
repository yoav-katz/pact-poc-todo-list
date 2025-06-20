import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FolderForm } from './FolderForm';
import LoginForm from './LoginForm';
import CustomizedMenus from './IconMenu';
import BasicDatePicker from './BasicDatePicker';
import TaskForm from './TaskForm';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'; // Import dayjs

export const DialogWrapper = ({ dialogType, isOpen, handleClose, confirmAction, dialogData, tasks, folders }) => {
  const [folderText, setFolderText] = useState(""); // ✅ Capture folder name
  const [taskText, setTaskText] = useState(dialogData?.taskText || ""); // Initialize with dialogData
  const [folderValue, setFolder] = useState(dialogData?.currentList || ""); // Capture folder selection
  const [dateValue, setDate] = useState(dialogData?.dueDate ? dayjs(dialogData.dueDate) : null); // Ensure dateValue is a dayjs object
  const [emailText, setEmailText] = useState('');


  useEffect(() => {
    if (dialogType === "editTask" && dialogData || dialogType === "addTask") {
      setTaskText(dialogData.taskText || ""); // Load task text
      setFolder(dialogData.currentList || ""); // Load folder
      setDate(dialogData.dueDate ? dayjs(dialogData.dueDate) : null); // Ensure dateValue is a dayjs object
    }
  }, [dialogType, dialogData]);

  const dialogStyles = {
    backgroundColor: 'rgb(24, 28, 35)', // Dark background
    color: '#fff', // Light text
    borderRadius: '10px', // Rounded corners
    margin: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handleTaskSubmit = () => {
    if (!taskText.trim()) { // ✅ Prevents empty names
      console.warn("Error: Task name is missing!");
      return;
    }
    const updatedTask = {
      _id: dialogData._id,
      taskText: taskText.trim(),
      currentList: folderValue,
      dueDate: dateValue ? dateValue.format('MMMM D') : null, // Format date to "Month Day"
    };
    confirmAction(updatedTask); // Pass the updated task to the confirmAction function
    handleClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      PaperProps={{
        sx: dialogStyles, // Dark background
      }}
    >
      {dialogType === "deleteTask" && (
        <>
          <DialogTitle sx={dialogStyles}>Confirm Deletion</DialogTitle>
          <DialogContent sx={dialogStyles}>
            Are you sure you want to delete this task?
          </DialogContent>
          <DialogActions sx={dialogStyles}>
            <Button onClick={handleClose} sx={{ color: '#fff' }}>Cancel</Button>
            <Button 
              onClick={() => { 
                console.log("DialogWrapper - Confirm Action:", confirmAction);
                confirmAction(dialogData._id); // ✅ Just call the confirmAction with the ID
                handleClose();                // ✅ Then close the dialog
              }} 
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </>
      )}

      {dialogType === "deleteFolder" && (
        <>
          <DialogTitle sx={dialogStyles}>Confirm Deletion</DialogTitle>
          <DialogContent sx={dialogStyles}>
            Are you sure you want to delete this folder?
          </DialogContent>
          <DialogActions sx={dialogStyles}>
            <Button onClick={handleClose} sx={{ color: '#fff' }}>Cancel</Button>
            <Button 
              onClick={() => { 
                console.log("DialogWrapper - Confirm Action:", confirmAction);
                confirmAction(dialogData.id); 
                handleClose(); 
              }} 
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </>
      )}

      {dialogType === "addFolder" && (
        <>
          <DialogTitle sx={dialogStyles}>Create Folder</DialogTitle>
          <DialogContent sx={dialogStyles}>
            <FolderForm setFolderText={setFolderText}  /> {/* ✅ Get input */}
          </DialogContent>
          <DialogActions sx={dialogStyles}>
            <Button onClick={handleClose} sx={{ color: '#fff' }}>Cancel</Button>
            <Button onClick={() => {
              if (!folderText.trim()) { // ✅ Prevents empty names
                console.warn("Error: Folder name is missing!");
                return;
              }
              confirmAction(folderText);
              handleClose();
            }}>
              Create
            </Button>
          </DialogActions>
        </>
      )}

     {dialogType === "addUser" && (
        <>
          <DialogTitle sx={dialogStyles}>Enter Your Email</DialogTitle>
          <span className='description' style={{ marginTop: '-15px', fontSize: "10px", color: "rgb(158, 157, 157)", width: '150px', textAlign: 'center' }}>and we'll send you an email with a link back!</span>

          <DialogContent sx={dialogStyles}>
            <LoginForm
              setEmailText={setEmailText}  // Pass the state setter
              emailText={emailText}        // Optional: control value from parent
            />
          </DialogContent>

          <DialogActions sx={dialogStyles}>
            <Button onClick={handleClose} sx={{ color: '#fff' }}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (!emailText.trim()) {
                  console.warn("Error: Email is missing!");
                  // Optional: set error state to show visual feedback
                  return;
                }

                console.log("sending email to:", emailText);

                confirmAction(emailText); // Proceed with email
                handleClose(); // Close dialog

                setEmailText(''); // Clear email input after submission
              }}
              sx={{ color: 'rgb(54, 108, 173)' }}
            >
              Submit
            </Button>
          </DialogActions>
        </>
      )}


      {dialogType === "addTask" && (
        <>
          <DialogTitle sx={dialogStyles}><b>Create Task</b></DialogTitle>
          <DialogContent sx={{ ...dialogStyles, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TaskForm 
              taskText={taskText} 
              setTaskText={setTaskText} 
              folders={folders} 
              folderValue={folderValue} 
              setFolder={setFolder} 
              dateValue={dateValue} 
              setDate={setDate} 
              addTask={(task) => {
                confirmAction(task);
                handleClose();
              }}
            />
          </DialogContent>
          <DialogActions sx={dialogStyles}>
            <Button onClick={handleClose} sx={{  width: "8vw",borderRadius: '5px', color: 'rgb(116, 115, 115)', backgroundColor: 'rgba(93, 95, 97, 0)'  }}>Cancel</Button>
            
            <Button onClick={handleTaskSubmit} sx={{ width: "8vw",borderRadius: '5px', backgroundColor: 'rgba(54, 107, 173, 0)', color: 'rgb(54, 108, 173)' }}>
              Create
            </Button>
          </DialogActions>
        </>
      )}

      {dialogType === "editTask" && (
        <>
          <DialogTitle sx={dialogStyles}><b>Edit Task</b></DialogTitle>
          <DialogContent sx={{ ...dialogStyles, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TaskForm 
              taskText={taskText} 
              setTaskText={setTaskText} 
              folders={folders} 
              folderValue={folderValue} 
              setFolder={setFolder} 
              dateValue={dateValue} 
              setDate={setDate} 
            />
          </DialogContent>
          <DialogActions sx={dialogStyles}>
            <Button onClick={handleClose} sx={{ border: "1px solid white", width: "8vw", borderRadius: '10px', color: 'rgb(233, 234, 235)' }}>Cancel</Button>
            <Button onClick={handleTaskSubmit} sx={{ border: "1px solid rgb(54, 108, 173)", width: "8vw", borderRadius: '10px', color: 'rgb(54, 108, 173)' }}>
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
    
  ); 
};
