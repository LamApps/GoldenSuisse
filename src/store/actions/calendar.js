import useJwt from 'utils/jwt/useJwt';

// ** Fetch Events
export const fetchEvents = calendars => {
  return dispatch => {
    if (calendars.length == 0) {
      dispatch({
        type: 'FETCH_EVENTS',
        events: []
      })
    } else {
      useJwt
      .fetchEvents({params: calendars}) 
      .then(res => {
        if (res.data.ResponseCode == 0) {
          dispatch({
            type: 'FETCH_EVENTS',
            events: res.data.ResponseResult
          })
  
        } else {
          console.log(res)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}

// ** Add Event
export const addEvent = event => {
  return dispatch => {
    dispatch({
      type: 'ADD_EVENT', 
      data: event
    })
  }
}

// ** Update Event
export const updateEvent = event => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_EVENT',
      data: event
    })
  }
}

// ** Filter Events
export const updateFilter = filter => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_FILTERS',
      filter
    })
    dispatch(fetchEvents(getState().calendar.selectedCalendars))
  }
}

// ** Add/Remove All Filters
export const updateAllFilters = value => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ALL_FILTERS',
      value
    })
    dispatch(fetchEvents(getState().calendar.selectedCalendars))
  }
}

// ** remove Event
export const removeEvent = id => {
  return dispatch => {
    dispatch({
      type: 'REMOVE_EVENT',
      data: id
    })
  }
}

// ** Select Event (get event data on click)
export const selectEvent = event => {
  return dispatch => {
    dispatch({
      type: 'SELECT_EVENT',
      event
    })
  }
}
