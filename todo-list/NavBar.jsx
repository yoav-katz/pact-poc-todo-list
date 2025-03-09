import React from 'react';
import './NavBar.css';

export const NavBar = ({ tasks, favorites, toggleFavorites, showAllTasks, setTitle, handleFolderClick }) => {
  return (
    <div className='navbar'>
      <div className='logo-wrapper'>
        <small className='logo'><b>To-Do List</b></small>
      </div>
      <div className='menu-items-wrapper'>
        <small 
          className='menu-items'
          style={{ cursor: 'pointer' }} 
          onClick={() => {
            handleFolderClick("All Tasks")
            showAllTasks();
          } 
        } // Click to show all tasks
        >
          all ({tasks.length})
        </small> <br/>
        <small 
          className='menu-items' 
          onClick={ () => {
            toggleFavorites();
            setTitle("Primary Tasks:"); // Click to toggle favorites
          }
        }
          style={{ cursor: 'pointer' }} 
        >
          Primary ({favorites.length})
        </small> <br/>
        <small className='menu-items'>settings</small> <br/>
      </div>
    </div>
  );
};