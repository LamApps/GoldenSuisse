import {useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useJwt from 'utils/jwt/useJwt';
import { Box, Drawer, Paper, Button, FormControl, Select, MenuItem, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import {
  fetchEvents,
  selectEvent,
  updateEvent,
  updateFilter,
  updateAllFilters,
  addEvent,
  removeEvent
} from 'store/actions/calendar';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { dateStartTime } from 'utils/common'

import { IconFilter, IconCalendarPlus } from '@tabler/icons';

import EventDetail from './EventDetail';
import Filter from './Filter';

import './style.scss';

// ** CalendarColors
const calendarsColor = {
  Business: 'primary',
  Holiday: 'success',
  Personal: 'danger',
  Family: 'warning',
  ETC: 'info'
}
  // ** Blank Event Object
  const blankEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
      calendar: '',
      guests: [],
      location: '',
      description: ''
    }
  }

//Main Component
const Calendar = props => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.calendar)
  const calendarRef = useRef(null);

  const formattedEvents = () => {
    let result = [];
    for (let event of store.events) {
      let allDay = event.all_day == 1
      let diff = allDay ? (new Date()).getTimezoneOffset() * 60 * 1000 : 0
      let startTime = new Date(+event.start * 1000 + diff)

      result.push({
        id: event.id,
        title: event.title,
        start: startTime,
        end: allDay ? startTime : new Date(+event.end * 1000),
        allDay,
        url: '',
        extendedProps: {
          event_id: event.id,
          calendar: event.calendar,
          client_id: event.client_id,
          created_by: event.created_by,
          guests: [],
          location: '',
          description: event.description
        }
      })
    }
    return result;
  }
  useEffect(() => {
    //console.log('store.selectedCalendars', store.selectedCalendars)
    dispatch(fetchEvents(store.selectedCalendars))
  }, [])

  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState({
    text: '',
    type: 'error',
  });

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleAddEventSidebar = () => setRightOpen(!rightOpen)
  const handleFilterSidebar = () => setLeftOpen(!leftOpen)

  const calendarOptions = {
    events: formattedEvents(),
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: "title prev,next",
      center: "viewOptionButtun,createEventButton",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
    },
    height: 'calc( 100vh - 148px )',
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `event-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }) {
      const tempObj = {...blankEvent};
      tempObj.allDay = clickedEvent.allDay;
      tempObj.end = clickedEvent.end;
      tempObj.extendedProps = {...clickedEvent.extendedProps};
      tempObj.start = clickedEvent.start;
      tempObj.title = clickedEvent.title;
      tempObj.url = clickedEvent.url;
      tempObj.id = clickedEvent.id;
      dispatch(selectEvent(JSON.stringify(tempObj)))
      handleAddEventSidebar()

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      createEventButton: {
        text: <Box sx={{display: 'flex', alignItems: 'center', p:'4px'}}><IconCalendarPlus size={20} stroke={2} /> <Typography sx={{mb: 0, ml: 1}}> New Event</Typography></Box>,
        click() {
          dispatch(selectEvent(JSON.stringify(blankEvent)))
          handleAddEventSidebar()
        }
      },
      viewOptionButtun: {
        text: <Box sx={{display: 'flex', alignItems: 'center'}}><IconFilter size={20} stroke={2} /> <Typography sx={{mb: 0, ml: 1}}> View Option</Typography></Box>,
        click() {
          handleFilterSidebar()
        }
      }
    },

    dateClick(info) {
      const ev = blankEvent
      ev.start = info.date
      ev.end = info.date
      ev.extendedProps.calendar = 'Personal'
      dispatch(selectEvent(JSON.stringify(ev)))
      handleAddEventSidebar()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      console.log(droppedEvent)
      const allDay = droppedEvent.allDay;
      const startTime = allDay? dateStartTime(droppedEvent.start.getTime())/1000 : droppedEvent.start.getTime()/1000
      const endTime = allDay? startTime + 86400 : droppedEvent.end.getTime()/1000

      const eventToUpdate = {
        id: droppedEvent.id,
        title: droppedEvent.title,
        all_day: allDay ? 1 : 0,
        start: startTime,
        end: endTime,
        calendar: droppedEvent.extendedProps.calendar,
        description: droppedEvent.extendedProps.description,
      }
      useJwt
      .updateEvent(eventToUpdate) 
      .then( res => {
        if (res.data.ResponseCode == 0) {
          setSnackBarMsg({
            text: 'Event Updated',
            type: 'success'
          })
          setSnackBarOpen(true);
          dispatch(updateEvent(res.data.ResponseResult))
          
        } else {
          setSnackBarMsg({
            text: res.data.ResponseMessage,
            type: 'error'
          })
          setSnackBarOpen(true);
        }
      })
      .catch(err => {
        console.log(err)
        setSnackBarMsg({
          text: 'Network error',
          type: 'error'
        })
        setSnackBarOpen(true);
      })

    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      // dispatch(updateEvent(resizedEvent))

    },

    ref: calendarRef,
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Paper sx={{p: 3}}>
        <FullCalendar
          {...calendarOptions}
        />
      </Paper>
      <Drawer
        anchor="right"
        open={rightOpen}
        onClose={()=>{setRightOpen(false)}}
      >
        <EventDetail
          store={store}
          dispatch={dispatch}
          handleAddEventSidebar={handleAddEventSidebar}
          addEvent={addEvent}
          updateEvent={updateEvent}
          removeEvent={removeEvent}
          setSnackBarOpen={setSnackBarOpen}
          setSnackBarMsg={setSnackBarMsg}
         />
      </Drawer>
      <Drawer
        anchor="left"
        open={leftOpen}
        onClose={()=>{setLeftOpen(false)}}
      >
        <Filter
          store={store}
          dispatch={dispatch}
          handleFilterSidebar={handleFilterSidebar}
          updateFilter={updateFilter}
          updateAllFilters={updateAllFilters}
        />
      </Drawer>
      <Snackbar
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackBarClose} severity={snackBarMsg.type} sx={{ width: '100%' }}>
            {snackBarMsg.text}
          </Alert>
      </Snackbar>
    </Box>

  )
}

export default Calendar;