import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180, // Ensure consistent menu width
    backgroundColor: "#333", // Dark background
    color: "#fff", // Light text
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
  "& .MuiMenuItem-root": {
    display: "flex", // Ensure proper alignment of icons and text
    alignItems: "center",
    "& .MuiSvgIcon-root": {
      fontSize: 18,
      color: "#fff", // Light text for icons
      marginRight: theme.spacing(1.5),
    },
    "&:active": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
    },
    "&:hover": {
      backgroundColor: "#444", // Slightly lighter dark background on hover
    },
  },
}));

export default function ItemMenu({ task, toggleFavorite, openDialog }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <IconButton onClick={handleClick}>
        <MoreVertIcon sx={{ color: 'lightgrey' }} />
      </IconButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { toggleFavorite(task._id); handleClose(); }}>
          <StarTwoToneIcon sx={{ color: task.isFavorite ? 'gold' : 'lightgrey' }} />
          Toggle Primary
        </MenuItem>

        <MenuItem onClick={() => { 
          console.log("Edit Task clicked for task:", task);
          openDialog("editTask", {
            _id: task._id,
            taskText: task.taskText,
            dueDate: task.dueDate,
            currentList: task.currentList
          });
          handleClose();
        }}>
          <EditIcon sx={{ color: 'lightgrey' }} />
          Edit Task
        </MenuItem>

        <MenuItem onClick={() => { openDialog("deleteTask", task);}}> 
          <DeleteIcon sx={{ color: 'lightgrey' }} />
          Delete Task
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
