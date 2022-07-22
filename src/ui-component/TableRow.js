import {useState} from 'react';

import {
    Box,
    Link,
    LinearProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';



const supStyle = { color: '#585858', fontSize: '10px' };

const BalanceTableRow = ({moneyType, amount, percentage}) => {
    const theme = useTheme();
    // const [isHovering, setHover] = useState(false);
  
    // const onMouseEnterHandler = (event)=>{
    //   setHover(true);
    // }
    // const onMouseLeaveHandler = (event)=>{
    //   setHover(false);
    // }
    // onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}
    const circleStyle = {
      bgcolor: "",
      border: "none",
    };
    const moneyTypeString = moneyType.toLowerCase();
    switch(moneyTypeString) {
      case "gold":
        circleStyle.bgcolor = theme.palette.common.gold;
        break;
      case "goldbar":
          circleStyle.bgcolor = theme.palette.common.goldBar;
          break;
      case "silver":
        circleStyle.bgcolor = theme.palette.common.silver;
        break;
      case "silverbar":
        circleStyle.bgcolor = theme.palette.common.silverBar;
        break;
      default:
        circleStyle.bgcolor = theme.palette.common.black;
        circleStyle.border = 'solid 1px #ffffff';
    }
    return (
      <>
        <Box sx={{display: 'flex', alignItems: 'center', height: '40px', my: '5px'}} >
          <Box sx={{width: '120px', display: { xs: 'none', sm: 'block'}}}>
            <Box sx={{...circleStyle, width: 20, height: 20, borderRadius: '50%'}} />
          </Box>
          <Box sx={{flexGrow: 1}}>{moneyType}</Box>
          <Box sx={{width: '150px'}}>{amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")} <sup style={{...supStyle}}>EUR</sup></Box>
          <Box sx={{width: '120px', display: { xs: 'none', sm: 'block'}}}>{percentage.toFixed(2)} <sup style={{...supStyle}}>%</sup></Box>
          {/* <Box sx={{width: '60px'}}>
            {isHovering && 
              <Link href="#" color="white" underline="none" sx={{ml:1}}>Details</Link>
            }
          </Box> */}
        </Box>
        <LinearProgress variant="determinate" value={percentage} color="inherit" sx={{ "& .MuiLinearProgress-bar": {transition: 'none'}, height: '1px'}} />
      </>
    )
  }

  export default BalanceTableRow;