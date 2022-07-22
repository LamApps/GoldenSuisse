import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2, IconRefresh } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 258,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', lg: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.common.black,
                            color: theme.palette.primary.light,
                            '&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography component="p" variant="p" textAlign={'center'}>Wealth Management System</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems:'center', justifyContent:'flex-end' }} >
                <Typography component="p" variant="p" color={theme.palette.grey[900]}>Updated 20 Feb 2022, 14:40</Typography>
                <ButtonBase sx={{ marginLeft: '10px', borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.common.black,
                            color: theme.palette.primary.light,
                            '&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        color="inherit"
                    >
                        <IconRefresh stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* notification & profile */}
            <NotificationSection />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
