import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { currencyFormat } from 'utils/common';
import useJwt from 'utils/jwt/useJwt';

import { updateClient } from 'store/actions/clients'

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Button,
  Typography,
  Divider,
  Avatar,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';


const BpsTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    width: '80px',
    padding: 0,
    '& fieldset': {
      borderRadius: '5px',
    },
    '& input': {
      padding: '10px',
    },
  },
  '& .MuiInputBase-colorWarning': {
    color: theme.palette.warning.dark,
  }
}));

const AucTableRow = ({name, cost, gross, changeHandler}) => {
  const [grossBPS, setGrossBPS] = useState(gross);
  const [totalBPS, setTotalBPS] = useState(parseInt(cost)+parseInt(gross));
  const [grossDirty, setGrossDirty] = useState('primary');
  const [totalDirty, setTotalDirty] = useState('primary');

  useEffect(()=>{
    setGrossBPS(gross);
    setTotalBPS(parseInt(cost)+parseInt(gross));
  }, [gross, cost])
  
  const handleChange = (event)=>{
    const val = event.target.value === '' ? 0 : parseInt(event.target.value);
    setGrossBPS(val);
    changeHandler(val);
    setTotalBPS(parseInt(cost) + val);
    setGrossDirty('warning');
  }
  const handleChange1 = (event)=>{
    const val = event.target.value === '' ? 0 : parseInt(event.target.value);
    setTotalBPS(val);
    setGrossBPS(val - cost);
    changeHandler(val - cost);
    setTotalDirty('warning');
  }
  
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', height: '40px', my: '5px'}}>
        <Box sx={{flexGrow: 1}}>{name}</Box>
        <Box sx={{width: '100px'}}>{cost}</Box>
        <Box sx={{width: '130px'}}><BpsTextField type="number" value={grossBPS} onChange={handleChange} color={grossDirty} /></Box>
        <Box sx={{width: '130px'}}><BpsTextField type="number" value={totalBPS} onChange={handleChange1} color={totalDirty} /></Box>
      </Box>
      <Divider />
    </>
  )
}

const ClientFees = props => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const store = useSelector(state => state.clients);
  const clientInfo = store.selectedUser;

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');

  const [settings, setSettings] = useState({
    fee_sales_gold_coins: 0,
    fee_sales_gold_bars: 0,
    fee_year_gold_store_manage: 0,
    fee_sales_silver_coins: 0,
    fee_sales_silver_bars: 0,
    fee_year_silver_store_manage: 0,
  })
  const [fee_bps_gold_coin, setFeeBPSGoldCoin] = useState(0)
  const [fee_bps_silver_coin, setFeeBPSSilverCoin] = useState(0)
  const [fee_bps_gold_bar, setFeeBPSGoldBar] = useState(0)
  const [fee_bps_silver_bar, setFeeBPSSilverBar] = useState(0)
  const [fee_bps_gold_storage, setFeeBPSGoldStorage] = useState(0)
  const [fee_bps_silver_storage, setFeeBPSSilverStorage] = useState(0)

  useEffect(() => {
    //dispatch(showProgress(true));
    useJwt
      .loadSettingsInfo()
      .then(res => {
        //dispatch(showProgress(false));
        if (res.data.ResponseCode == 0) {
          //console.log('settings', res.data.ResponseResult)
          setSettings(res.data.ResponseResult);

        } else {
          console.log(res.data.ResponseCode)
        }
      })
      .catch(err => {
        //dispatch(showProgress(false));
        console.log(err)
      })
    if (clientInfo !== null && clientInfo !== undefined) {
      setFeeBPSGoldCoin(clientInfo.fee_bps_gold);
      setFeeBPSSilverCoin(clientInfo.fee_bps_silver);
      setFeeBPSGoldBar(clientInfo.fee_year);
      setFeeBPSSilverBar(clientInfo.fee_other_bps);
      setFeeBPSGoldStorage(clientInfo.fee_au_bps_storage);
      setFeeBPSSilverStorage(clientInfo.fee_ag_bps_storage);
    }
  }, [clientInfo])

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const handleSubmit = () => {
    const data = {
      client_id: clientInfo.id,
      fee_bps_gold_coin,
      fee_bps_gold_bar,
      fee_bps_gold_storage,
      fee_bps_silver_coin,
      fee_bps_silver_bar,
      fee_bps_silver_storage
    }
    console.log(data)
    useJwt
      .updateClientFee(data)
      .then(res => {
        if (res.data.ResponseCode == 0) {
          dispatch(updateClient(res.data.ResponseResult))
          setSnackBarMsg('Saved successfully!')
          setSnackBarOpen(true);
        } else {
          console.log(res)
          setSnackBarMsg('An error occured!')
          setSnackBarOpen(true);
        }
      })
      .catch(err => {
        console.log(err)
        setSnackBarMsg('An error occured!')
        setSnackBarOpen(true);
      })
  }

  const onReset = () => {
    setFeeBPSGoldCoin(clientInfo.fee_bps_gold);
    setFeeBPSSilverCoin(clientInfo.fee_bps_silver);
    setFeeBPSGoldBar(clientInfo.fee_year);
    setFeeBPSSilverBar(clientInfo.fee_other_bps);
    setFeeBPSGoldStorage(clientInfo.fee_au_bps_storage);
    setFeeBPSSilverStorage(clientInfo.fee_ag_bps_storage);
  }
  
  return (
    <Box sx={{height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 67px)'}}}>
      <Grid container>
        <Grid item xs={12} sm={12} md={6} sx={{p: 3, borderRight: {xs: 'none', sm: 'none', md: 'solid 1px #202020'}}}>
          <Box sx={{display: 'flex'}}>
            <Box sx={{width: {xs: '40%', sm: '50%'}, textAlign: 'center'}}>
              <Avatar alt={clientInfo?.fullName} src={clientInfo?.avatar} sx={{ width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120}, mb: 2, mx: 'auto' }}></Avatar>
            </Box>
            <Box sx={{width: {xs: '60%', sm: '50%'}}}>
              <Typography component="p" variant="h2">{clientInfo?.fullName}</Typography>
              <Typography component="p" variant="body1">{clientInfo?.id_number}</Typography>
              <Typography component="p" variant="body1" sx={{mb: '20px'}}>{clientInfo?.country}</Typography>
              <Typography component="p" variant="body2" sx={{mt: '20px'}}>Phone: {clientInfo?.phone}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} sx={{p: 3, borderTop: {xs: 'solid 1px #202020', sm: 'solid 1px #202020', md: 'none'}}}>
          <Typography component="p" variant="h1">{currencyFormat(store.balances.reduce((total, item)=>total+item.current_balance, 0), 2)} <sup style={{fontSize: 18, fontWeight: 100}}>EUR</sup></Typography>
          <Typography component="p" variant="body1">Client Holdings</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} sx={{p:3, borderTop: 'solid 1px #202020'}}>
          <Typography component="p" variant="h1" sx={{mb:3}}>Client Fees</Typography>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{bgcolor: theme.palette.common.gold, width: 20, height: 20, borderRadius: '50%'}} /> 
            <Typography component="span" variant="h4" sx={{mb: 0, ml: 3}}>Gold</Typography>
          </Box>
          <Divider sx={{my: 2}} />
          <form onSubmit={e => {
            e.preventDefault();
            handleSubmit()
          }}>
          <Box sx={{display: 'flex', alignItems: 'center', height: '40px', my: '5px'}}>
            <Box sx={{flexGrow: 1}}></Box>
            <Box sx={{width: '100px', display: { xs: 'none', sm: 'block'}}}><Typography component="p" variant="body2">Cost BPS</Typography></Box>
            <Box sx={{width: '130px', display: { xs: 'none', sm: 'block'}}}><Typography component="p" variant="body2">Gross Margin BPS</Typography></Box>
            <Box sx={{width: '130px'}}><Typography component="p" variant="body2">Client Total BPS</Typography></Box>
          </Box>
          <AucTableRow name='Sales Investment Coins' cost={settings.fee_sales_gold_coins} gross={fee_bps_gold_coin} changeHandler={setFeeBPSGoldCoin}></AucTableRow>
          <AucTableRow name='Sales Bars' cost={settings.fee_sales_gold_bars} gross={fee_bps_gold_bar} changeHandler={setFeeBPSGoldBar}></AucTableRow>
          <AucTableRow name='Storage and Management P.A.' cost={settings.fee_year_gold_store_manage} gross={fee_bps_gold_storage} changeHandler={setFeeBPSGoldStorage}></AucTableRow>

          <Box sx={{display: 'flex', alignItems: 'center', mt: 4}}>
            <Box sx={{bgcolor: theme.palette.common.silver, width: 20, height: 20, borderRadius: '50%'}} /> 
            <Typography component="span" variant="h4" sx={{mb: 0, ml: 3}}>Silver</Typography>
          </Box>
          <Divider sx={{my: 2}} />
          <Box sx={{display: 'flex', alignItems: 'center', height: '40px', my: '5px'}}>
            <Box sx={{flexGrow: 1}}></Box>
            <Box sx={{width: '100px', display: { xs: 'none', sm: 'block'}}}><Typography component="p" variant="body2">Cost BPS</Typography></Box>
            <Box sx={{width: '130px', display: { xs: 'none', sm: 'block'}}}><Typography component="p" variant="body2">Gross Margin BPS</Typography></Box>
            <Box sx={{width: '130px'}}><Typography component="p" variant="body2">Client Total BPS</Typography></Box>
          </Box>
          <AucTableRow name='Sales Investment Coins' cost={settings.fee_sales_silver_coins} gross={fee_bps_silver_coin} changeHandler={setFeeBPSSilverCoin}></AucTableRow>
          <AucTableRow name='Sales Bars' cost={settings.fee_sales_silver_bars} gross={fee_bps_silver_bar} changeHandler={setFeeBPSSilverBar}></AucTableRow>
          <AucTableRow name='Storage and Management P.A.' cost={settings.fee_year_silver_store_manage} gross={fee_bps_silver_storage} changeHandler={setFeeBPSSilverStorage}></AucTableRow>
          <Box sx={{mt: 4}}>
            <Button color="primary" variant="contained" type='submit'>SAVE CHANGES</Button> 
            <Button color="secondary" variant="contained" sx={{ml: 3}} onClick={onReset}>RESET ALL</Button> 
          </Box>
          </form>
        </Grid>
      </Grid>
      <Snackbar
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
            {snackBarMsg}
          </Alert>
      </Snackbar>
    </Box>
    
  )
}

export default ClientFees;