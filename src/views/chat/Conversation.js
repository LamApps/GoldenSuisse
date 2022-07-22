import {useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import useJwt from 'utils/jwt/useJwt';
import { formatChatDate, formatChatTime } from 'utils/common';

import {
    Box,
    Grid,
    Paper,
    Button,
    FormControl,
    Typography,
    Badge,
    Avatar,
    InputLabel,
    OutlinedInput,
    Dialog,
    DialogActions,
    DialogTitle
  } from '@mui/material';

import defaultAvatar from '../../assets/images/users/default_avatar.png';
import { styled, useTheme } from '@mui/material/styles';
import { IconSend, IconClock } from '@tabler/icons';

import { clearChat } from 'store/actions/chat'

const CircleButton1 = styled(Button)(({ theme }) => ({
    borderRadius: '50%',
    minWidth: '45px',
    height: '45px',
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.dark[900],
    '&:hover': {
      backgroundColor: '#FBC34A',
      color: theme.palette.common.black,
    },
  }));

const ClientAvatar = ({avatar, name, number, status, size}) => {
    return (
    <Badge color='primary' badgeContent={number} overlap="circular">
      { status ? <Badge anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} color='success' badgeContent="" variant="dot" sx={{ "& .MuiBadge-dot": { margin: '3px', height: '5px', minWidth: '5px' } }} ><Avatar alt={name} src={avatar} sx={{bgcolor: '#000000', width: size, height: size}}/></Badge> : <Avatar alt={name} src={avatar} sx={{bgcolor: '#000000', width: size, height: size}}/> }
    </Badge>
    )
}  

//Date seperator
const DateSeperator = ({value}) => {
    const theme = useTheme();
    return <Box sx={{display: 'flex', alignItems: 'center', py: 2}}>
      <Box variant="span" sx={{background: theme.palette.dark.main, borderRadius: '15px', padding: '3px 8px'}}>{value}</Box>
      <Box sx={{background: theme.palette.dark.main, flexGrow: 1, height: '1px'}}/>
    </Box>
  }
  //Time seperator
  const TimeSeperator = ({right, content})=> {
    const theme = useTheme();
    return <Box sx={{my:1, textAlign: right?'right':'left'}}><IconClock size={14} stroke={1} color={theme.palette.text.dark} /> <Typography variant='span' color={theme.palette.text.dark} sx={{verticalAlign: 'text-bottom'}}>{content}</Typography></Box>;
  }
  //ChatTextLine
  const ChatTextLine = ({right, content})=> {
    return right? <Box sx={{display: 'flex', justifyContent: 'flex-end', pl: '20%'}}><Typography variant="body1">{content}</Typography></Box>:<Typography variant="body1" sx={{mr: '20%'}}>{content}</Typography>;
  }

const Conversation = ({store, handleUser, opponentTyping, scrollToBottom, socketSendTyping, socketSendMessage, socketOpenMessage}) => {
    const { selectedChat } = store;
    const navigate = useNavigate();
    const [messages, setMessages] = useState([])
    const [isTyping, setIsTyping] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false);

      // ** Refs & Dispatch
    const chatArea = useRef(null)
    const dispatch = useDispatch()

    const [msg, setMsg] = useState('')

    // ** Scroll to chat bottom
    const actionScrollToBottom = () => {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current)
        if (chatContainer) 
        //chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

      // ** If user chat is not empty scrollToBottom
    useEffect(() => {
        setMessages(selectedChat.messages)
        if (selectedChat.messages && selectedChat.messages.length > 0) {
        let messageIDs = [];
        selectedChat.messages.forEach(message => {
            if (message.user_id != useJwt.getUserID() && message.seen_status != 1) {
            messageIDs.push(message.id);
            }
        });
        if (messageIDs.length > 0)
            socketOpenMessage(messageIDs)
        }

        if (selectedChat.room && selectedChat.room.id) 
        dispatch({type: 'NOTICE_SELECTED_CHAT_ROOM_ID', data: selectedChat.room.id})
        
        setTimeout(() => {
        actionScrollToBottom();
        }, 50);
    }, [selectedChat, scrollToBottom])

    const formattedChatData = () => {
        var formattedChatLog = [];
        if (!messages || messages.length == 0) return [];
        var chatLog = [...messages];
        chatLog = chatLog.sort((a,b) => (a.id > b.id) ? 1 : ((a.id < b.id) ? -1 : 0))
        
        var msgGroup = {
          sentDate: formatChatDate(+chatLog[0].created_at), // for date divide,
          senderId: chatLog[0].user_id,
          sentTime: chatLog[0].created_at, // for checking 1 mins delay = diff: 60 * 1000,
          messages: [chatLog[0]]
        }
        if (chatLog.length == 1) {
          formattedChatLog.push(msgGroup);
        }
    
        for (let i=1; i<chatLog.length; i++) {
          let msg = chatLog[i];
    
          if (formatChatDate(+msg.created_at) == msgGroup.sentDate && msgGroup.senderId === msg.user_id && 
              parseInt(msg.created_at) - parseInt(msgGroup.sentTime) < 60 * 1000) {
            msgGroup.messages.push(msg);
    
          } else {
            formattedChatLog.push(msgGroup)
    
            msgGroup = {
              sentDate: formatChatDate(+msg.created_at),
              senderId: msg.user_id,
              sentTime: msg.created_at,
              messages: [msg]
            }
          }
    
          if (i == chatLog.length -1 ) {
            formattedChatLog.push(msgGroup)
          }
        }
    
        // formattedChatLog = formattedChatLog.sort((a,b) => (a.sentTime > b.sentTime) ? 1 : ((a.sentTime < b.sentTime) ? -1 : 0))
        // console.log('formattedChatLog', formattedChatLog);
        return formattedChatLog
      }
      // ** Renders user chat
    const renderChats = () => {
        const formattedChatLog = formattedChatData()
        if (formattedChatLog.length == 0) return (<div></div>);

        let firstDate = '';

        return formattedChatLog.map((item, index) => {
            const showDateDivider = firstDate != item.sentDate
            firstDate = item.sentDate
            return (
                <Box key={index}>
                    {showDateDivider && <DateSeperator value={item.sentDate} />}
                    <TimeSeperator content={formatChatTime(+item.sentTime)} right={item.senderId == useJwt.getUserID()}/>
                    {item.messages.map(message => (
                        <ChatTextLine key={message.id} content={message.message} right={item.senderId == useJwt.getUserID()}/>
                    ))}
                </Box>
            )
        })
    }

      // ** Sends New Msg
    const handleSendMsg = e => {
        e.preventDefault()
        if (msg.length) {
            socketSendMessage(selectedChat.room.id, 1, msg);
            
            setMsg('')
            socketSendTyping(selectedChat.room.id, 0)
            setIsTyping(false)
        }
    }

    const handleDialogClickOpen = () => {
      setDialogOpen(true);
    };
  
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleConfirmClear = () => {
      setDialogOpen(false);
      console.log('clearing room id', selectedChat.room.id);
  
      useJwt
      .clearRoomMessages(selectedChat.room.id)
      .then(res => {
        if (res.data.ResponseCode == 0) {
          dispatch(clearChat(selectedChat))
   
        } else {
          if (res.data.ResponseCode == 1000004) {
            navigate(`/login`);
          }
        }
      })
      .catch(err => console.log(err))
    }

    const loadClientInformation = () => {
      useJwt
        .loadClientInformation(selectedChat.room.client_id)
        .then(res => {
          if (res.data.ResponseCode == 0) {
            navigate('/client/details/profile/'+res.data.ResponseResult.id)
  
          } else {
            console.log(res.data.ResponseCode)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    return (
        Object.keys(selectedChat).length ? (
          <>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width:'100%', height: {xs: 'auto', sm: 'auto', md: '100%'}}}>
              <Grid container>
              <Grid item xs={12} sm={12} md={6}>
                  <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                  <ClientAvatar avatar={selectedChat.room.client_photo || defaultAvatar} status={selectedChat.room.status === 1} size={60} />
                  <Box sx={{ml: 3}}>
                      <Typography variant='h3'>{selectedChat.room.client_name}</Typography>
                      <Typography>{selectedChat.messages.length} messages</Typography>
                  </Box>
                  </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                  <Paper sx={{p:2, display:'flex', justifyContent: 'space-around', mb: 2}}>
                      <Button variant="outlined" onClick={()=>{loadClientInformation()}}>PROFILE</Button>
                      <Button variant="outlined" onClick={handleDialogClickOpen}>CLEAR</Button>
                  </Paper>
              </Grid>
              </Grid>
              <Paper sx={{height: 'calc( 100vh - 281px)', p:3, overflowY: 'auto'}} ref={chatArea}>
                  {renderChats()}
              </Paper>
              <form  onSubmit={e => handleSendMsg(e)}>
                  <Box sx={{pt:2, display: 'flex', justifyContent: 'space-between'}}>
                      <FormControl fullWidth variant="outlined" sx={{mr: 1}}>
                          <InputLabel sx={{color: 'white'}} htmlFor="message-box">Type your message</InputLabel>
                          <OutlinedInput
                          id="message-box"
                          value={msg}
                          onChange={e => {
                              setMsg(e.target.value);
                              if (e.target.value.length > 0 && !isTyping) {
                              setIsTyping(true)
                              socketSendTyping(selectedChat.room.id, 1);
                              } else if (e.target.value.length == 0 && isTyping) {
                              setIsTyping(false)
                              socketSendTyping(selectedChat.room.id, 0);
                              }
                          }}
                          sx={{color:'white'}}
                          label="Type your message"
                          />
                      </FormControl>
                      {/* <CircleButton1 sx={{mr: 1}}>
                          <IconPaperclip size={25} stroke={1}/>
                      </CircleButton1> */}
                      <CircleButton1 type="submit">
                          <IconSend size={25} stroke={1}/>
                      </CircleButton1>
                  </Box>
              </form>
            </Box>
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Are you sure want to clear all the chat history?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={()=>{handleConfirmClear()}} autoFocus>
                    OK
                </Button>
                </DialogActions>
            </Dialog>
          </>
        ) : <Typography variant='body2'>Select a conversation or Create a New one</Typography>
    )
}

export default Conversation;