import { useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { currencyFormat } from 'utils/common';

import {
  Box,
  Grid,
  Paper,
  Avatar,
  Typography,
  Link,
} from '@mui/material';
import TableRow from 'ui-component/TableRow';

const ClientOverview = props => {
  const store = useSelector(state => state.clients);
  const { id } = useParams();
  const clientInfo = store.selectedUser;

  return (
    <Box sx={{p:'20px', height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 67px)'}}}>
      <Paper sx={{height: '100%'}}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{borderRight: { sm: 'solid 1px #202020', xs: 'none'}}}>
            <Box sx={{display: 'flex', p: 2}}>
              <Box sx={{width: {xs: '40%', sm: '50%'}, textAlign: 'center'}}>
                <Avatar alt={clientInfo?.fullName} src={clientInfo?.avatar} sx={{ bgcolor: '#000000', width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120}, mb: 2, mx: 'auto' }}></Avatar>
                <Box sx={{border: 'solid 1px #202020', px:2, py:1, borderRadius: '2rem', display: 'inline-block'}}>{clientInfo?.status && clientInfo?.status.charAt(0).toUpperCase() + clientInfo.status.slice(1)}</Box>
              </Box>
              <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                <Typography component="p" variant="h2">{clientInfo?.fullName}</Typography>
                <Typography component="p" variant="body1">{clientInfo?.id_number}</Typography>
                <Typography component="p" variant="body1" sx={{mb: '20px'}}>{clientInfo?.country}</Typography>
                <Link component={RouterLink} to={"/client/details/profile/"+id} underline="none">Profile</Link>
                <Typography component="p" variant="body2" sx={{mt: '20px'}}>Phone: {clientInfo?.phone}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{p: 3, borderTop: { xs: 'solid 1px #202020', sm: 'none'}}}>
            <Typography component="p" variant="h1">{currencyFormat(store.balances.reduce((total, item)=>total+item.current_balance, 0), 2)} <sup style={{fontSize: 18, fontWeight: 100}}>EUR</sup></Typography>
            <Typography component="p" variant="body1">Client Holdings</Typography>
          </Grid>
          <Grid item xs={12} sm={12} sx={{borderTop: 'solid 1px #202020'}}>
            <Box sx={{p: 3}}>
              <Typography component="p" variant="h1" sx={{mb: 2}}>Holdings</Typography>
              {
                store.balances.map((item)=><TableRow key={item.id} moneyType={item.type} amount={item.current_balance} percentage={item.percent}></TableRow>)
              }
          </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default ClientOverview;