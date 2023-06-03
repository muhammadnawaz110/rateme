import { Avatar, Box, Button, Container, IconButton, Menu, MenuItem, AppBar as MuiAppBar, Toolbar, Tooltip, Typography } from "@mui/material"
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from "react-router-dom";
import { useState } from "react";
import { signout } from "../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "./library/ProgressBar";
import { userTypes } from "../utils/constants";

export default function AppBar() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const userType = user.type;
    const [anchorE1, setAnchorE1] = useState(null);
    const openMenu = (event) => {
        setAnchorE1(event.currentTarget);
    }
    const closeMenu = () => {
        setAnchorE1(null);
    }
    const logout = () => {
        dispatch(signout());
        closeMenu();
    }
    return (
        <div>
            <MuiAppBar>
                <Container maxWidth="lg">
                    <Toolbar>
                        <AdbIcon sx={{ display: { md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/admin/dashboard"
                            sx={{
                                mr: 2,
                                display: { md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>
                            RateMe
                        </Typography>
                        <Box textAlign='right' flexGrow={1}>
                            {
                                userType === userTypes.USER_TYPE_SUPER &&
                                <Button LinkComponent={Link} to="/admin/departments" sx={{ color: 'white' }}>Departments</Button>
                            }
                              {
                                userType === userTypes.USER_TYPE_STANDARD &&
                                <Button LinkComponent={Link} to={`/admin/departments/${user.departmentId}`} sx={{ color: 'white' }}>Employees</Button>
                            }
                            <Button
                                component={Link}
                                to="/admin/users"
                                sx={{ color: '#fff', my: 2 }}>
                                users
                            </Button>
                        
                        </Box>
                        <Box>
                            <Tooltip title="Open Setting">
                                <IconButton onClick={openMenu}>

                                    <Avatar alt="Profile Picture" src={process.env.REACT_APP_BASE_URL + `content/${user._id}/${user.profilePicture}`} />
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
                                <MenuItem component={Link} to="/admin/account-settings" onClick={closeMenu}>
                                    <Typography textAlign='center'>Account Setting</Typography>
                                </MenuItem>
                                <MenuItem onClick={logout}>
                                    <Typography textAlign='center'>Sign out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
                <ProgressBar />
            </MuiAppBar>
        </div>
    )
}
