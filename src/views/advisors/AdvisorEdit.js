import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { getUser } from 'store/actions/user';

import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';

import { IconUser, IconInfoCircle } from '@tabler/icons';

import AccountSettings from './AccountSettings';
import Information from './Information';

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

const AdvisorEdit = () => {
    const store = useSelector(state => state.users),
    dispatch = useDispatch(),
    { id } = useParams()

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

        // ** Function to get user on mount
    useEffect(() => {
        dispatch(getUser(parseInt(id)))
        return () => dispatch(getUser(parseInt(0)))
    }, [dispatch, id])

    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="advisor edit tabs">
                <Tab icon={<IconUser size={18} stroke={2} />} iconPosition="start" label="Account" {...a11yProps(0)} />
                <Tab icon={<IconInfoCircle size={18} stroke={2} />} iconPosition="start" label="Information" {...a11yProps(1)} />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            <AccountSettings selectedUser={store.selectedUser} />
        </TabPanel>
        <TabPanel value={value} index={1}>
            <Information selectedUser={store.selectedUser} />
        </TabPanel>
      </>
        
    )
}

export default AdvisorEdit;