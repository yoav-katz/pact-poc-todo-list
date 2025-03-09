import React, { useState } from "react";
import { TextField } from "@mui/material";

export const FolderForm = ({ setFolderText }) => {
  const [text, setText] = useState("");

  return (
    <TextField
      label="Folder Name"
      variant="outlined"
      fullWidth
      value={text}
      onChange={(e) => {
        setText(e.target.value); 
        setFolderText(e.target.value); // ✅ Send text to parent component
      }}
    />
  );
};
