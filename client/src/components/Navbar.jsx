import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import {Box, Button} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import moneyMagnetIcon from '../assets/moneymagneticon.png'
import { AppContext } from '../context/Context';


function ResponsiveAppBar() {
  const navigate = useNavigate();
  const {user, logOut} = AppContext();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = async () => {
    try {
        await logOut()
        navigate('/')
    } catch (error) {
        console.log(error);
    }
  }

  function handleMenuClick(event) {
    const { label } = event.currentTarget.dataset;
    if (label === 'account' || label === 'dashboard') {
      navigate(`/${label}`);
      handleCloseUserMenu();
    } else if (label === 'logout') {
      handleSignOut();
      handleCloseUserMenu();
    }
  }

  function stringAvatar(name) {
  const initials = name
    .split(' ')
    .map((part) => part[0]) // Get the first character of each part (first name, last name)
    .join(''); // Join the initials together

  return {
    children: initials.toUpperCase(), // Ensure initials are capitalized
  };
}

  
  // console.log(typeof user.displayName)
  // console.log(user)

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#009933' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Button
            onClick={() => navigate('/')}
          >
            <img src={moneyMagnetIcon} alt="moneyMagnetIcon" style={{ width: "40px", height: "40px" }} />
          </Button>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                </IconButton>
                {/* <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                </Menu> */}
            </Box>
            <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    
                }}
            >
                Money Magnet
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {
                    user?.photoURL ? (
                      <Avatar alt={user?.displayName} src={user.photoURL} />
                    ) : (
                      <Avatar {...stringAvatar(user?.displayName)} />
                    )
                  }
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem data-label="dashboard" onClick={handleMenuClick}>Dashboard</MenuItem>
                <MenuItem data-label="account" onClick={handleMenuClick}>Account</MenuItem>
                <MenuItem data-label="logout" onClick={handleMenuClick}>Log Out</MenuItem>
              </Menu>
            </Box>
          ) : (<></>)}

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;