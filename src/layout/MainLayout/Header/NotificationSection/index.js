import { useState, useRef, useEffect } from 'react';

import defaultAvatar from '../../../../assets/images/users/user-round.svg'
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    CardActions,
    Badge,
    Link,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconBell } from '@tabler/icons';
import { IconMail } from '@tabler/icons';

// notification status options

const ClientAvatar = ({avatar, number, status}) => {
    return (
    <Badge color='primary' badgeContent={number} overlap="circular">
      { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt="Clients" src={avatar} sx={{width: 50, height: 50}}/></Badge> : <Avatar alt="Clients" src={avatar} sx={{width: 50, height: 50}}/> }
    </Badge>
    )
  }
// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggleMail = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.common.black,
                            color: theme.palette.primary.light,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggleMail}
                        color="inherit"
                    >
                        <IconMail stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2} sx={{p:2, width: '320px'}}>
                                        <Grid item xs={12}>
                                            <Typography variant="h4">New Messages</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: '50vh', overflowX: 'hidden' }}
                                            >
                                                    <Stack direction="row" spacing={2} sx={{alignItems: 'flex-start', mt: 1}}>
                                                        <ClientAvatar avatar={defaultAvatar} number={2} status />
                                                        <Box sx={{ml: 2}}>
                                                            <Link href='#' variant='h4' underline="none">Germán Reina Carmona</Link>
                                                            <Typography variant='body1' color={theme.palette.text.dark}>2 unread</Typography>
                                                            <Typography variant='body1' color={theme.palette.text.dark}>20:45 Today</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Divider />
                                                    <Stack direction="row" spacing={2} sx={{alignItems: 'flex-start', mt: 1}}>
                                                        <ClientAvatar avatar={defaultAvatar} number={2} status />
                                                        <Box sx={{ml: 2}}>
                                                            <Link href='#' variant='h4' underline="none">Germán Reina Carmona</Link>
                                                            <Typography variant='body1' color={theme.palette.text.dark}>2 unread</Typography>
                                                            <Typography variant='body1' color={theme.palette.text.dark}>20:45 Today</Typography>
                                                        </Box>
                                                    </Stack>
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                                        <Button size="small">
                                            Read All Messages
                                        </Button>
                                    </CardActions>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            <Box
                sx={{
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.common.black,
                            color: theme.palette.primary.light,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        ref={anchorRef}
                        // aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <IconBell stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
        </>
    );
};

export default NotificationSection;
