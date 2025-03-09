import DeleteIcon from '@mui/icons-material/Delete';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import TaskForm from './TaskForm';
import CustomizedMenus from './IconMenu';
import TopicIcon from '@mui/icons-material/Topic';
import { Chip } from '@mui/material';

export const TaskWrapper = ({ tasks, setTasks, addTask, titleValue, openDialog, folders, setFolders}) => {
  console.log('tasks:', tasks)
  
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // sorting by date


  

  const toggleFavorite = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => 
        task.id === id ? { ...task, isFavorite: !task.isFavorite } : task
      )
    );
  };

  

  return (
    <div className="taskWrapper">
      <h2 className='title'>Task Manager:</h2>
      <TaskForm CustomizedMenus={CustomizedMenus} folders={folders} addTask={addTask} />
      <h3 className='title'>{titleValue}</h3>

      <div className='list-wrapper'>
        <List sx={{ overflow: 'scroll', height: '40vh' }}>
          {sortedTasks.map((task) => (
            

            <ListItem key={task.id} className='itemsWrapper' sx={{ height: '10vh' }}>

              <Tooltip title={task.currentList} arrow placement="top">
              <Chip label={task.currentList} variant="outlined" sx={{color: 'white', backgroundColor:"rgb(91, 91, 91)", minWidth: '6vw'}} />
              </Tooltip>
              <div className='listItemItems'>

              
              
              <div className='task-info'><b>{task.taskText}</b></div>
              <div className='task-info' id='datewrapper'>{task.dueDate}</div>
              
              <div className='task-info2'>

                <IconButton onClick={() => toggleFavorite(task.id)}>
                        {/* onClick={()} => moveToFolder(folderName, task.id) */}
                  <Tooltip title="Primary Task" arrow placement="top">
                    <StarTwoToneIcon sx={{ color: task.isFavorite ? 'gold' : 'lightgrey' }} />
                  </Tooltip>
                </IconButton>

              <IconButton>
                <Tooltip title="Change Folder" arrow placement="top"> 
                  <TopicIcon sx={{ color: 'lightgrey', margin: '3%' }} />
                </Tooltip>
              </IconButton>

                <IconButton aria-label="delete" onClick={() => openDialog("deleteTask", { id: task.id })} sx={{ color: 'lightgrey' }}>
                <Tooltip title="Delete Task" arrow placement="top">
                  <DeleteIcon />
                </Tooltip>
              </IconButton>


              </div>
             
              </div>

            </ListItem>
            
          ))}
        </List>
      </div>
      
    </div>
  );
};

export default TaskWrapper;