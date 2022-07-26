import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Stack,
  Paper,
  Avatar,
  Typography,
  Chip,
  Button,
  Badge,
  Pagination,
  Link,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert,
  Drawer,
} from '@mui/material';

import useJwt from 'utils/jwt/useJwt' 

import { IconSearch, IconDotsVertical, IconFileDescription, IconEdit, IconTrash, IconPlus } from '@tabler/icons';

import Block from 'ui-component/Block';
import { getData, getAllData, getUser, deleteUser } from 'store/actions/user'

import AddSideBar from './AddSideBar';

const CircleButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  color: theme.palette.primary.light,
  backgroundColor: 'inherit',
  border: 'solid 1px #202020',
  '&:hover': {
    backgroundColor: '#FBC34A',
    color: theme.palette.common.black,
    borderColor: theme.palette.common.black,
  },
}));

const ClientAvatar = ({avatar, status, name}) => {
    return status ? (<Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/></Badge>) : <Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/>;
}

const Clients = props => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector(state => state.users)

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentStatus, setCurrentStatus] = useState('')
  const [deletingUserID, setDeletingUserID] = useState('');

  //unused state????
  const [currentRole, setCurrentRole] = useState('')
  //popper menu
  const [anchorEl, setAnchorEl] = useState(null);
  const popperOpen = Boolean(anchorEl);
  //dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  //Snack Bar
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState({
    text: '',
    type: 'error',
  });
  //Drawer
  const [rightOpen, setRightOpen] = useState(false);


  // ** Get data on mount
  useEffect(() => {
    dispatch(getAllData())
    dispatch(
      getData({
        page: currentPage,
        limit: rowsPerPage,
        role: currentRole,
        status: currentStatus,
        q: searchTerm
      })
    )
  }, [dispatch, store.allData.length, store.data.length])

  const activeButtonStyle = {
    backgroundColor: '#FBC34A',
    color: theme.palette.common.black,
    borderColor: theme.palette.common.black,
  }

  const handleStatus = (status) =>{
    setCurrentStatus(status)
    dispatch(
        getData({
          page: currentPage,
          limit: rowsPerPage,
          role: currentRole,
          status: status,
          q: searchTerm
        })
    )
  }

  const handleFilter = val => {
    setSearchTerm(val)
    dispatch(
        getData({
          page: currentPage,
          limit: rowsPerPage,
          role: currentRole,
          status: currentStatus,
          q: val
        })
    )
  }

  const handlePagination = page => {
    dispatch(
      getData({
        page: page,
        limit: rowsPerPage,
        role: currentRole,
        status: currentStatus,
        q: searchTerm
      })
    )
    setCurrentPage(page)
  }

  const handleDelete = (userId) => {
    setAnchorEl(null);
    setDeletingUserID(userId);
    setDialogOpen(true);
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleAddSidebar = () => setRightOpen(!rightOpen)

  const handleConfirmDelete = () => {
    setDialogOpen(false);
    if (!deletingUserID) return;
    console.log(deletingUserID)

    useJwt
      .deleteAdvisor(deletingUserID)
      .then(res => {
        if (res.data.ResponseCode == 0) {
          dispatch(deleteUser(deletingUserID))
          setSnackBarMsg({
            text: 'Successfully Deleted.',
            type: 'success'
          })
          setSnackBarOpen(true);

        } else {
          console.log(res)
          setSnackBarMsg({
            text: res.data.ResponseMessage,
            type: 'error'
          })
          setSnackBarOpen(true);
        }
      })
      .catch(err => {
        console.log(err)
        setSnackBarMsg({
            text: 'Network error',
            type: 'error'
          })
          setSnackBarOpen(true);
      })
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={4}>
          <Block>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                <Box>
                    <Typography component="p" variant="h1">{store?.allData.length}</Typography>
                    <Typography component="p" variant="body1">Total Advisors</Typography>
                </Box>
                <Button variant='contained' onClick={()=>handleAddSidebar()}><IconPlus size={18} stroke={1} /> ADD NEW USER</Button>
            </Box>
          </Block>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Block>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{color: 'white'}} htmlFor="search-box">Search</InputLabel>
            <OutlinedInput
              id="search-box"
              sx={{color:'white'}}
              onChange={e => handleFilter(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="search icon"
                    edge="end"
                  >
                    <IconSearch />
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
            />
          </FormControl>
          </Block>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Block>
            <Paper sx={{p:2}}>
              <Stack direction="row" spacing={2}>
                <CircleButton onClick={()=>handleStatus('')} sx={currentStatus==='' ? activeButtonStyle: {}}>ALL</CircleButton>
                <CircleButton onClick={()=>handleStatus('pending')} sx={currentStatus==='pending' ? activeButtonStyle: {}}>PENDING</CircleButton>
                <CircleButton onClick={()=>handleStatus('active')} sx={currentStatus==='active' ? activeButtonStyle: {}}>ACTIVE</CircleButton>
              </Stack>
            </Paper>
          </Block>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Block sx={{outline: 'none', borderTop: 'solid 1px #202020'}}>
          <Typography component="h1" variant="h1" sx={{mb: 3}}>{searchTerm===''?'Advisors':'Search: '+searchTerm}</Typography>
          {store.data.length>0 ? <>
            <TableContainer component={Box} sx={{maxHeight: 'calc(100vh - 357px)'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="advisor table">
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                    store.data.map((item)=><TableRow key={item.id} >
                        <TableCell component="th" scope="row">
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <ClientAvatar avatar={item.avatar_url} name={item.fullName} />
                                <Box sx={{ml: 1}}>
                                    <Link component={RouterLink} to={"/advisor/"+item.id} underline='none' sx={{color: theme.palette.primary.main}} onClick={() => dispatch(getUser(item.id))}>{item.fullName}</Link>
                                    <Typography variant='body2'>@{item.username}</Typography>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>
                            {item.status===1?<Chip color='success' variant="outlined" label="Active" />:(item.status===-1?<Chip color='warning' variant="outlined" label="Pending" />:<Chip variant="outlined" label='Inactive' />)}
                        </TableCell>
                        <TableCell>
                            <IconButton
                                aria-controls={popperOpen ? 'vertical-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={popperOpen ? 'true' : undefined}
                                onClick={handleMenuClick}
                            >
                                <IconDotsVertical size={16} stroke={1}></IconDotsVertical>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={popperOpen}
                                onClose={handleMenuClose}
                                MenuListProps={{
                                    'aria-labelledby': 'vertical-button',
                                }}
                            >
                                <MenuItem onClick={()=>{ setAnchorEl(null); dispatch(getUser(item.id)); navigate('/advisor/view/'+item.id); }}>
                                    <ListItemIcon>
                                        <IconFileDescription size={16} stroke={1} />
                                    </ListItemIcon>
                                    <ListItemText>Details</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={()=>{ setAnchorEl(null); dispatch(getUser(item.id)); navigate('/advisor/edit/'+item.id); }}>
                                    <ListItemIcon>
                                        <IconEdit size={16} stroke={1} />
                                    </ListItemIcon>
                                    <ListItemText>Edit</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
                                    <ListItemIcon>
                                        <IconTrash size={16} stroke={1} />
                                    </ListItemIcon>
                                    <ListItemText>Delete</ListItemText>

                                </MenuItem>
                            </Menu>
                                        
                        </TableCell>
                    </TableRow>)
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={Number(Math.ceil(store.total / rowsPerPage))} sx={{mt: 3}} onChange={(e, value) => handlePagination(value)} />
          </>:<Typography sx={{mt: 5}}>No Data Available</Typography> }
        </Block>
      </Box>
      <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Are you sure want to delete this user?"}
            </DialogTitle>
            <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={()=>{handleConfirmDelete()}} autoFocus>
                OK
            </Button>
            </DialogActions>
      </Dialog>
      <Snackbar
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackBarClose} severity={snackBarMsg.type} sx={{ width: '100%' }}>
            {snackBarMsg.text}
          </Alert>
      </Snackbar>
      <Drawer
        anchor="right"
        open={rightOpen}
        onClose={()=>{setRightOpen(false)}}
      >
        <AddSideBar handleAddSidebar={handleAddSidebar} setSnackBarMsg={setSnackBarMsg} setSnackBarOpen={setSnackBarOpen} />
      </Drawer>
    </>
  )
}

export default Clients;