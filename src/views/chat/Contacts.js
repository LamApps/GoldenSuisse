import {useState, useEffect } from 'react';

import {
    Box,
    Stack,
    Paper,
    Button,
    FormControl,
    Typography,
    Divider,
    Link,
    Badge,
    Avatar,
    IconButton,
    InputLabel,
    InputAdornment,
    OutlinedInput,
  } from '@mui/material';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { selectChat } from 'store/actions/chat';

import Block from 'ui-component/Block';
import defaultAvatar from '../../assets/images/users/default_avatar.png';
import { IconSearch, IconPlus, IconClock } from '@tabler/icons';
import { styled, useTheme } from '@mui/material/styles';

import { formatDateToMonthShort } from 'utils/common';

const CircleButton = styled(Button)(({ theme }) => ({
    borderRadius: '50%',
    minWidth: '50px',
    height: '50px',
    color: theme.palette.common.black,
    backgroundColor: '#FBC34A',
    border: 'solid 1px #FBC34A',
    '&:hover': {
      backgroundColor: 'inherit',
      color: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,
    },
  }));

const ClientAvatar = ({avatar, name, number, status, size}) => {
    return (
    <Badge color='primary' badgeContent={number} overlap="circular">
      { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt={name} src={avatar} sx={{bgcolor: '#000000', width: size, height: size}}/></Badge> : <Avatar alt={name} src={avatar} sx={{bgcolor: '#000000', width: size, height: size}}/> }
    </Badge>
    )
}
const Contacts = ({store}) => {
    const theme = useTheme();
    const [active, setActive] = useState({})
    const [query, setQuery] = useState('')
    const [filteredChat, setFilteredChat] = useState([])

    const { chats, selectedChat } = store
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedChat && selectedChat.room) {
          setActive({ type: 'chat', id: selectedChat.room.id })
        }
      }, [chats, selectedChat])

      // ** Handles User Chat Click
    const handleUserClick = (type, chat) => {
        dispatch(selectChat(chat))
        setActive({ type, id: chat.room.id })
    }

      // ** Renders Chat
    const renderChats = () => {
        if (chats && chats.length) {
            if (query.length && !filteredChat.length) {
                return (
                <Typography>No Results Found</Typography>
                )
            } else {
                const arrToMap = query.length && filteredChat.length ? filteredChat : chats

                return arrToMap.map(item => {
                    //if (!item.chat.lastMessage) return null;
                    let time = '';
                    if (item.chat.lastMessage) {
                        time = formatDateToMonthShort(item.chat.lastMessage ? +item.chat.lastMessage.created_at : (new Date()).getTime())
                    }          

                    return (
                        <Box key={item.room.id} sx={{display: 'flex', alignItems: 'flex-start', p:1, borderRadius: '5px', background: active.type === 'chat' && active.id === item.room.id?theme.palette.primary.main:'inherit'}}>
                            <ClientAvatar avatar={item.room.client_photo ? item.room.client_photo: defaultAvatar} number={item.chat.unseenMsgs} status={item.room.status} name={item.room.client_name} />
                            <Box sx={{ml: 2}}>
                                {active.type === 'chat' && active.id === item.room.id?<Typography variant='h4' color={theme.palette.text.black}>{item.room.client_name}</Typography>:<Link href='#' variant='h4' underline="none" onClick={() => handleUserClick('chat', item)}>{item.room.client_name}</Link>}
                                <Typography variant='body1' color={active.type === 'chat' && active.id === item.room.id?theme.palette.text.black:theme.palette.text.dark}>{item.chat.lastMessage ? item.chat.lastMessage.message : chats[chats.length - 1].message}</Typography>
                                {time !== '' && <Box sx={{mt:1}}><IconClock size={14} stroke={1} color={active.type === 'chat' && active.id === item.room.id?theme.palette.text.black:theme.palette.text.dark} /> <Typography variant='span' color={active.type === 'chat' && active.id === item.room.id?theme.palette.text.black:theme.palette.text.dark} sx={{verticalAlign: 'text-bottom'}}>{time}</Typography></Box>}
                            </Box>
                        </Box>
                    )
                })
            }
        } else {
            return <Typography>No Contacts</Typography>
        }
    }

      // ** Handles Filter
    const handleFilter = e => {
        setQuery(e.target.value)
        const searchFilterFunction = chat => chat.room.client_name.toLowerCase().includes(e.target.value.toLowerCase())
        const filteredChatsArr = chats.filter(searchFilterFunction)
        setFilteredChat([...filteredChatsArr])
    }
    return (
        <Block sx={{ p: 0, height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 67px)'}}}>
            <Box sx={{p:3, borderBottom: 'solid 1px #202020', display: 'flex', justifyContent: 'space-between'}}>
            <FormControl fullWidth variant="outlined" sx={{mr: 1}}>
                <InputLabel sx={{color: 'white'}} htmlFor="search-box">Search</InputLabel>
                <OutlinedInput
                id="search-box"
                sx={{color:'white'}}
                value={query}
                onChange={handleFilter}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="search icon"
                        edge="end"
                    >
                        <IconSearch />
                    </IconButton>
                    </InputAdornment>
                }
                label="Search"
                />
            </FormControl>
            {/* <CircleButton onClick={handleAddClick}>
                <IconPlus size={30} stroke={1}/>
            </CircleButton> */}
            </Box>
            <Box sx={{p: 3}}>
                <Paper sx={{p: 3}}>
                    <Stack direction="column" spacing={1} divider={<Divider />}>
                        {renderChats()}
                    </Stack>
                </Paper>
            </Box>
        </Block>
    )
}

export default Contacts;