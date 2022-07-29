import {useState, useEffect} from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

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
    DialogContent,
  } from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

import useJwt from 'utils/jwt/useJwt';
import { getUser, deleteUser } from 'store/actions/user'
import { getData, addConnection, removeConnection } from 'store/actions/clients'

import { IconUser, IconCheck, IconStar, IconPhone, IconPlus, IconSearch, IconTrash, IconEdit, IconFileDescription, IconDotsVertical } from '@tabler/icons';

import Block from 'ui-component/Block';

import AddConnection from './AddConnection';

const InfoLine = styled(Typography)(({ theme }) => ({
    marginBottom: '5px',
}));

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

const ClientAvatar = ({avatar, number, status, name}) => {
  return (
  <Badge color='primary' badgeContent={number} overlap="circular">
    { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/></Badge> : <Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/> }
  </Badge>
  )
}

const AdvisorView = props => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  const store = useSelector(state => state.users);
  const clientStore = useSelector(state => state.clients);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentStatus, setCurrentStatus] = useState('')
  
  const [currentId, setCurrentId] = useState();
  // Delete Flag: advisor/client
  const [currentDeleteFlag, setCurrentDeleteFlag] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const popperOpen = Boolean(anchorEl);

  //Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  //Modal Form
  const [modalFormOpen, setModalFormOpen] = useState(false);

  //Snack Bar
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState({
    text: '',
    type: 'error',
  });

  useEffect(() => {
    dispatch(getUser(parseInt(id)))
  }, [dispatch])

// ** Get data on mount
    useEffect(() => {
        dispatch(
            getData({
                advisor_id: id,
                page: currentPage,
                limit: rowsPerPage,
                status: currentStatus,
                q: searchTerm
            })
        )
    }, [])

  const activeButtonStyle = {
    backgroundColor: '#FBC34A',
    color: theme.palette.common.black,
    borderColor: theme.palette.common.black,
  }

  const handleStatus = (status) =>{
    setCurrentStatus(status)
    dispatch(
      getData({
        advisor_id: id,
        page: currentPage,
        limit: rowsPerPage,
        status: status,
        q: searchTerm
      })
    )
  }

  const handleFilter = val => {
    setSearchTerm(val)
    dispatch(
      getData({
        advisor_id: id,
        page: currentPage,
        limit: rowsPerPage,
        status: currentStatus,
        q: val
      })
    )
  }

  const handlePagination = page => {
    dispatch(
      getData({
        advisor_id: id,
        page: page,
        limit: rowsPerPage,
        status: currentStatus,
        q: searchTerm
      })
    )
    setCurrentPage(page)
  }

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentId(id)
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //advisor delete
  const handleAdvisorDelete = () => {
    setDialogOpen(false);
    setCurrentDeleteFlag(null);
    useJwt
      .deleteAdvisor(id)
      .then(res => {
        if (res.data.ResponseCode == 0) {
          dispatch(deleteUser(id))

          navigate('/advisors')

        } else {
          console.log(res.data.ResponseCode)

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
  // ** Function calling api to connect client with advisor
  const handleConnect = data => {
    const email = data.email;
    setModalFormOpen(false);
    if (!email) return;

    useJwt
      .addConnection({
        advisor_id: id,
        client_email: email
      })
      .then(res => {
        if (res.data.ResponseCode === 0) {
          const newClient = res.data.ResponseResult.client;              
          console.log('ADD_CONNECTION', newClient);
          dispatch(addConnection(newClient));
          setSnackBarMsg({
            text: 'Successfully Added.',
            type: 'success'
          })
          setSnackBarOpen(true);
          
        } else {
          console.log(res.data.ResponseCode)
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
  const handleConfirmDelete = () => {
    setDialogOpen(false);
    setCurrentDeleteFlag(null);

    if (!currentId) return;
    // console.log(deletingUserID)
    const params = {advisor_id: id, client_id: currentId}

    useJwt
      .removeConnection(params)
      .then(res => {
        if (res.data.ResponseCode === 0) {
          dispatch(removeConnection(currentId))
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

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleModalClose = () => {
    setModalFormOpen(false);
  };


  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={6}>
          <Block>
            <Box sx={{display: 'flex'}}>
              <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                <Avatar alt={store.selectedUser?.fullName} src={store.selectedUser?.avatar_url} sx={{ width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120} }}></Avatar>
              </Box>
              <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                <Typography component="p" variant="h2">{store.selectedUser?.fullName}</Typography>
                <Typography component="p" variant="body1" sx={{mb:3}}>{store.selectedUser?.email}</Typography>
                <Button variant="contained" sx={{mr: 2}} onClick={()=>{navigate('/advisor/edit/'+id)}}>Edit</Button>
                <Button variant="contained" color="secondary" onClick={()=>{setCurrentDeleteFlag('advisor'); setDialogOpen(true)}}>Delete</Button>
              </Box>
            </Box>
          </Block>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
            <Box sx={{display: 'flex', p: 3}}>
              <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                <InfoLine component="p" variant="body2"><IconUser size={12} stroke={2} /> Username</InfoLine>
                <InfoLine component="p" variant="body2"><IconCheck size={12} stroke={2} /> Status</InfoLine>
                <InfoLine component="p" variant="body2"><IconStar size={12} stroke={2} /> Role</InfoLine>
                <InfoLine component="p" variant="body2"><IconPhone size={12} stroke={2} /> Contact Number</InfoLine>
              </Box>
              <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                <InfoLine component="p" variant="body1">{store.selectedUser?.username}</InfoLine>
                <InfoLine component="p" variant="body1">{store.selectedUser?.status===1? 'Active': (store.selectedUser?.status===-1?'Pending':'Inactive')}</InfoLine>
                <InfoLine component="p" variant="body1">{store.selectedUser?.role}</InfoLine>
                <InfoLine component="p" variant="body1">{store.selectedUser?.phone}</InfoLine>
              </Box>
            </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} md={4}>
          <Block>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                <Box>
                    <Typography component="p" variant="h1">{clientStore?.allData.length}</Typography>
                    <Typography component="p" variant="body1">Total Clients</Typography>
                </Box>
                <Button variant='contained' onClick={()=>setModalFormOpen(true)}><IconPlus size={18} stroke={1} /> ADD CONNECTION</Button>
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
          <Typography component="h1" variant="h1" sx={{mb: 3}}>{searchTerm===''?'Clients':'Search: '+searchTerm}</Typography>
          {clientStore.data.length>0 ? <>
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
                    clientStore.data.map((item)=><TableRow key={item.id} >
                        <TableCell component="th" scope="row">
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <ClientAvatar avatar={item.avatar} name={item.fullName} />
                                <Link component={RouterLink} to={"/client/details/overview/"+item.id} underline='none' sx={{color: theme.palette.primary.main, ml: 2}}>{item.fullName}</Link>
                            </Box>
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>
                            <Chip color={item.status==='active'?"success":(item.status==='pending'?"warning":"default")} variant="outlined" label={item.status.charAt(0).toUpperCase() + item.status.slice(1)} />
                        </TableCell>
                        <TableCell>
                            <IconButton
                                aria-controls={popperOpen ? 'vertical-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={popperOpen ? 'true' : undefined}
                                onClick={(e)=>handleMenuClick(e, item.id)}
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
                                <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/client/details/overview/'+currentId); }}>
                                    <ListItemIcon>
                                        <IconFileDescription size={16} stroke={1} />
                                    </ListItemIcon>
                                    <ListItemText>Details</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/client/details/fees/'+currentId); }}>
                                    <ListItemIcon>
                                        <IconEdit size={16} stroke={1} />
                                    </ListItemIcon>
                                    <ListItemText>Edit</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={()=>{setAnchorEl(null); setDialogOpen(true); setCurrentDeleteFlag('client')}}>
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
            <Pagination count={Number(Math.ceil(clientStore.total / rowsPerPage))} sx={{mt: 3}} onChange={(e, value) => handlePagination(value)} />
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
            Are you sure want to delete this {currentDeleteFlag}?
            </DialogTitle>
            <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={()=>{currentDeleteFlag==='advisor'?handleAdvisorDelete():handleConfirmDelete()}} autoFocus>
                OK
            </Button>
            </DialogActions>
      </Dialog>
      <Dialog
            open={modalFormOpen}
            onClose={handleModalClose}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <AddConnection handleModalClose={handleModalClose} handleConnect={handleConnect} />
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
    </>
  )
}

export default AdvisorView;