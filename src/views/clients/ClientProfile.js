import { useSelector } from 'react-redux'
import { currencyFormat } from 'utils/common';

import {
  Box,
  Grid,
  Paper,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';


const ClientProfile = props => {
  const store = useSelector(state => state.clients)
  const clientInfo = store.selectedUser;
  return (
    <Box sx={{p:'20px', height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 67px)'}}}>
      <Paper sx={{height: '100%'}}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{borderRight: { sm: 'solid 1px #202020', xs: 'none'}}}>
            <Box sx={{display: 'flex', p: 2}}>
              <Box sx={{width: {xs: '40%', sm: '50%'}, textAlign: 'center'}}>
                <Avatar alt={clientInfo?.fullName} src={clientInfo?.avatar} sx={{ bgcolor:'#000000', width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120}, mb: 2, mx: 'auto' }}></Avatar>
                <Box sx={{border: 'solid 1px #202020', px:2, py:1, borderRadius: '2rem', display: 'inline-block'}}>{clientInfo?.status && clientInfo?.status.charAt(0).toUpperCase() + clientInfo.status.slice(1)}</Box>
              </Box>
              <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                <Typography component="p" variant="h2">{clientInfo?.fullName}</Typography>
                <Typography component="p" variant="body1">{clientInfo?.id_number}</Typography>
                <Typography component="p" variant="body1" sx={{mb: '20px'}}>{clientInfo?.country}</Typography>
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
              <Typography component="p" variant="h1" sx={{mb: 3}}>Client Profile</Typography>
              <Typography component="p" variant="h3" sx={{mb: 2}}>General</Typography>
              <Divider sx={{mb:3}} />
              <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                  <Box sx={{display: 'flex', mb: '30px'}}>
                    <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                      <Typography component="p" variant="body2">First Name:</Typography>
                      <Typography component="p" variant="body2">Last Name:</Typography>
                      <Typography component="p" variant="body2">Date of Birth:</Typography>
                      <Typography component="p" variant="body2">Type of ID:</Typography>
                    </Box>
                    <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                      <Typography component="p" variant="body1">{clientInfo?.first_name}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.last_name}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.dob}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.identification_type}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Box sx={{display: 'flex', mb: '30px'}}>
                    <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                      <Typography component="p" variant="body2">Country of Residence:</Typography>
                      <Typography component="p" variant="body2">Country of Citizenship:</Typography>
                      <Typography component="p" variant="body2">Email Address:</Typography>
                    </Box>
                    <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                      <Typography component="p" variant="body1">{clientInfo?.country}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.citizenship}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.email}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                  <Typography component="p" variant="h3" sx={{mb: 2}}>Address</Typography>
                  <Divider sx={{mb:3}} />

                  <Box sx={{display: 'flex', mb: '30px'}}>
                    <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                      <Typography component="p" variant="body2">Address Line1:</Typography>
                      <Typography component="p" variant="body2">Address Line2:</Typography>
                      <Typography component="p" variant="body2">Region:</Typography>
                      <Typography component="p" variant="body2">Zip/Postal Code:</Typography>
                      <Typography component="p" variant="body2">Country:</Typography>
                    </Box>
                    <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                      <Typography component="p" variant="body1">{clientInfo?.pa_address1}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.pa_address2}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.pa_city}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.pa_zip}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.pa_country}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Typography component="p" variant="h3" sx={{mb: 2}}>Mailing Address</Typography>
                  <Divider sx={{mb:3}} />

                  <Box sx={{display: 'flex', mb: '30px'}}>
                    <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                      <Typography component="p" variant="body2">Address Line1:</Typography>
                      <Typography component="p" variant="body2">Address Line2:</Typography>
                      <Typography component="p" variant="body2">Region:</Typography>
                      <Typography component="p" variant="body2">Zip/Postal Code:</Typography>
                      <Typography component="p" variant="body2">Country:</Typography>
                    </Box>
                    <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                      <Typography component="p" variant="body1">{clientInfo?.ma_address1}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.ma_address2}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.ma_city}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.ma_zip}</Typography>
                      <Typography component="p" variant="body1">{clientInfo?.ma_country}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default ClientProfile;