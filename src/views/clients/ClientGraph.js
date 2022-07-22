import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Chart from 'react-apexcharts';
import { IconArrowBackUp } from '@tabler/icons';

const ClientGraph = props => {
  const navigate = useNavigate();

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
  const [lineSeries, setLineSeries] = useState([{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }]);
  return (
    <Paper sx={{height: '100%'}}>
      <Box sx={{display: 'flex', p: 3, justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography component="h1" variant="h1">Holdings</Typography>
        <IconButton onClick={()=>{navigate(-1);}} sx={{border: 'solid 1px #ffffff'}}>
            <IconArrowBackUp size={30} stroke={1}/>
        </IconButton>
      </Box>
      <Chart options={lineOption} series={lineSeries} type="line" />
    </Paper>
  )
}

export default ClientGraph;