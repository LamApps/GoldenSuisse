import {useState, useEffect, useCallback, useContext, createRef, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SocketContext } from 'utils/context/socketContext';

import { getChatContacts, selectChat } from 'store/actions/chat'

import useJwt from 'utils/jwt/useJwt'

import { styled, useTheme } from '@mui/material/styles';

import {
  Box,
  Grid,
  Stack,
  Paper,
  FormControl,
  Button,
  Typography,
  Divider,
  Badge,
  Avatar,
  IconButton,
  Tooltip,
  InputLabel,
  InputAdornment,
  OutlinedInput
} from '@mui/material';

import { randomString, nowSecs } from 'utils/common'

import { IconSearch, IconArrowBackUp, IconCirclePlus } from '@tabler/icons';

import Contacts from './Contacts';
import Conversation from './Conversation';

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


const ClientAvatar = ({avatar, number, status, size}) => {
  return (
  <Badge color='primary' badgeContent={number} overlap="circular">
    { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt="Clients" src={avatar} sx={{width: size, height: size}}/></Badge> : <Avatar alt="Clients" src={avatar} sx={{width: size, height: size}}/> }
  </Badge>
  )
}
const AlphabetList = ({data, scrollSmoothHandler}) => {
  const dataObj = {};
  data.map((item, i)=>{
    dataObj[item.group] = {
      index: i,
      label: item.group,
      count: item.children.length,
    }
  })
  const theme = useTheme();
  const [activeIndex, setActiveIndex ] = useState('A');

  const onClickHandler = ({index, label}) => {
    setActiveIndex(label);
    scrollSmoothHandler(index);
  }

  return <Stack direction="column" spacing={0.5}>
    {("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('').map((item, index)=>{
      const isExist = dataObj[item] && item===dataObj[item].label;
      return isExist ? <Tooltip title={dataObj[item].count} placement="left" key={item.toLowerCase()}>
        <Box sx={{
        textAlign: 'center',
        background: item===activeIndex?theme.palette.primary.main:'inherit',
        color: item===activeIndex?'black':theme.palette.text.primary,
        width: '20px',
        height: '20px',
        borderRadius: '15px',
        cursor: 'pointer',
      }} onClick={()=> onClickHandler(dataObj[item])}>{item}</Box>
      </Tooltip> : <Box sx={{
        textAlign: 'center',
        background: 'inherit',
        color: theme.palette.text.disabled,
        width: '20px',
        height: '20px',
        borderRadius: '15px',
      }} key={item.toLowerCase()}>{item}</Box>;
    })}
  </Stack>
}

const ContactLine = ({avatar, name}) => {
  const theme = useTheme();
  const [isHover, setIsHover] = useState(false);
  const onMouseEnterHandler = () => {
    setIsHover(true);
  }

  const onMouseLeaveHandler = () => {
    setIsHover(false);
  }
  return <Box sx={{display:'flex', alignItems: 'center', background: isHover?theme.palette.primary.main:'inherit', p: 1, borderRadius: '28px'}} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
          <ClientAvatar avatar={avatar} size={40} />
          <Typography sx={{ml: 3, flexGrow: 1}} color={isHover?'black':''}>{name}</Typography>
          {isHover && <IconButton>
          <IconCirclePlus size={20} stroke={1} color="black"/>
        </IconButton>}
        </Box>
}

const AddContactPaper = ({data, handleReturnClick}) => {
  const [filteredData, setFilteredData] = useState(data);
  const scrollRefs = useRef([]);
  scrollRefs.current = [...Array(data.length).keys()].map(
    (_, i) => scrollRefs.current[i] ?? createRef()
  );
  const scrollSmoothHandler = (index) => {
    scrollRefs.current[index].current.scrollIntoView({ behavior: "smooth" });
  };
  const filterHandler = (e) => {
    const keyword = e.target.value.toLowerCase();
    if(keyword==='') setFilteredData(data);
    else{
      setFilteredData(data.reduce((result, item)=>{
        const children = item.children.filter((chd)=>{
          return chd.name.toLowerCase().indexOf(keyword)>-1;
        })
        if(children.length>0) result.push({
          group: item.group,
          children: children
        });
        return result;
      }, []));
    }
  }
  return <Paper sx={{p:3, width: '100%', height: {xs: 'auto', sm: 'auto', md: '100%'}}}>
    <Box sx={{p:3, display: 'flex', justifyContent: 'space-between'}}>
      <FormControl fullWidth variant="outlined" sx={{mr: 1}}>
        <InputLabel sx={{color: 'white'}} htmlFor="search-box">Search</InputLabel>
        <OutlinedInput
          id="search-box"
          sx={{color:'white'}}
          onChange={filterHandler}
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
      <CircleButton onClick={handleReturnClick}>
        <IconArrowBackUp size={30} stroke={1}/>
      </CircleButton>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'space-between', height: 'calc( 100vh - 262px )'}}>
      <Box sx={{ overflow: 'auto', flexGrow: 1, marginRight: '20px', height: '100%' }}>
        <Stack spacing={2} divider={<Divider/>}>
          {
            filteredData.map((item, i)=>(
              <Box key={item.group}>
                <Typography variant='h3' sx={{mb:3}} ref={scrollRefs.current[i]}>{item.group}</Typography>
                <Stack>
                  {
                    item.children.map((contact)=><ContactLine key={contact.id} avatar={contact.avatar} name={contact.name} />)
                  }
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
      <AlphabetList data={filteredData} scrollSmoothHandler={scrollSmoothHandler} />
    </Box>
  </Paper>;
}


//Main Component
const Chat = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.chat);
  const socket = useContext(SocketContext);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const handleReturnClick = ()=>{
    setIsAddOpen(false);
  }

  const [user, setUser] = useState({})

  const [opponentTyping, setOpponentTyping] = useState({})
  const [scrollToBottom, setScrollToBottom] = useState(false)

  const handleUser = obj => setUser(obj)

  // socket listeners
  const handleSocketNewUser = useCallback((newUser) => {
    // user joined
    //console.log('newUser', newUser);
    let onlineStatus = 0;
    if (newUser.token === useJwt.getToken()) {
      if (newUser.already_joined_user_ids) {
        onlineStatus = 1;
      }
    } else if (newUser.user_id !== useJwt.getUserID()) { 
      onlineStatus = 1;
    }

    if (onlineStatus === 1) {
      let chats = [...store.chats];
      let updateChatIndex = -1;
      let chat = {};
      for (let i=0; i<chats.length; i++) {
        let item = chats[i];
        if (item.room.id === newUser.room_id) {
          updateChatIndex = i;
          chat = {...item};
          chat.room.status = 1;
          break;
        }
      }

      if (updateChatIndex > -1) {
        chats[updateChatIndex] = chat;
        dispatch({
          type: 'GET_CHAT_CONTACTS',
          data: chats
        })
      }

      const selectedChat = {...store.selectedChat};
      if (selectedChat && Object.keys(selectedChat).length > 0 ) {
        if (selectedChat.room && selectedChat.room.id === newUser.room_id) {
          let chat = {...selectedChat}
          chat.room.status = 1;
          dispatch(selectChat(chat));
        }
      }
    }
  }, [store]);

  const handleSocketUserLeft = useCallback((userLeft) => {
    // user left
    //console.log('userLeft', userLeft);
    
    if (userLeft.user_id !== useJwt.getUserID()) {
      updateTyping(userLeft.room_id, false);

      let chats = [...store.chats];
      let updateChatIndex = -1;
      let chat = {};
      for (let i=0; i<chats.length; i++) {
        let item = chats[i];
        if (item.room.id === userLeft.room_id) {
          updateChatIndex = i;
          chat = {...item};
          chat.room.status = userLeft.same_accounts > 1 ? 1 : 0;
          break;
        }
      }

      console.log('updateChatIndex', updateChatIndex);
      if (updateChatIndex > -1) {
        chats[updateChatIndex] = chat;
        dispatch({
          type: 'GET_CHAT_CONTACTS',
          data: chats
        })
      }

      const selectedChat = {...store.selectedChat};
      if (selectedChat && Object.keys(selectedChat).length > 0 ) {
        if (selectedChat.room && selectedChat.room.id === userLeft.room_id) {
          let chat = {...selectedChat}
          chat.room.status = userLeft.same_accounts > 1 ? 1 : 0;
          dispatch(selectChat(chat));
        }
      }
    }
  }, [store]);

  const handleSocketTyping = useCallback((typing) => {
    // received typing
    if (typing.user_id !== useJwt.getUserID()) {
      updateTyping(typing.room_id, typing.type === 1)
    }
  }, [scrollToBottom]);
  
  const handleSocketNewMessage = useCallback((message) => {
    //console.log('new message', message);
    addOrUpdateMessages([message]);
  }, [store]);

  const handleSocketUpdateMessage = useCallback((messages) => {
    // updated message
    addOrUpdateMessages(messages);
  }, [store]);

  const handleSocketDeleteMessage = useCallback(() => {
    // deleted message
  }, [store]);

  useEffect(() => {
    // load chat messages
    const selectedChat = {...store.selectedChat};
    // console.log('selectChatRoomID', store.selectChatRoomID)
    dispatch(getChatContacts(selectedChat, store.selectChatRoomID))  
  }, [store.selectChatRoomID])

  useEffect(() => {
    if (socket) {
      // subscribe to socket events
      socket.on("newUser", handleSocketNewUser);
      socket.on("typing", handleSocketTyping);
      socket.on("newMessage", handleSocketNewMessage);
      socket.on("updateMessage", handleSocketUpdateMessage);
      socket.on("deleteMessage", handleSocketDeleteMessage);
      socket.on("userLeft", handleSocketUserLeft);
    }
    
    return () => {
      // unsubscribe socket events
      socket.off("newUser", handleSocketNewUser);
      socket.off("typing", handleSocketTyping);
      socket.off("newMessage", handleSocketNewMessage);
      socket.off("updateMessage", handleSocketUpdateMessage);
      socket.off("deleteMessage", handleSocketDeleteMessage);
      socket.off("userLeft", handleSocketUserLeft);
    };
  }, [
    socket,
    handleSocketNewUser, 
    handleSocketTyping, 
    handleSocketNewMessage,
    handleSocketUpdateMessage,
    handleSocketDeleteMessage,
    handleSocketUserLeft,    
  ])

  const updateTyping = (room_id, typing) => {
    let ot = {...opponentTyping}
    ot[room_id] = typing;
    setOpponentTyping(ot);
    setScrollToBottom(!scrollToBottom);
  }

  const socketSendTyping = (room_id, typing) => {
    socket.emit("sendTyping", {
      token: useJwt.getToken(),
      room_id: room_id,
      type: typing // 1: typing, 0: stopped typing
    });
  };
  
  const socketSendMessage = (room_id, type, message) => {
    const selectedChat = store.selectedChat;
    if (!selectedChat || !selectedChat.room) return;

    let local_id = randomString();
    let newMessage = {
      id: local_id,
      user_id: useJwt.getUserID(),
      token: useJwt.getToken(),
      room_id: room_id,
      local_id: local_id,
      created_at: nowSecs(),
      type: type, // 1: text, 2: image, 3: file
      message: message
    }

    addOrUpdateMessages([newMessage]);
    socket.emit("sendMessage", newMessage);
  };

  const socketOpenMessage = (message_ids) => {
    socket.emit("openMessage", {
      token: useJwt.getToken(),
      message_ids: message_ids
    });
  };

  const getLatestMessage = (messages) => {
    if (messages.length === 0) return null;
    if (messages.length === 1) return messages[0];

    let result = messages[0];
    for (let i=1; i<messages.length; i++) {
      const item = messages[i];
      if (item.created_at >= result.created_at) {
        result = item;
      }
    }
    return result;
  }

  const calculateUnSeenMessagesCount = (messages) => {
    if (messages.length === 0) return 0;

    let result = 0;
    for (let i=0; i<messages.length; i++) {
      const item = messages[i];
      if (item.seen_status !== 1) {
        result++;
      }
    }
    return result;
  }

  const addOrUpdateMessages = (messages) => {
    if (messages.length == 0) return;

    let chats = [...store.chats];
    let updatedChatIndex = -1;
    let chat = {};
    for (let i=0; i<chats.length; i++) {
      let item = chats[i];
      if (item.room.id == messages[0].room_id) { // messages are coming from same room
        updatedChatIndex = i;
        chat = {room: {...item.room}, messages: [...item.messages], chat: {...item.chat, lastMessage: getLatestMessage(messages)}};

        for (let k=0; k<messages.length; k++) {
          let km = messages[k];
          let isNew = true;

          for (let j=0; j<chat.messages.length; j++) {
            let im = chat.messages[j];
            if (im.local_id == km.local_id) {
              isNew = false;
              chat.messages[j] = km;
              break;
            }
          }

          if (isNew) { 
            chat.messages.push(km); 
          }
        }

        chat.chat.unseenMsgs = calculateUnSeenMessagesCount(chat.messages);
        break;
      }
    }

    const selectedChat = {...store.selectedChat};
    if (selectedChat && Object.keys(selectedChat).length > 0 ) {
      if (selectedChat.room.id == messages[0].room_id) {
        chat.chat.unseenMsgs = 0;
        dispatch(selectChat(chat))

        if (messages.length == 1 && messages[0].user_id != useJwt.getUserID() && messages[0].seen_status != 1) { 
          // currently coming only one message on this event as the opponent's new message
          socketOpenMessage([messages[0].id]);
        }

        setScrollToBottom(!scrollToBottom);
      }
    }

    if (updatedChatIndex > -1) {
      chats[updatedChatIndex] = chat;
      dispatch({
        type: 'GET_CHAT_CONTACTS',
        data: chats
      })
    }
    
  }

  // const socketDeleteMessage = (message_id) => {
  //   socket.emit("deleteMessage", {
  //     token: useJwt.getToken(),
  //     room_id: room_id,
  //     message_id: message_id
  //   });
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} sm={12} md={4}>
          <Contacts store={store} />
        </Grid>
        <Grid item xs={12} sm={12} md={8} sx={{p:3, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Conversation
              store={store}
              handleUser={handleUser}
              opponentTyping = {store.selectedChat.room && opponentTyping[store.selectedChat.room.id]}
              scrollToBottom = {scrollToBottom}
              socketSendTyping={socketSendTyping}
              socketSendMessage={socketSendMessage}
              socketOpenMessage={socketOpenMessage}
            />
        </Grid>
      </Grid>
    </Box>

  )
}

export default Chat;