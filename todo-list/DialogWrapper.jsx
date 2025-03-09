import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FolderForm } from './FolderForm';
import { useState } from 'react';


export const DialogWrapper = ({ dialogType, isOpen, handleClose, confirmAction, dialogData, tasks, folders }) => {
  const [folderText, setFolderText] = useState(""); // ✅ Capture folder name


  return (
    <Dialog open={isOpen} onClose={handleClose}>
      {dialogType === "deleteTask" && (
        <>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this task?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={() => { 
                console.log("DialogWrapper - Confirm Action:", confirmAction);
                confirmAction(dialogData.id); 
                handleClose(); 

                }  
              }
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </>
      )}

      {dialogType === "deleteFolder" && (
        <>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this folder?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
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
          <DialogTitle>Create Folder</DialogTitle>
          <DialogContent>
            <FolderForm setFolderText={setFolderText} /> {/* ✅ Get input */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
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

    </Dialog>
  );
};
