import { Avatar, Box, Button, Container, IconButton, Menu, MenuItem, AppBar as MuiAppBar, Toolbar, Tooltip, Typography } from "@mui/material"
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from "react-router-dom";
import { useState } from "react";
import { signout } from "../store/actions/authActions";
import { useDispatch } from "react-redux";
import ProgressBar from "./library/ProgressBar";

export default function AppBar() {
    const dispatch = useDispatch();
    const [anchorE1, setAnchorE1] = useState(null);
    const openMenu = (event) => {
        setAnchorE1(event.currentTarget);
    }
    const closeMenu = () => {
         setAnchorE1(null);
    }
    const logout = () => {
        dispatch( signout() );
        closeMenu();
    }
  return (
    <div>
      <MuiAppBar>
        <Container maxWidth="x1">
            <Toolbar>
                <AdbIcon sx={{display:{ md: 'flex'}, mr:1}} />
                <Typography 
                    variant="h6"
                    component={Link}
                    to="/admin/dasboard"
                    sx={{
                        mr: 2,
                        display: {  md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                      }}>
                    RateMe
                </Typography>
                <Box textAlign='right' flexGrow={1}>
                    <Button 
                    component={Link}
                    to="/admin/departments"
                    sx={{ color: '#fff', my:2 }}>
                        Department
                    </Button>
                </Box>
                <Box>
                    <Tooltip title="Open Setting">
                        <IconButton onClick={openMenu}>
                            <Avatar alt="Profile Picture" src=""/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                    anchorEl={anchorE1}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: 'right'
                    }}
                    open={Boolean(anchorE1)}
                    onClose={closeMenu}>
                        <MenuItem component={Link} to="/admin/account-setting" onClick={closeMenu}>
                            <Typography textAlign='center'>Account Setting</Typography>
                        </MenuItem>
                        <MenuItem  onClick={logout}>
                            <Typography textAlign='center'>Sign out</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
        <ProgressBar/>
      </MuiAppBar>
    </div>
  )
}
