import { Button, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import BasicDatePicker from './BasicDatePicker';
import CustomizedMenus from './IconMenu';
import dayjs from 'dayjs'; // Import dayjs

const LoginForm = ({ emailText, setEmailText }) => {

  const handleSubmit = () => {
    logIn({
      email: emailText,
    });
  };

  return (
    <div className="login-form">
      <div className='form-header'>
        
        <TextField
          className='textField'
          label="Email"
          variant="outlined"
          value={emailText}
          type='email'
          onChange={(e) => setEmailText(e.target.value)}
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
    </div>
  );
};




        export default LoginForm;