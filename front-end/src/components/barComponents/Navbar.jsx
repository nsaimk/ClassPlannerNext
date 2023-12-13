import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavbarFilter from "./NavbarFilter";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../auth/useAutContext';
import SchoolIcon from '@mui/icons-material/School';
import AdminButton from './AdminButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu'; 
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden'; 


const drawerWidth = 240;




const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Navbar = () => {
    const { logout } = useAuthContext();
    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    const mainPage = () => {
        window.location.href = '/main';
    };

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                sx={{
                    backgroundColor: '#36454f',
                    position: 'fixed',
                    marginTop: '90px',
                    '@media screen and (max-width: 1000px)': {
                        minHeight: '70px',
                        height: 'auto',
                    
                    },
                }}
            >
                <Toolbar>
                    <NavbarFilter />
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <AdminButton />
                    <Hidden mdUp>
                        {/* Only show the hamburger menu on screens below 1000px */}
                        <IconButton size="large" color="inherit" onClick={() => setIsDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Hidden smDown>
                        {/* Hide these icons on screens below 1000px */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Hidden mdDown>
                                <IconButton size="large" color="inherit">
                                    <SchoolIcon onClick={mainPage} />
                                </IconButton>
                            </Hidden>
                            <Hidden mdDown>
                                <IconButton
                                    component={Link}
                                    to="/profile"
                                    size="large"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </Hidden>
                            <Hidden mdDown>
                                <IconButton color="inherit" onClick={handleLogout}>
                                    <LogoutIcon />
                                </IconButton>
                            </Hidden>
                        </Box>
                    </Hidden>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sx={{
                    width: 250,
                    flexShrink: 0,
                }}
            >
                <List>
                    <ListItem onClick={mainPage}>
                        <ListItemText primary="Classes" />
                    </ListItem>
                    <ListItem component={Link} to="/profile">
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
};

export default Navbar;