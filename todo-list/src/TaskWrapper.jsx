import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ItemMenu from './ItemMenu';

export const TaskWrapper = ({
  tasks,
  setTasks,
  addTask,
  titleValue,
  openDialog,
  folders,
  setFolders,
  selectedFolder, 
  handleDelete
}) => {
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const [fadingTaskId, setFadingTaskId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleFavorite = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    const newFavoriteStatus = !task.isFavorite;
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // <-- add this
        },
        body: JSON.stringify({ isFavorite: newFavoriteStatus }),
      });
      if (!response.ok) throw new Error("Failed to update favorite");
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isComplete: true }),
      });
      if (!response.ok) throw new Error("Failed to update completion");
      await response.json();
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      window.location.reload();
    } else {
      openDialog("addUser", {});
    }
  };

  return (
    <div className="taskWrapper">
      <div className='page-top' sx={{ display: 'flexbox'}}>
        <small className='title'><b>{titleValue} Tasks:</b></small>
        <div className="buttons" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginRight: '5%', marginLeft: '45%' }}>
          {isLoggedIn && 
            <span style={{ color: 'white', marginRight: '1rem', fontSize: '14px', lineHeight: '1.5', lineClamp: 1, width: '10vw' }}>Welcome Back!</span>
          }
          <button
            className='create'
            style={{
              margin: "1%",
              background: 'linear-gradient(180deg, rgb(54, 108, 173), rgb(37, 51, 83))',
              border: '1px solid rgb(46, 53, 66)',
            }}
            onClick={() => openDialog("addTask", {})}
          >
            Create Task
          </button>
          <button
            className='login'
            style={{
              cursor: "pointer",
              margin: "1%",
              color: 'white',
              border: '1px solid rgb(46, 53, 66)'
            }}
            onClick={handleAuthClick}
          >
            {isLoggedIn ? "Sign out" : "Log in"}
          </button>
        </div>
      </div>

      <div className='list-wrapper' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80%', marginTop: '10px' }}>
        <div style={{
          padding: '5px',
          backgroundColor: 'rgb(24, 28, 35)',
          border: 'solid 1px rgb(46, 53, 66)',
          borderRadius: '10px',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          {!isLoggedIn && (
            <div style={{ color: 'white', marginRight: '10px', fontSize: '14px', lineHeight: '1.5', width: '100vw', textAlign: 'left', justifyContent: 'center', padding: '100px' }}>
              <b style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Sans-serif', fontSize: '2rem' }}>Please log in to manage your <span style={{ color: 'rgb(91, 155, 234)' }}>Tasks.</span></b> <br></br> <br></br>
              <b style={{ color: 'gray', fontWeight: 'lighter', fontFamily: 'Sans-serif', fontSize: '1rem',  textAlign: 'left' }}>If you already have an account, check your email for the last time we sent you a magic link.</b>

            </div>
          )}
          <List sx={{
            overflow: 'scroll',
            height: '65vh',
            width: '100%',
            backgroundColor: 'rgb(24, 28, 35)',
            borderRadius: '10px',
            padding: '10px',
            alignItems: 'center'
          }}>
            {sortedTasks.map((task) => {
              const isFading = fadingTaskId === task._id;
              return (
                <ListItem
                  key={task._id}
                  className={`itemsWrapper ${isFading ? "fade-out" : ""}`}
                  sx={{
                    height: '10vh',
                    backgroundColor: task.isComplete ? 'rgb(38, 43, 51)' : 'inherit',
                    border: task.isFavorite ? '1px solid rgb(54, 108, 173)' : '1px solid rgb(38, 43, 51)',
                    opacity: isFading ? 0 : 1,
                    transition: 'opacity 1.0s ease-in-out',
                    pointerEvents: isFading ? 'none' : 'auto',
                    width: '95%',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton
                    onClick={async () => {
                      await toggleComplete(task._id);
                      setTimeout(() => setFadingTaskId(task._id), 2000);
                      setTimeout(() => {
                        handleDelete(task._id);
                        setFadingTaskId(null);
                      }, 3000);
                    }}
                    sx={{ color: 'rgb(101, 100, 100)' }}
                  >
                    <Tooltip title={task.isComplete ? "Task Completed!" : "Not Yet..."} arrow placement="top">
                      <CheckCircleIcon sx={{ color: task.isComplete ? 'rgb(54, 108, 173)' : 'rgb(101, 100, 100)' }} />
                    </Tooltip>
                  </IconButton>

                  {(selectedFolder === "All Tasks" || selectedFolder !== "Primary") && (
                    <Tooltip title={task.currentList} arrow placement="top">
                      <Chip label={task.currentList} variant="outlined" sx={{
                        color: 'white',
                        backgroundColor: "rgb(54, 108, 173)",
                        minWidth: '6vw',
                        border: '0px',
                        height: '1.6rem'
                      }} />
                    </Tooltip>
                  )}

                  <div className='listItemItems'>
                    <div className='task-info' onClick={() => toggleComplete(task._id)}><b>{task.taskText}</b></div>
                    <div className='task-info3' id='datewrapper'>{task.dueDate}</div>
                    <div className='task-info2'>
                      <ItemMenu
                        options={["ToggleFavorite", "EditTask", "DeleteTask"]}
                        onSelect={(option) => console.log(option)}
                        task={task}
                        folders={folders}
                        toggleFavorite={toggleFavorite}
                        openDialog={openDialog}
                        setTasks={setTasks}
                      />
                    </div>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    </div>
  );
};

export default TaskWrapper;
