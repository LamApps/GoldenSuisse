import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedUser: null,
  balances: [],
}

const persistConfig = {
  key: 'clients',
  storage,
  whitelist: ['allData', 'data', 'params', 'total', 'selectedUser'], // place to select which state you want to persist
}

const users = (state = initialState, action) => {
  let allData, data;
  switch (action.type) {
    case 'GET_CONNECTION':
      return {
        ...state,
        allData: action.allData,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }

    case 'GET_CLIENT':
      const userID = action.data;
      let selectedUser = null;
      if (Array.isArray(state.allData) && state.allData.length > 0) {
        for (let user of state.allData) {
          if (user.id == userID) {
            selectedUser = user
          }
        }
      }
      return { ...state, selectedUser }

    case 'UPDATE_CLIENT':
      allData = [...state.allData];
      for (let i = 0; i < allData.length; i++) {
        const user = allData[i];
        if (user.id == action.data.id) {
          allData[i] = action.data;
          break;
        }
      }
      data = [...state.data];
      for (let i = 0; i < data.length; i++) {
        const user = data[i];
        if (user.id == action.data.id) {
          data[i] = action.data;
          break;
        }
      }
      return { ...state, allData, data, selectedUser: action.data }

    case 'ADD_CONNECTION':
      const newClient = action.data;
      
      allData = [...state.allData];
      allData.push(newClient);
      data = [...state.data];
      data.push(newClient);
      const total = state.total + 1;

      return { ...state, allData, data, total }

    case 'DELETE_CONNECTION':
      const clientID = action.data;
      for (let i = 0; i < state.data.length; i++) {
        let user = state.data[i]
        if (user.id == clientID) {
          state.data.splice(i, 1);
        }
      }
      for (let i = 0; i < state.allData.length; i++) {
        let user = state.allData[i]
        if (user.id == clientID) {
          state.total--;
          state.allData.splice(i, 1);
        }
      }
      // console.log('data', state.data)
      // console.log('allData', state.allData)
      return { ...state }

    case 'SET_BALANCES':
      return { ...state, balances: action.data }

    default:
      return { ...state }
  }
}
export default persistReducer(persistConfig, users)
