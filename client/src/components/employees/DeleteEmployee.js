import { Box, Button, IconButton, Popover, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deleteDepartment } from '../../store/actions/departmentActions';
import axios from 'axios';
import { hideProgressBar } from '../../store/actions/progressBarActons';
import { showError, showSuccess } from '../../store/actions/alertActions';

export default function DeleteEmployee({ employeeId, name,deleteEmployee }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    
   

    return (
        <>
            <IconButton onClick={handleClick}><DeleteIcon sx={{ color: 'red' }} /> </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Typography sx={{ p: 2 }}>Employee  data will be deleted. Do you want to delete this <b>{name}</b> employee?</Typography>
                <Box textAlign="center" pb={2}>
                    <Button onClose={handleClose}>Close</Button>
                    <Button onClick={() => deleteEmployee(employeeId)} sx={{ ml: 2 }} variant="contained" color="error">Delete</Button>
                </Box>
            </Popover>
        </>
    )
}