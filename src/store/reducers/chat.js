import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = {
  chats: [],
  selectChatRoomID: '',
  selectedChat: {}
}

const persistConfig = {
  key: 'chat',
  storage,
  whitelist: ['chats', 'selectedChat'], // place to select which state you want to persist
}

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_CHAT_ROOM_ID':
      console.log(action.data)
      return { ...state, selectChatRoomID: action.data }

    case 'GET_CHAT_CONTACTS':
      return { ...state, chats: action.data }

    case 'SELECT_CHAT':
      return { ...state, selectedChat: action.data }
      
    case 'CLEAR_CHAT':
      const selectedChat = {...action.data}
      selectedChat.messages = []
      return { ...state, selectedChat: selectedChat }
      
    case 'SEND_MSG':
      // ** Add new msg to chat
      const newMsg = action.data.response.chat
      return { ...state, selectedChat: { ...state.selectedChat, chat: newMsg }}

    default:
      return state
  }
}

export default persistReducer(persistConfig, chatReducer);
