import useJwt from 'utils/jwt/useJwt'

// ** Handle Bookmarks & Main Search Queries
export const handleSearchQuery = val => dispatch => dispatch({ type: 'HANDLE_SEARCH_QUERY', val })

export const loadUnreadMessages = () => {
  return dispatch => {
    useJwt
    .loadUnreadMessages()
    .then(res => {
      if (res.data.ResponseCode == 0) {
        dispatch({ type: 'SET_UNREAD_MESSAGES', data: res.data.ResponseResult })

      } else if (res.data.ResponseCode == 1000002 || res.data.ResponseCode == 1000003 || res.data.ResponseCode == 1000004) {
        dispatch(handleLogout())
      }
    })
  }
}

export const setUnreadMessages = messages => {
  return dispatch => {
    dispatch({ type: 'SET_UNREAD_MESSAGES', data: messages })
  }
}

export const addNewUnreadMessage = message => {
  return dispatch => {
    dispatch({ type: 'ADD_UNREAD_MESSAGE', data: message })
  }
}
