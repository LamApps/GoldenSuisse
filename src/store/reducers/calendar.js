// ** Initial State
const initialState = {
    events: [],
    selectedEvent: '',
    selectedCalendars: ['Personal', 'Business', 'Holiday']
  }
  
  const calenderReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_EVENTS':
        return { ...state, events: action.events }
      
      case 'ADD_EVENT':
        let aEvents = [...state.events];
        aEvents.push(action.data);
        return { ...state, events: aEvents }
      
      case 'REMOVE_EVENT':
        const eventID = action.data;
        let rEvents = [...state.events];
        for (let i=0; i<rEvents.length; i++) {
          const item = rEvents[i];
          if (item.id == eventID) {
            rEvents.splice(i, 1);
            break
          }
        }
        return { ...state, events: rEvents }
  
      case 'UPDATE_EVENT':
        const event = action.data;
        let uEvents = [...state.events];
        for (let i=0; i<uEvents.length; i++) {
          const item = uEvents[i];
          if (item.id == event.id) {
            uEvents[i] = event;
            break
          }
        }
        return { ...state, events: uEvents }
  
      case 'UPDATE_FILTERS':
        // ** Updates Filters based on action filter
        if (state.selectedCalendars.includes(action.filter)) {
          const filterdFilter = state.selectedCalendars.filter((item)=>item!==action.filter)
          return {...state, selectedCalendars: [...filterdFilter]}
        } else {
          return {...state, selectedCalendars: [...state.selectedCalendars, action.filter]}
        }
  
      case 'UPDATE_ALL_FILTERS':
        // ** Updates All Filters based on action value
        const value = action.value
        let selected = []
        if (value === true) {
          selected = ['Personal', 'Business', 'Holiday']
        } else {
          selected = []
        }
        return { ...state, selectedCalendars: selected }
  
      case 'SELECT_EVENT':
        return { ...state, selectedEvent: action.event }
  
      default:
        return state
    }
  }
  
  export default calenderReducer
  