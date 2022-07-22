import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import { drawerWidth } from 'store/constant';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme();
    const userData = useSelector(state => state.auth.userData);
    const matchUpMd = useMediaQuery(theme.breakpoints.up('lg'));
    // useEffect(()=>{
    //     setUserData(store.userData)
    // }, [store])

    const drawer = (
        <>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Box>
            </Box>
            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        height: !matchUpMd ? 'calc(100vh - 90px)' : 'calc(100vh - 94px)',
                        margin: '16px',
                        background: '#101010',
                        borderRadius: '15px',
                        padding: '15px'
                    }}
                >
                    <Box>
                        <Typography color={theme.palette.text.disabled} sx={{fontSize: 12}}>{userData?.gender?.indexOf("female")>-1?'Ms.':'Mr.'}</Typography>
                        <Typography sx={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingBottom: '20px', borderBottom: 'solid 1px #585858'}}>{userData?.fullName}</Typography>
                        <Typography color={theme.palette.text.disabled} sx={{fontSize: 12, textAlign: 'right', mt: '10px', mb: '20px'}}>Acc. {userData?.customer_id}</Typography>
                    </Box>
                    <MenuList />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <MenuList />
                </Box>
            </MobileView>
        </>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: (drawerOpen && matchUpMd) ? drawerWidth : 0 }} aria-label="mailbox folders">
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: '1px solid #202020',
                        [theme.breakpoints.up('md')]: {
                            top: '67px'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
};

export default Sidebar;
