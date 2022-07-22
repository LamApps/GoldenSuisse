import useJwt from 'utils/jwt/useJwt'

// ** Get data on page or row change
export const getData = params => {
  return async dispatch => {
    useJwt
      .searchClients({params})
      .then(res => {
        if (res.data.ResponseCode == 0) {
          dispatch({
            type: 'GET_CONNECTION',
            allData: res.data.ResponseResult.allData,
            data: res.data.ResponseResult.clients,
            totalPages: res.data.ResponseResult.total,
            params
          })
        } else {
          console.log(res.data.ResponseCode)
        }
      })
      .catch(err => console.log(err))
  }
}

// ** Get Client
export const getClient = id => {
  return async dispatch => {
    dispatch({
      type: 'GET_CLIENT',
      data: id
    })
  }
}

export const updateClient = client => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_CLIENT',
      data: client
    })
  }
}

export const addConnection = newClient => {
  return (dispatch, getStore) => {
    dispatch({
      type: 'ADD_CONNECTION',
      data: newClient
    })
  }
}

// ** Delete Invoice
export const removeConnection = (client_id) => {
  return (dispatch, getStore) => {
    dispatch({
      type: 'DELETE_CONNECTION',
      data: client_id
    })
  }
}

export const setClientBalances = (balances) => {
  return (dispatch, getStore) => {
    dispatch({
      type: 'SET_BALANCES',
      data: balances
    })
  }
}