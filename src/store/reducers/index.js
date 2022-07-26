// reducer import
import customizationReducer from './customizationReducer';
import calendarReducer from './calendar';
import clientsReducer from './clients';
import chatReducer from './chat';
import usersReducer from './user';
import useJwt from 'utils/jwt/useJwt';

const config = useJwt.jwtConfig;

// ==============================|| COMBINE REDUCER ||============================== //
// **  Initial State
const initialState = {
    userData: JSON.parse(localStorage.getItem('userData')) || {},
    [config.storageTokenKeyName]: localStorage.getItem(config.storageTokenKeyName) || "",
    [config.storageRefreshTokenKeyName]: localStorage.getItem(config.storageRefreshTokenKeyName) || "",
  }
  
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
        return {
            ...state,
            userData: action.data,
            [action.config.storageTokenKeyName]: action[action.config.storageTokenKeyName],
            [action.config.storageRefreshTokenKeyName]: action[action.config.storageRefreshTokenKeyName]
        }
        case 'LOGOUT':
        const obj = { ...action }
        delete obj.type
        return { ...state, userData: {}, ...obj }
        default:
        return state
    }
}

const reducer = {
    customization: customizationReducer,
    auth: authReducer,
    calendar: calendarReducer,
    clients: clientsReducer,
    chat: chatReducer,
    users: usersReducer,
};



export default reducer;
