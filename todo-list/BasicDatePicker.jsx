import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker({onChange, value}) {

    
    

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DemoContainer components={['DatePicker']} sx={{height: '100%'}}>
        <DatePicker  
        label="Date" 
        className='datePicker' 
        value={value} 
        onChange={onChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
