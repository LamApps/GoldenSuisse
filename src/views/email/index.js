import {useState, useEffect} from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Stack,
  Paper,
  Avatar,
  Typography,
  Link,
  Badge,
  IconButton,
  Button,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

import { styled } from '@mui/material/styles';


import Chart from 'react-apexcharts'

import { 
  IconPencil,
  IconInbox,
  IconSend,
  IconNotes,
  IconTrash,
  IconStar,
  IconSettings,
  IconSearch,
  IconMenu,
  IconX,
 } from '@tabler/icons';

import Block from 'ui-component/Block';

const SideMenu = styled(MenuItem)(({ theme }) => ({
  height: '40px',
}));

const ClientAvatar = ({avatar, number, status, name}) => {
  return (
  <Badge color='primary' badgeContent={number} overlap="circular">
    { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/></Badge> : <Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/> }
  </Badge>
  )
}
const Email = props => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [openSidebar, setOpenSidebar] = useState(true);

  const handleToggleSidebar = ()=> {
    setOpenSidebar(!openSidebar);
  }

  return (
    <Box sx={{display: 'flex'}}>
      <Block sx={{
        display: openSidebar? 'block': 'none',
      }}>
        <Box sx={{width: 200, height: 'calc( 100vh - 107px )', overFlow: 'auto'}}>
          <Button variant="contained" fullWidth sx={{mb: 2}} onClick={()=>{navigate('/email/compose')}}>
            <IconPencil size={18} stroke={2} />
            Compose
          </Button>
          <MenuList>
            <SideMenu sx={location.pathname.split("/").pop() === 'email' ? {background: '#222'}: null} onClick={()=>{navigate('/email')}}>
              <ListItemIcon>
                <IconInbox size={18} stroke={2} />
              </ListItemIcon>
              <ListItemText>Inbox</ListItemText>
            </SideMenu>
            <SideMenu sx={location.pathname.split("/").pop() === 'sent' ? {background: '#222'}: null} onClick={()=>{navigate('/email/sent')}}>
              <ListItemIcon>
                <IconSend size={18} stroke={2} />
              </ListItemIcon>
              <ListItemText>Sent</ListItemText>
            </SideMenu>
            <SideMenu sx={location.pathname.split("/").pop() === 'draft' ? {background: '#222'}: null} onClick={()=>{navigate('/email/draft')}}>
              <ListItemIcon>
                <IconNotes size={18} stroke={2} />
              </ListItemIcon>
              <ListItemText>Draft</ListItemText>
            </SideMenu>
            <SideMenu sx={location.pathname.split("/").pop() === 'trash' ? {background: '#222'}: null} onClick={()=>{navigate('/email/trash')}}>
              <ListItemIcon>
                <IconTrash size={18} stroke={2} />
              </ListItemIcon>
              <ListItemText>Trash</ListItemText>
            </SideMenu>
            {/* <SideMenu sx={location.pathname.split("/").pop() === 'setting' ? {background: '#222'}: null} onClick={()=>{navigate('/email/setting')}}>
              <ListItemIcon>
                <IconSettings size={18} stroke={2} />
              </ListItemIcon>
              <ListItemText>Setting</ListItemText>
            </SideMenu> */}
          </MenuList>
        </Box>
      </Block>
      <Box sx={{flexGrow:1, p: 2}}>
        <Outlet context={[openSidebar, handleToggleSidebar]} />
      </Box>
    </Box>
  )
}

export default Email;