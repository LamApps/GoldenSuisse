import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App';
import reportWebVitals from './reportWebVitals';

import { SocketProvider } from './utils/context/socketContext';


// style + assets
import 'assets/scss/style.scss';


const container = document.getElementById('root');
const root = createRoot(container);

const persistor = persistStore(store, {}, function () {
  persistor.persist()
})

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <BrowserRouter>
            <SocketProvider>
              <App />
            </SocketProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
