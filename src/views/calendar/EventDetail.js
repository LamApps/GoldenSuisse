import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';

import {
  Box,
  Paper,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  Stack,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { dateStartTime, selectThemeColors, isObjEmpty } from 'utils/common'
import useJwt from 'utils/jwt/useJwt';
import { IconX } from '@tabler/icons';


const EventDetail = (props) => {
    const theme = useTheme();
    const {
        store,
        dispatch,
        open,
        handleAddEventSidebar,
        calendarsColor,
        calendarApi,
        refetchEvents,
        addEvent,
        selectEvent,
        updateEvent,
        removeEvent,
        setSnackBarMsg,
        setSnackBarOpen,
      } = props
    
    const selectedEvent = JSON.parse(store.selectedEvent);


    const [title, setTitle] = useState('')
    const [allDay, setAllDay] = useState(false)
    const [endPicker, setEndPicker] = useState(new Date())
    const [startPicker, setStartPicker] = useState(new Date())
    const [value, setValue] = useState('Business')
    const [desc, setDesc] = useState('')

    const [validation, setValidation] = useState({
      title: true,
      start: true,
      end: true
    })
  
    const [dialogOpen, setDialogOpen] = useState(false);

      // ** Select Options
    const options = [
        // { value: 'Business', label: 'Business', color: 'primary' },
        { value: 'Personal', label: 'Personal', color: 'error' },
        { value: 'Holiday', label: 'Holiday', color: 'success' },
    ]

      // ** Adds New Event
    const handleAddEvent = () => {
        if (!allDay && startPicker.getTime() >= endPicker.getTime()) {
          setSnackBarMsg({
            text: 'End time should be later than start time.',
            type: 'error'
          })
          setSnackBarOpen(true);
          return;
        }

        const startTime = allDay? dateStartTime(startPicker.getTime())/1000 : startPicker.getTime()/1000
        const endTime = allDay? startTime + 86400 : endPicker.getTime()/1000

        const data = {
        title,
        start: startTime,
        end: endTime,
        all_day: allDay ? 1 : 0,
        calendar: value,
        description: desc,
        //url: url.length ? url : undefined,
        //guests: guests.length ? guests : undefined,
        //location: location.length ? location : undefined,
        //desc: desc.length ? desc : undefined
        }
        console.log('new event data', data);
        useJwt
        .addEvent(data)
        .then( res => {
        if (res.data.ResponseCode == 0) {
            setSnackBarMsg({
              text: 'Event Added.',
              type: 'success'
            })
            setSnackBarOpen(true);
            dispatch(addEvent(res.data.ResponseResult))
            handleAddEventSidebar()

        } else {
            setSnackBarMsg({
              text: res.data.ResponseMessage,
              type: 'error'
            })
            setSnackBarOpen(true);
        }
        })
        .catch(err => {
          setSnackBarMsg({
            text: 'Network error',
            type: 'error'
          })
          setSnackBarOpen(true);
        })
    }
    const handleUpdateEvent = () => {
        const startTime = allDay? dateStartTime(startPicker.getTime())/1000 : startPicker.getTime()/1000
        const endTime = allDay? startTime + 86400 : endPicker.getTime()/1000
    
        const eventToUpdate = {
          id: selectedEvent.id,
          title,
          all_day: allDay ? 1 : 0,
          start: startTime,
          end: endTime,
          calendar: value,
          description: desc,
          // url,
          // extendedProps: {
          //   location,
          //   description: desc,
          //   guests,
          //   calendar: value[0].label
          // }
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
            console.log(res.data.ResponseResult)
            dispatch(updateEvent(res.data.ResponseResult))
    
            // const propsToUpdate = ['id', 'title', 'url']
            // const extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description']
            // updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
            handleAddEventSidebar()
            
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
    }
    // ** Set sidebar fields

    const handleSelectedEvent = () => {
      if (!isObjEmpty(selectedEvent)) {
        const calendar = selectedEvent.extendedProps?.calendar

        setTitle(selectedEvent.title || title)
        setAllDay(selectedEvent.allDay || allDay)
        // setUrl(selectedEvent.url || url)
        // setLocation(selectedEvent.extendedProps.location || location)
        setDesc(selectedEvent.extendedProps?.description || desc)
        // setGuests(selectedEvent.extendedProps.guests || guests)
        setStartPicker(new Date(selectedEvent.start))
        setEndPicker(selectedEvent.allDay ? new Date(selectedEvent.start) : new Date(selectedEvent.end))
        setValue(calendar)
      }
    }

    useEffect(()=>{
      handleSelectedEvent();
    },[])

    const handleSubmit = (e) => {
      e.preventDefault();
      setValidation(prev => ({...prev, title: title!==""}))
      if(title==='') return;
      if(!validation.title || !validation.start || (!allDay && !validation.end)) return;
      if (selectedEvent.title === '') {
        handleAddEvent()
      } else {
        handleUpdateEvent()
      }
    }

    const handleDeleteEvent = () => {
      setDialogOpen(true)
    }

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleConfirmClear = () => {
      deleteEvent();
    }
    const deleteEvent = () => {
      console.log(1)
      setDialogOpen(false)
      useJwt
      .removeEvent(selectedEvent.id)
      .then(res => { 
        if (res.data.ResponseCode == 0) {
          setSnackBarMsg({
            text: 'Event Deleted',
            type: 'success'
          })
          setSnackBarOpen(true);
  
          dispatch(removeEvent(selectedEvent.id))
          //removeEventInCalendar(selectedEvent.id)
          handleAddEventSidebar()
  
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
    }
  
    return (
      <form onSubmit={handleSubmit}>
          <Paper sx={{p:3, minWidth:285}}>
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5}}>
                <Typography component="h1" variant="h3">{selectedEvent.title===''?'Add New Event':'Update Event'}</Typography>
                <IconButton onClick={()=>{handleAddEventSidebar()}}>
                  <IconX size={18} stroke={1} />
                </IconButton>
              </Box> 
              <Stack direction="column" spacing={3}>
                <FormGroup>
                  <TextField
                      fullWidth
                      variant="outlined"
                      type='text' 
                      label="Title"
                      value={title}
                      onChange={e => {setTitle(e.target.value); setValidation(prev => ({...prev, title: e.target.value!==""}))}}
                      placeholder="Title"
                      error={!validation.title}
                      helperText={validation.title?'':'This filed is required.'}
                    />
                </FormGroup>
                <FormGroup>
                  <FormControl fullWidth>
                    <InputLabel id="value-select-label">Calendar</InputLabel>
                    <Select
                      labelId="value-select-label"
                      id="value-select"
                      value={value}
                      label="Calendar"
                      onChange={e => setValue(e.target.value)}
                    >
                      {options.map((item)=><MenuItem key={item.value} value={item.value}><Box component="span" sx={{width: 15, height: 15, borderRadius: '50%', bgcolor: theme.palette[item.color].main, mr: 1}} /> {item.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} error={!validation.start} helperText={validation.start?'':'Invaild Date'} />}
                      label={ value == 'Business' ? 'Start Time' : (allDay ? 'Date' : 'Start Date')}
                      value={startPicker}
                      onChange={(newValue) => {
                        setStartPicker(newValue);
                        setValidation(prev => ({...prev, start: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                      }}
                    />
                  </LocalizationProvider>
                </FormGroup>
                {
                  !allDay && <FormGroup>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} error={!validation.end} helperText={validation.end?'':'Invaild Date'} />}
                      label="End Date"
                      value={endPicker}
                      onChange={(newValue) => {
                        setEndPicker(newValue);
                        setValidation(prev => ({...prev, end: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                      }}
                    />
                  </LocalizationProvider>
                </FormGroup>
                }
                <FormGroup>
                  <FormControlLabel control={<Switch checked={allDay} onChange={e => setAllDay(e.target.checked)} inputProps={{ 'aria-label': 'controlled' }} />} label="All Day" />
                </FormGroup>
                <FormGroup>
                  <TextField
                    label="Description"
                    multiline
                    maxRows={4}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" variant="contained" type='submit'>SAVE</Button> 
                {
                  selectedEvent.title === '' ? <Button color="secondary" variant="contained" onClick={()=>handleAddEventSidebar()} >Cancel</Button> : <Button color="secondary" variant="contained" onClick={handleDeleteEvent}>DELETE</Button> 
                }
              </Stack>
          </Paper>
          <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Are you sure want to delete this event?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={()=>{handleConfirmClear()}} autoFocus>
                    OK
                </Button>
                </DialogActions>
            </Dialog>
      </form>
        
    )
}

export default EventDetail;