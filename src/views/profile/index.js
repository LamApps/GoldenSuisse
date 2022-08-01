import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios'

import PropTypes from 'prop-types';

import useJwt from 'utils/jwt/useJwt';
import { isUserLoggedIn } from 'utils/common'

import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';

import { IconUser, IconInfoCircle, IconLock } from '@tabler/icons';

import GeneralTab from './GeneralTab';
import InformationTab from './InformationTab';
import PasswordTab from './PasswordTab';

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

const Profile = () => {
    const store = useSelector(state => state.auth)

    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
        axios.get('/account-setting/data').then(response => {
          setData(response.data)
        })
    
        if (isUserLoggedIn() !== null) {
          setUserData(JSON.parse(localStorage.getItem('userData')))
        }
    }, [store])

    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="advisor edit tabs">
                <Tab icon={<IconUser size={18} stroke={2} />} iconPosition="start" label="General" {...a11yProps(0)} />
                <Tab icon={<IconInfoCircle size={18} stroke={2} />} iconPosition="start" label="Information" {...a11yProps(1)} />
                <Tab icon={<IconLock size={18} stroke={2} />} iconPosition="start" label="Change Password" {...a11yProps(2)} />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            {userData && <GeneralTab data={userData} />}
        </TabPanel>
        <TabPanel value={value} index={1}>
            {userData && <InformationTab data={userData} />}
        </TabPanel>
        <TabPanel value={value} index={2}>
            <PasswordTab />
        </TabPanel>
      </>
        
    )
}

export default Profile;