import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useJwt from 'utils/jwt/useJwt';

import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';

import { IconCurrencyDollar } from '@tabler/icons';

import BpsFees from './BpsFees';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {value === index && (
        <Box sx={{ p: 3 }}>
            {children}
        </Box>
        )}
    </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Settings = () => {
    const [data, setData] = useState(null);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
        useJwt
          .loadSettingsInfo()
          .then(res => {
            if (res.data.ResponseCode == 0) {
              setData(res.data.ResponseResult);
    
            } else {
              console.log(res.data.ResponseCode)
            }
          })
          .catch(err => console.log(err))
    }, [])

    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="advisor edit tabs">
                <Tab icon={<IconCurrencyDollar size={18} stroke={2} />} iconPosition="start" label="BPS Fees" {...a11yProps(0)} />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            {data && <BpsFees data={data} />}
        </TabPanel>
      </>
        
    )
}

export default Settings;