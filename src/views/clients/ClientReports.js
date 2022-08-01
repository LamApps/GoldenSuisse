import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useJwt from 'utils/jwt/useJwt';

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';

import {IconArrowNarrowUp} from '@tabler/icons';
import {IconArrowNarrowDown} from '@tabler/icons';

import { formatReportDate } from 'utils/common'


const AssetDropdown = styled(Select)(({ theme }) => ({
  background: theme.palette.common.black,
  color: theme.palette.text.primary,
}));

let firstLoad = true;
let currentYear = 2022;
let currentMonth = 4;

const ClientReports = props => {
  const store = useSelector(state => state.clients);
  const dispatch = useDispatch();

  const [accountNumber, setAccountNumber] = useState(0)
  const [accountOptions, setAccountOptions] = useState([])
  const [showLoadMore, setShowLoadMore] = useState(true)

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)

  //Snack Bar
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState({
    text: '',
    type: 'error',
  });

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  useEffect(() => {
    if (store.balances.length == 0) return;
    
    currentYear = new Date().getFullYear()
    currentMonth = new Date().getMonth()

    if (accountNumber == 0) {
      setAccountNumber(store.balances[0].account_number)
    }

    setAccountOptions([
      { value: getBalance('Gold').account_number, label: `Gold - ${getBalance('Gold').account_number}` },
      { value: getBalance('Silver').account_number, label: `Silver - ${getBalance('Silver').account_number}` },
      { value: getBalance('Goldbar').account_number, label: `Goldbar - ${getBalance('Goldbar').account_number}` },
      { value: getBalance('Silverbar').account_number, label: `Silverbar - ${getBalance('Silverbar').account_number}` },
      { value: getBalance('Card').account_number, label: `Card - ${getBalance('Card').account_number}` }
    ])

  }, [store.balances])

  useEffect(() => {
    loadTransactions(1)
  }, [accountNumber])

  const getBalance = (type) => {
    if (store.balances.length === 0) return;

    for (let item of store.balances) {
      if (item.type === type) {
        return item
      }
    }
    return {}
  }

  const getIndex = accountNumber => {
    for (let index = 0; index < store.balances.length; index++) {
      let balance = store.balances[index];
      if (balance.account_number == accountNumber) {
        return index;
      }
    }
    return 0;
  }

  const getType = accountNumber => {
    if (store.balances.length == 0) return '';

    for (let item of store.balances) {
      if (item.account_number == accountNumber) {
        return item.type
      }
    }

    return 'Gold'
  }

  const handleChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const getMonthParam = month => {
    if (month < 10) {
      return '0' + month
    } else {
      return '' + month
    }
  }

  const loadTransactions = (loadMore) => {
    setShowLoadMore(true);

    if (accountNumber == 0) {
      setList([])
      return;
    }
    let data = [...list]
    if (!loadMore) {
      data = []
      setList([])
      currentYear = new Date().getFullYear()
      currentMonth = new Date().getMonth() + 1

    } else {
      currentMonth = currentMonth - 1
      if (currentMonth < 0) {
        currentMonth = 12
        currentYear = currentYear - 1
      }
    }
    // const startIndex = 10 * (page-1) + 1;
    // const endIndex = 10 * page;
    // const params = {
    //   account_number: accountNumber,
    //   start: startIndex,
    //   end: endIndex
    // }

    if (getType(accountNumber) == 'Card') {
      const params = {
        card_number: accountNumber,
        year: currentYear,
        month: getMonthParam(currentMonth)
      }

      useJwt
      .loadClientCardTransactions({ params })
      .then(res => {
        console.log('res', res)
        if (res.data.ResponseCode == 0) {
          if (res.data.ResponseResult.length > 0 && res.data.ResponseResult[0].constructor !== Array) {
            setList([...data, ...res.data.ResponseResult])
          } else {
            setShowLoadMore(false); 
            setSnackBarMsg({
              text: 'No more data',
              type: 'warning'
            })
            setSnackBarOpen(true);
          }
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
          text: 'Network Error',
          type: 'error'
        })
        setSnackBarOpen(true);
      })

    } else {
      const params = {
        account_number: accountNumber,
        start: data.length + 1,
        end: data.length + 20
      }
      
      useJwt
      .loadClientTransactions({ params })
      .then(res => {
        if (res.data.ResponseCode == 0) {
          if (res.data.ResponseResult.length > 0 && res.data.ResponseResult[0].constructor !== Array) {
            setList([...data, ...res.data.ResponseResult])
          } else {
            setShowLoadMore(false); 
            setSnackBarMsg({
              text: 'No more data',
              type: 'warning'
            })
            setSnackBarOpen(true);
          }
        } else {
          console.log(res.data.ResponseCode)
          setSnackBarMsg({
            text: res.data.ResponseMessage,
            type: 'warning'
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
  }

  const renderData = () => {
    if (getType(accountNumber) == 'Card') {
      return list.map(col => {
        const IconTag = Number(col.Amount) < 0 ? (
          <IconArrowNarrowDown size={14} stroke={1} />
        ) : (
          <IconArrowNarrowUp size={12} stroke={1} />
        )
        return(<TableRow
          key={col.Id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {IconTag}
          </TableCell>
          <TableCell>{col.Amount}</TableCell>
          <TableCell>{col.Description}</TableCell>
          <TableCell>{formatReportDate(col.Date)}</TableCell>
        </TableRow>)
      })
    } else {
      return list.map(col => {

        const IconTag = col.DebitCredit == "Credit" ? (
          <IconArrowNarrowUp size={12} stroke={1} />
        ) : (
          <IconArrowNarrowDown size={14} stroke={1} />
        )
        return(<TableRow
          key={col.Id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {IconTag}
          </TableCell>
          <TableCell>{col.Amount}</TableCell>
          <TableCell>{col.Description}</TableCell>
          <TableCell>{formatReportDate(col.CreationDate)}</TableCell>
        </TableRow>)
      })
    }
  }

  return (
    <Box sx={{height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 67px)'}}}>
      <Grid container>
        <Grid item xs={12} sm={12} md={6} sx={{p: 3, borderRight: {xs: 'none', sm: 'none', md: 'solid 1px #202020'}}}>
          <Typography component="p" variant="h1">{store.total}</Typography>
          <Typography component="p" variant="body1">Total Clients</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6} sx={{p: 3, borderTop: {xs: 'solid 1px #202020', sm: 'solid 1px #202020', md: 'none'}}}>
          <FormControl fullWidth>
            <AssetDropdown value={accountNumber} onChange={handleChange} displayEmpty>
              {
                accountOptions.map((item)=><MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)
              }
            </AssetDropdown>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} sx={{p:3, borderTop: 'solid 1px #202020'}}>
          <Typography component="p" variant="h1" sx={{mb:3}}>Reports</Typography>
          <TableContainer component={Box} sx={{maxHeight: 'calc(100vh - 357px)'}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Stock</TableCell>
                  <TableCell>{getType(accountNumber) == 'Card' ? getBalance('Card').currency : 'Oz'} </TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date/Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                renderData()
                }
              </TableBody>
            </Table>
          </TableContainer>

          {showLoadMore && (
            <Button color='primary' variant="contained" sx={{mt: 3}} onClick={e => {
              e.stopPropagation();
              loadTransactions(true);
            }}>Load More</Button>
          )}

        </Grid>
      </Grid>
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
    </Box>
  )
}

export default ClientReports;