import {useState, useEffect} from 'react';
import { Link as RouterLink, useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import useJwt from 'utils/jwt/useJwt' 

import { setClientBalances, getClient } from 'store/actions/clients';
import { roundNumber, currencyFormat } from 'utils/common';

import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Grid,
    Stack,
    Paper,
    Button,
    Divider,
    Badge,
    Link,
    IconButton,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

import Chart from 'react-apexcharts';
import {IconCirclePlus} from '@tabler/icons';

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Block from 'ui-component/Block';

const CircleButton = styled(Button)(({ theme }) => ({
    borderRadius: '50%',
    minWidth: '40px',
    minHeight: '40px',
    padding: 0,
    color: theme.palette.primary.light,
    backgroundColor: 'inherit',
    border: 'solid 1px #FFFFFF',
    '&:hover': {
      backgroundColor: '#FBC34A',
      color: theme.palette.common.black,
      border: 'none',
    },
  }));
  
const ClientDetails = props => {
  const theme = useTheme();
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const [balances, setBalances] = useState([])
  const [total, setTotal] = useState(0)

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

  useEffect(() => {
    dispatch(getClient(parseInt(id)));
    useJwt
      .loadClientBalances(id)
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
            dispatch(setClientBalances(balances))
          }

        } else {
          console.log(res.data.ResponseCode)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const [chartSeries, setChartSeries] = useState([]);
  const [duration, setDuration] = useState('1W');
  const handleDuration = (duration) =>{
    setDuration(duration);
  }
  const activeDurationStyle = {
    backgroundColor: '#FBC34A',
    color: theme.palette.common.black,
    border: 'none',
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} sm={12} md={9}>
          <Block sx={{padding:0}}>
            <Outlet />
          </Block>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Stack>
            <Box sx={{p: 2, borderBottom: 'solid 1px #202020'}}>
              <Paper sx={{p: 3}}>
                <Stack spacing={2} divider={<Divider orientation='horizontal'/>}>
                  <Link component={RouterLink} to={"/client/details/overview/"+id} underline='none' color="primary" sx={{px: 1, color: pathname.indexOf('overview')>-1?theme.palette.primary.main:'inherit' }}>OVERVIEW</Link>
                  <Link component={RouterLink} to={"/client/details/profile/"+id} underline='none' color="primary" sx={{px: 1, color: pathname.indexOf('profile')>-1?theme.palette.primary.main:'inherit' }}>PROFILE</Link>
                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1}}>
                    <Link component={RouterLink} to={"/client/details/reports/"+id} underline='none' color="primary" sx={{color: pathname.indexOf('reports')>-1?theme.palette.primary.main:'inherit'}}>REPORTS</Link>
                    {/* <Badge badgeContent={4} color="primary"></Badge> */}
                  </Box>
                  <Link component={RouterLink} to={"/client/details/fees/"+id} underline='none' color="primary" sx={{px: 1, color: pathname.indexOf('fees')>-1?theme.palette.primary.main:'inherit'}}>FEES</Link>
                </Stack>
              </Paper>
            </Box>
            <Box sx={{p: 2}}>
              <Paper sx={{height: '100%', position: 'relative', p: 2}}>
                <Chart options={chartOptions} series={chartSeries} type="donut" />
                <IconButton onClick={()=>{navigate('/client/details/graph/'+id)}} sx={{position: 'absolute', bottom: '10px', right: '10px'}}>
                    <IconCirclePlus size={24} stroke={1} />
                </IconButton>
              </Paper>
            </Box>
            {
              pathname.indexOf('graph') > -1 && <Box sx={{p: 2, borderTop: 'solid 1px #202020'}}>
              <Paper sx={{p: 3}}>
                <Stack direction="row" spacing={2} sx={{mb: 2}}>
                  <CircleButton onClick={()=>handleDuration('1W')} sx={duration==='1W' ? activeDurationStyle: {}}>1W</CircleButton>
                  <CircleButton onClick={()=>handleDuration('1D')} sx={duration==='1D' ? activeDurationStyle: {}}>1D</CircleButton>
                  <CircleButton onClick={()=>handleDuration('24H')} sx={duration==='24H' ? activeDurationStyle: {}}>24H</CircleButton>
                </Stack>
                <Divider sx={{mb: 2}} />
                <Stack>
                  <FormControlLabel
                    label="Gold"
                    sx={{color: 'white'}}
                    control={
                      <Checkbox color='primary' sx={{mb: '5px'}} icon={<RadioButtonUncheckedIcon/>} checkedIcon={<CheckCircleIcon/>}  />
                    }
                  />
                  <FormControlLabel
                    label="Silverbar"
                    sx={{color: 'white'}}
                    control={
                      <Checkbox color='primary' sx={{mb: '5px'}} icon={<RadioButtonUncheckedIcon/>} checkedIcon={<CheckCircleIcon/>}  />
                    }
                  />
                  <FormControlLabel
                    label="GS Card"
                    sx={{color: 'white'}}
                    control={
                      <Checkbox color='primary' sx={{mb: '5px'}} icon={<RadioButtonUncheckedIcon/>} checkedIcon={<CheckCircleIcon/>}  />
                    }
                  />
                </Stack>
              </Paper>
            </Box>
            }
          </Stack>
        </Grid>
      </Grid>
    </Box>

  )
}

export default ClientDetails;