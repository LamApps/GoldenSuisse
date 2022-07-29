import { useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Menu,
    MenuItem,
    ButtonBase,
    Typography,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';

import { SocketContext } from 'utils/context/socketContext';
import { handleLogout } from 'store/actions';

import useJwt from 'utils/jwt/useJwt';

import { IconUser, IconLogout } from '@tabler/icons'


// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const socket = useContext(SocketContext)
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}
            >
                <Typography component="p" variant="p" sx={{marginX: '20px'}}>{userData.role && userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</Typography>
                {/* <ButtonBase sx={{ marginLeft: '10px', borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.common.black,
                            color: theme.palette.primary.light,
                            '&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        color="inherit"
                    >
                        <IconSettings stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase> */}
                <ButtonBase sx={{borderRadius: '50%'}}>
                    <Avatar
                        src={userData.avatar_url}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px !important',
                            cursor: 'pointer'
                        }}
                        alt={userData.fullName}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleClick}
                    />
                </ButtonBase>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={()=>{navigate('/profile')}}>
                        <ListItemIcon>
                            <IconUser size={16} stroke={1} />
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={e => {
                    e.stopPropagation();
                    socket.emit('logout', useJwt.getToken());
                    dispatch(handleLogout())
                    }}>
                        <ListItemIcon>
                            <IconLogout size={16} stroke={1} />
                        </ListItemIcon>
                        <ListItemText>Log out</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        </>
    );
};

export default ProfileSection;
