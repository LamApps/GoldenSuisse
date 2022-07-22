import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';

import Chart from 'react-apexcharts'

import { IconUsers } from '@tabler/icons';
import { IconCirclePlus } from '@tabler/icons';

import { isUserLoggedIn, roundNumber, currencyFormat } from 'utils/common';
import useJwt from 'utils/jwt/useJwt';
import { getData } from 'store/actions/clients'

import { formatDate } from 'utils/common';
import Block from 'ui-component/Block';
import TableRow from 'ui-component/TableRow';

const ClientAvatar = ({avatar, number, status, name}) => {
  return (
  <Badge color='primary' badgeContent={number} overlap="circular">
    { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/></Badge> : <Avatar alt={name} src={avatar} sx={{width: 50, height: 50}}/> }
  </Badge>
  )
}
const Portfolio = props => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [chartOptions, setChartOptions] = useState({
    stroke: {
      show: false
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '85%',
          labels: {
            show: true,
            name: {
              color: '#ffffff'
            },
            value: {
              color: '#ffffff',
              formatter: function(val){
                return roundNumber(val, 2) + ' EUR';
              }
            },
            total: {
              show: true,
              label: 'Total',
              color: '#ffffff',
              formatter: function (w) {
                return total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' EUR'
              }
            }
          },
        }
      }
    },
    colors: [theme.palette.common.gold, theme.palette.common.silver, theme.palette.common.goldBar, theme.palette.common.silverBar, theme.palette.common.black],
    labels: [],
    legend: {
      show: false
    }
  });
  const [chartSeries, setChartSeries] = useState([]);

  const [total, setTotal] = useState(0);
  const [balances, setBalances] = useState([]);
  const [userData, setUserData] = useState({});

  const dispatch = useDispatch();
  const store = useSelector(state => state.clients);

  useEffect(() => {
    if (isUserLoggedIn()) {
      const strUserData = localStorage.getItem('userData')
      try {
        const userData = JSON.parse(strUserData);
        setUserData(userData)
        // if (userData && userData.role && userData.role == 'admin') {
        //   history.push('/user/list')
        //   return;
        // }
      } catch (err) {
        console.log(err)
      }
    }
    loadData(false);
    dispatch(
      getData({
        advisor_id: useJwt.getUserID(),
        page: 1,
        limit: 3,
        status: '',
        q: ''
      })
    )
  }, [])

  const loadData = (refresh) => {
    useJwt
      .loadAdvisorOverview(refresh?1:0)
      .then(res => {
        if (res.data.ResponseCode == 0) {
          let totalValue = 0
          for (let item of res.data.ResponseResult) {
            totalValue = totalValue + parseFloat(item.current_balance)
          }

          if (totalValue > 0) {
            let balances = []
            let labels = []
            let currentBalances = []
            for (let item of res.data.ResponseResult) {
              const percent = roundNumber(parseFloat(item.current_balance) * 100 / totalValue, 2)
              balances.push({
                ...item,
                percent: percent ? percent : 0
              })
              labels.push(item.type)
              currentBalances.push(roundNumber(item.current_balance, 2))
            }
            setBalances(balances);
            setTotal(totalValue);
            setChartOptions({...chartOptions, labels, plotOptions: {
              pie: {
                donut: {
                  size: '85%',
                  labels: {
                    show: true,
                    name: {
                      color: '#ffffff'
                    },
                    value: {
                      color: '#ffffff',
                      formatter: function(val){
                        return roundNumber(parseFloat(val) * 100 / totalValue, 2) + ' %';
                      }
                    },
                    total: {
                      show: true,
                      label: 'Total',
                      color: '#ffffff',
                      formatter: function (w) {
                        return '€ ' + currencyFormat(totalValue, 2)
                      }
                    }
                  },
                }
              }
            }});
            setChartSeries(currentBalances);

          }
        } else {
          console.log(res.data.ResponseCode)
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack>
        <Grid container>
          <Grid item xs={12} sm={12} md={4}>
            <Block>
              <Box sx={{display: 'flex', mb: '30px'}}>
                <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                  <Avatar alt={userData.fullName} src={userData.avatar_url} sx={{ width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120} }}></Avatar>
                </Box>
                <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                  <Typography component="p" variant="h2">{userData.fullName}</Typography>
                  <Typography component="p" variant="body1">{userData.role && userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</Typography>
                  <Typography component="p" variant="body1" sx={{mb: '20px'}}>{userData?.city} {userData?.country}</Typography>
                  {/* <Link href="#" underline="none">Edit</Link> */}
                </Box>
              </Box>
              <Box sx={{display: 'flex', mb: '30px'}}>
                <Box sx={{width: {xs: '40%', sm: '50%'}}}>
                  {/* <Typography component="p" variant="body2">Bonus</Typography> */}
                  <Typography component="p" variant="body2">Registered</Typography>
                  <Typography component="p" variant="body2">Status</Typography>
                </Box>
                <Box sx={{width: {xs: '60%', sm: '50%'}}}>
                  {/* <Typography component="p" variant="body1">0.2%</Typography> */}
                  <Typography component="p" variant="body1">{formatDate(userData?.registered_at)}</Typography>
                  <Typography component="p" variant="body1">{userData.client_status && userData.client_status.charAt(0).toUpperCase() + userData.client_status.slice(1)}</Typography>
                </Box>
              </Box>
              <Link href="#" underline="none">Details</Link>
            </Block>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Block sx={{padding: 0}}>
              <Box sx={{height: '40%', padding: '20px', borderBottom: 'solid 1px #202020'}}>
                <Typography component="p" variant="h1">{currencyFormat(total, 2)} <sup style={{fontSize: 18, fontWeight: 100}}>EUR</sup></Typography>
                <Typography component="p" variant="body1">Assets Under Custody</Typography>
              </Box>
              <Box sx={{height: '60%', padding: '20px'}}>
                <Typography component="p" variant="h1">{store?.total}</Typography>
                <Typography component="p" variant="body1" sx={{mb: '20px'}}>Total Clients</Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Stack direction="row" spacing={2}>
                    {
                      store?.data.map((client)=><ClientAvatar key={client.id} name={client.fullName} avatar={client.avatar} />)
                    }
                  </Stack>
                  <IconButton onClick={()=>{navigate('/clients')}}>
                    <IconUsers size={36} stroke={1}/>
                  </IconButton>
                </Box>
              </Box>
            </Block>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Block>
              <Paper sx={{height: '100%', position: 'relative', p: 2}}>
                <Chart options={chartOptions} series={chartSeries} type="donut" />
                <IconButton onClick={()=>{navigate('/portfolio/graph')}} sx={{position: 'absolute', bottom: '10px', right: '10px'}}>
                    <IconCirclePlus size={24} stroke={1} />
                </IconButton>
              </Paper>
            </Block>
          </Grid>
        </Grid>
        <Box sx={{ flexGrow: 1 }}>
          <Block sx={{outline: 'none', borderTop: 'solid 1px #202020'}}>
            <Typography component="p" variant="h1" sx={{mb: 3}}>AUC</Typography>
            {
              balances.map((balance)=><TableRow key={balance.type} moneyType={balance.type} amount={balance.current_balance} percentage={balance.percent}></TableRow>)
            }
          </Block>
        </Box>
      </Stack>
    </Box>
  )
}

export default Portfolio;