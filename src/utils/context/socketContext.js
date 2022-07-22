import socketio from "socket.io-client";
import { createContext } from 'react';
import useJwt from 'utils/jwt/useJwt';

const handleErrors = (err) => {
    console.log('socket error', err);
}

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);
socket.on('connect_error', err => handleErrors(err));
socket.on('connect_failed', err => handleErrors(err));

const SocketContext = createContext();
socket.emit('login', {'token': useJwt.getToken()})

const SocketProvider = ({ children }) => {
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export { SocketContext, SocketProvider };