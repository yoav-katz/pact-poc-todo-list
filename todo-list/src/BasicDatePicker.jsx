import * as React from 'react';
import dayjs from 'dayjs'; // Import dayjs for date handling
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker({ onChange, value }) {
  const handleDateChange = (newValue) => {
    if (onChange) {
      onChange(newValue ? newValue : null); // Pass dayjs object or null
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{height: '100%'}}>
        <DatePicker
          label="Date"
          className='datePicker'
          value={value || null} // Ensure value is a dayjs object or null
          onChange={handleDateChange}
          sx={{
            '& .MuiInputBase-input': { color: 'white' }, // Text color
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, // Border color
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, // Border color on hover
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, // Border color when focused
            '& .MuiInputLabel-root': { color: 'white' }, // Label color
            '& .MuiInputLabel-shrink': { color: 'primary' }, // Shrinked label color
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
