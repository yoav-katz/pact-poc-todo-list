import React from 'react';
import './NavBar.css';
import { colors, Divider } from '@mui/material';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';

export const NavBar = ({ tasks, favorites, toggleFavorites, showAllTasks, setTitle, handleFolderClick }) => {
  return (
    <div className='navbar'>
      <div className='logo-wrapper' style={{ display: 'flex', justifyContent: 'start' }}>
        <small className='logo'><b>Tasks<small className="halfLogo" >Manager</small></b></small>
      </div>
      
      <div className='menu-items-wrapper' style={{ color: 'white', fontSize: '14px', width: '37rem', textAlign: 'left', alignItems: 'start' }}>

        <small 
          className='menu-items'
          style={{ cursor: 'pointer' }} 
          onClick={() => {
            handleFolderClick("All Tasks")
            setTitle("All"); // Click to show all tasks
            showAllTasks();
          } 
        } // Click to show all tasks
        >
          all ({tasks.length})
        </small>   
        <small 
          className='menu-items' 
          onClick={ () => {
            toggleFavorites();
            setTitle("Primary"); // Click to toggle favorites
          }
        }
          style={{ cursor: 'pointer' }} 
        >
          Primary ({favorites.length})
        </small>
        <small className='menu-items' >settings</small> <br/>
      </div>
    </div>
  );
};