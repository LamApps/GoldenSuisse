import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useJwt from 'utils/jwt/useJwt';

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Divider,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer
} from '@mui/material';

import {IconArrowNarrowUp} from '@tabler/icons';
import {IconArrowNarrowDown} from '@tabler/icons';


const AssetDropdown = styled(Select)(({ theme }) => ({
  background: theme.palette.common.black,
  color: theme.palette.text.primary,
}));

const ClientReports = props => {
  const store = useSelector(state => state.clients);
  const [accountNumber, setAccountNumber] = useState(0)
  const [accountOptions, setAccountOptions] = useState([])
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (store.balances.length === 0) return;

    if (accountNumber === 0) {
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

  const handleChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handlePagination = page => {
    loadTransactions(page)
  }

  const loadTransactions = (page) => {
    if (accountNumber === 0) return;

    const startIndex = 10 * (page-1) + 1;
    const endIndex = 10 * page;
    const params = {
      account_number: accountNumber,
      start: startIndex,
      end: endIndex
    }

    //dispatch(showProgress(true));
    useJwt
      .loadClientTransactions({ params })
      .then(res => {
        //dispatch(showProgress(false));
        if (res.data.ResponseCode === 0) {
          if (res.data.ResponseResult.result.length > 0 && res.data.ResponseResult.result[0].constructor !== Array) {
            setList(res.data.ResponseResult.result);
            setTotal(res.data.ResponseResult.total);
          } else {
            setTotal(0);
            setList([]);
          }
        } else {
          console.log(res.data.ResponseCode)
        }
      })
      .catch(err => {
        console.log(err)
        //dispatch(showProgress(false));
      })
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
                  <TableCell>Oz</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date/Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                list.map((item)=>{
                  return(<TableRow
                    key={item.Id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.Outgoing==='true'?<IconArrowNarrowDown size={14} stroke={1} />:<IconArrowNarrowUp size={12} stroke={1} />}
                    </TableCell>
                    <TableCell>{item.Amount}</TableCell>
                    <TableCell>{item.Description}</TableCell>
                    <TableCell>{item.CreationDate}</TableCell>
                  </TableRow>)
                })
                }
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination count={Number(Math.ceil(total / 10))} sx={{mt: 3}} onChange={(e, value) => handlePagination(value)} />

        </Grid>
      </Grid>
    </Box>
  )
}

export default ClientReports;