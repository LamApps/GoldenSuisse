// ** Initial State
const initialState = {
    query: '',
    unreadMessages: []
  }
  
  const navbarReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'HANDLE_SEARCH_QUERY':
        return { ...state, query: action.val }
  
      case 'SET_UNREAD_MESSAGES':
        return { ...state, unreadMessages: action.data }
  
      case 'ADD_UNREAD_MESSAGE':
        const message = action.data;
        const um = [...state.unreadMessages];
        let exist = false;
        for (let clientMessage of um) {
          if (clientMessage.messages.length > 0 && clientMessage.messages[0].room_id == message.room_id) {
            clientMessage.messages.push(message);
            exist = true;
          }
        }
        if (!exist) {
          let client = message.client;
          client['messages'] = [message];
          um.push(client);
        }
        //console.log('um', um);
        return { ...state, unreadMessages: um }
  
      case 'NOTICE_SELECTED_CHAT_ROOM_ID':
        const room_id = action.data;
        const uMessages = [...state.unreadMessages];
        for(let i=0; i<uMessages.length; i++) {
          const item = uMessages[i];
          if (item.messages[0].room_id == room_id) {
            uMessages.splice(i, 1);
            break;
          }
        }
        return { ...state, unreadMessages: uMessages }
  
      default:
        return state
    }
  }
  
  export default navbarReducer
  