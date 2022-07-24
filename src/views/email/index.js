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
    <Grid container>
        <Grid item sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} md={3}>
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
        <Grid item xs={12} sm={12} md={9}>
        </Grid>
    </Grid>
  )
}

export default Portfolio;