import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Stack,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Chart from 'react-apexcharts';

import Block from 'ui-component/Block';

import { IconArrowBackUp } from '@tabler/icons';

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

const PortfolioGraph = props => {
  const theme = useTheme();
  const navigate = useNavigate();
  const donutOption = {
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
                return val + '%';
              }
            },
            total: {
              show: true,
              label: 'Total',
              color: '#ffffff',
              formatter: function (w) {
                return (2045120.02).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' EUR'
              }
            }
          },
        }
      }
    },
    colors: [theme.palette.common.gold, theme.palette.common.silver, theme.palette.common.silverBar, theme.palette.common.black],
    labels: ['Gold', 'Silver', 'Silverbar', 'Others'],
    legend: {
      show: false
    }
  };
  const lineOption = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#202020',
      row: {
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    tooltip: {
      theme: 'dark'
    }
  };
  const [donutSeries, setDonutSeries] = useState([25.03, 28.02, 41.05, 5.9]);
  const [lineSeries, setLineSeries] = useState([{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }]);
  const activeDurationStyle = {
    backgroundColor: '#FBC34A',
    color: theme.palette.common.black,
    border: 'none',
  }
  const [duration, setDuration] = useState('1W');
  const handleDuration = (duration) =>{
    setDuration(duration);
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} sm={12} md={8}>
          <Block sx={{height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 67px)'}}}>
            <Paper sx={{height: '100%'}}>
              <Box sx={{display: 'flex', p: 3, justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography component="h1" variant="h1">Holdings</Typography>
                <IconButton onClick={()=>{navigate('/portfolio');}} sx={{border: 'solid 1px #ffffff'}}>
                    <IconArrowBackUp size={30} stroke={1}/>
                </IconButton>
              </Box>
              <Chart options={lineOption} series={lineSeries} type="line" />
            </Paper>
          </Block>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Stack>
            <Box sx={{p: 2, borderBottom: 'solid 1px #202020'}}>
              <Paper sx={{p: 2}}>
                <Chart options={donutOption} series={donutSeries} type="donut" />
              </Paper>
            </Box>
            <Box sx={{p: 2}}>
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
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PortfolioGraph;