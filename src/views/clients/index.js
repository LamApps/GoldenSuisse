import {useState, useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Stack,
  Paper,
  Avatar,
  Typography,
  Divider,
  Button,
  Badge,
  Pagination,
  Link,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';

import useJwt from 'utils/jwt/useJwt' 

import { IconSearch } from '@tabler/icons';

import Block from 'ui-component/Block';
import { getData } from 'store/actions/clients'

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
const supStyle = { color: '#585858', fontSize: '10px' };
const AucTableRow = ({id, avatar, isOnline, name, amount, status, income}) => {
  const [isHovering, setHover] = useState(false);
  const onMouseEnterHandler = (event)=>{
    setHover(true);
  }
  const onMouseLeaveHandler = (event)=>{
    setHover(false);
  }
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', height: '60px', my: '5px'}} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
        <Box sx={{flexGrow: 1}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <ClientAvatar avatar={avatar} status={isOnline} name={name} />
            <Box sx={{ml: 1}}>{name}</Box>
          </Box>
        </Box>
        <Box sx={{width: '150px', display: { xs: 'none', sm: 'block'}}}>{amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")} <sup style={{...supStyle}}>EUR</sup></Box>
        <Box sx={{width: '150px', display: { xs: 'none', sm: 'block'}}}>
          <Box sx={{border: 'solid 1px #202020', px:2, py:1, borderRadius: '2rem', display: 'inline-block'}}>{status==='active'?<Typography variant='body1' sx={{mb:0}}>Active</Typography>:(status==='pending'?<Typography variant='body2' sx={{mb:0}}>Pending</Typography>:<Typography variant='body2' sx={{mb:0}}>Inactive</Typography>)}</Box>
          {income>0 && <Badge badgeContent={income} color="primary" sx={{ml: 2}}></Badge>}
        </Box>
        <Box sx={{width: '120px'}}>
          {isHovering && <>
            <Link component={RouterLink} to="/chat" color="white" underline="none">Chat</Link> 
            <Link component={RouterLink} to={"/client/details/overview/"+id} color="white" underline="none" sx={{ml:1}}>Details</Link>
          </>}
        </Box>
      </Box>
      <Divider />
    </>
  )
}

const Clients = props => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const advisorId = useJwt.getUserID();
  const store = useSelector(state => state.clients)

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentStatus, setCurrentStatus] = useState('')

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        advisor_id: advisorId,
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
        advisor_id: advisorId,
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
        advisor_id: advisorId,
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
        advisor_id: advisorId,
        page: page,
        limit: rowsPerPage,
        status: currentStatus,
        q: searchTerm
      })
    )
    setCurrentPage(page)
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={4}>
          <Block>
            <Typography component="p" variant="h1">{store?.allData.length}</Typography>
            <Typography component="p" variant="body1">Total Clients</Typography>
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
          <Typography component="p" variant="h1">{searchTerm===''?'Clients':'Search: '+searchTerm}</Typography>
          {store.data.length>0 ? <>
            <Box sx={{display: 'flex', alignItems: 'center', height: '40px', my: '5px'}}>
              <Box sx={{flexGrow: 1}}><Typography component="p" variant="body2">Name</Typography></Box>
              <Box sx={{width: '150px', display: { xs: 'none', sm: 'block'}}}><Typography component="p" variant="body2">Total holdings</Typography></Box>
              <Box sx={{width: '150px', display: { xs: 'none', sm: 'block'}}}><Typography component="p" variant="body2">Status</Typography></Box>
              <Box sx={{width: '120px'}}></Box>
            </Box>
            {
              store.data.map((item)=><AucTableRow key={item.id} id={item.id} avatar={item.avatar} name={item.fullName} isOnline amount={item.fee_year} status={item.status} income={0}></AucTableRow>)
            }

            <Pagination count={Number(Math.ceil(store.total / rowsPerPage))} sx={{mt: 3}} onChange={(e, value) => handlePagination(value)} />
          </>:<Typography>No Data Available</Typography> }
          
        </Block>
      </Box>
    </>
  )
}

export default Clients;