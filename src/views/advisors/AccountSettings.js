import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

import {
  Grid,
  Box,
  TextField,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  OutlinedInput,
  InputAdornment,
  Button,
  IconButton,
  FormHelperText
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import useJwt from 'utils/jwt/useJwt';
import { updateUser } from 'store/actions/user';

import { IconX, IconEye, IconEyeOff } from '@tabler/icons';

const AccountSettings = ({selectedUser}) => {
    const dispatch = useDispatch();

    const [img, setImg] = useState(null)
    const [userData, setUserData] = useState(null)
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')  
    const [role, setRole] = useState('advisor')

    const [startTime1, setStartTime1] = useState(new Date())
    const [startTime2, setStartTime2] = useState(new Date())
    const [endTime1, setEndTime1] = useState(new Date())
    const [endTime2, setEndTime2] = useState(new Date())
    const [status, setStatus] = useState('pending')
    const [timezone, setTimezone] = useState('(UTC) Edinburgh, London')
    const [timezoneList, setTimezoneList] = useState([])

    const [validation, setValidation] = useState({
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        startTime1: true,
        startTime2: true,
        endTime1: true,
        endTime2: true,
    })

      //Snack Bar
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
        // ** Update user image on mount or change
    useEffect(() => {
        loadTimezoneList()

        if (selectedUser !== null || (selectedUser !== null && userData !== null && selectedUser.id !== userData.id)) {
            setUserData(selectedUser)
            setFirstName(selectedUser.first_name);
            setLastName(selectedUser.last_name);
            setEmail(selectedUser.email);
            setPhone(selectedUser.phone);
            setStatus(selectedUser.status == 1 ? 'active' : (selectedUser.status == 0 ? 'inactive' : 'pending'));
            setRole(selectedUser.role);
            setTimezone(selectedUser.timezone);

            loadAccountWorkTimes()

            if (selectedUser.avatar && selectedUser.avatar.length) {
                return setImg(selectedUser.avatar)
            } else {
                return setImg(null)
            }
        }
    }, [selectedUser])

      // ** Function to change user image
    const onChange = e => {
        const reader = new FileReader(),
            files = e.target.files
        reader.onload = function () {
            setImg(reader.result)
        }
        reader.readAsDataURL(files[0])

        let data = new FormData()
        data.append('image', files[0])
        data.append('user_id', selectedUser.id)
        console.log(files);

        useJwt
        .updateAdvisorPhoto(data)
        .then(res => {
            if (res.data.ResponseCode == 0) {
            dispatch(updateUser(res.data.ResponseResult))

            setSnackBarMsg({
                text: 'Successfully Updated.',
                type: 'success'
              })
            setSnackBarOpen(true);

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

    const loadTimezoneList = () => {
        axios
        .get(`${process.env.REACT_APP_BASE_API_URL}/user/timezone_list`)
        .then(res => {
          if (res.data.ResponseCode == 0) {
            setTimezoneList(res.data.ResponseResult)
    
          } else {
            setSnackBarMsg({
                text: res.data.ResponseMessage,
                type: 'error'
              })
            setSnackBarOpen(true);
          }
        })
        .catch(err => {
          console.log(err);
          setSnackBarMsg({
            text: 'Network error, Please reload page',
            type: 'error'
          })
          setSnackBarOpen(true);
        })
    }

    const onReset = () => {
        setFirstName(selectedUser.first_name);
        setLastName(selectedUser.last_name);
        setEmail(selectedUser.email);
        setPhone(selectedUser.phone);
        setStatus(selectedUser.status == 1 ? 'active' : (selectedUser.status == 0 ? 'inactive' : 'pending'));
        setRole(selectedUser.role);
    }

    const loadAccountWorkTimes = () => {
        useJwt
        .loadAdvisorWorkTimes(selectedUser.id)
        .then(res => {
          if (res.data.ResponseCode == 0) {
            const workTimes = res.data.ResponseResult
            if (workTimes.length > 0) {
              setStartTime1(getTime(workTimes[0].start))
              setEndTime1(getTime(workTimes[0].end))
            }
            if (workTimes.length > 1) {
              setStartTime2(getTime(workTimes[1].start))
              setEndTime2(getTime(workTimes[1].end))
            }
          } else {
            console.log(res)
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
  // ** Function to handle form submit
    const handleSubmit = () => {
        setValidation(prev => ({...prev, first_name: first_name!=="", last_name: last_name!=="", email: email!=="", phone: phone!==""}))

        if(first_name==='' || last_name==='' || email==='' || phone==='') return;
        if(!validation.first_name || !validation.last_name || !validation.email || !validation.phone || !validation.startTime1 || !validation.startTime2 || !validation.endTime1 || !validation.endTime2) return;

        const data = {
            user_id: selectedUser.id,
            first_name,
            last_name,
            email,
            phone,
            timezone,
            status: status == 'pending' ? -1: (status == 'active' ? 1 : 0),
            role,
            start_time1: getSeconds(startTime1),
            end_time1: getSeconds(endTime1),
            start_time2: getSeconds(startTime2),
            end_time2: getSeconds(endTime2),
          }
        // console.log(values);

        useJwt
        .updateAdvisorInfo(data)
        .then(res => {
          if (res.data.ResponseCode == 0) {
            console.log(res.data.ResponseResult)
            dispatch(updateUser(res.data.ResponseResult))

            setSnackBarMsg({
                text: 'Successfully Updated.',
                type: 'success'
              })
            setSnackBarOpen(true);
            
          } else {
            console.log(res)
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

    const getTime = (seconds) => {
        const hours = parseInt(seconds / 3600);
        const minutes = parseInt((seconds - hours * 3600) / 60);
        return moment(`${hours}:${minutes}`, "H:mm").toDate()
      }
    
    const getSeconds = (date) => {
        const hours = +moment(date).format('H')
        const minutes = +moment(date).format('mm')
        return hours * 3600 + minutes * 60
    }

    return (
        <>
            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit()
            }} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{display: 'flex'}}>
                        <Avatar alt={selectedUser?.fullName} src={img} sx={{ width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120} }}></Avatar>
                        <Box sx={{ml: 3, p: 3}}>
                            <Typography component="p" variant="h2">{selectedUser?.fullName}</Typography>
                            <Button variant="contained" sx={{mt: 2}} component="label">
                                Change
                                <input hidden accept="image/*" type="file" onChange={onChange} />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='text' 
                        label="First Name"
                        placeholder="First Name"
                        value={first_name}
                        onChange={e => {setFirstName(e.target.value); setValidation(prev => ({...prev, first_name: e.target.value!==""}))}}
                        error={!validation.first_name}
                        helperText={validation.first_name?'':'This filed is required.'}
                        />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='text' 
                        label="Last Name"
                        placeholder="Last Name"
                        value={last_name}
                        onChange={e => {setLastName(e.target.value); setValidation(prev => ({...prev, last_name: e.target.value!==""}))}}
                        error={!validation.last_name}
                        helperText={validation.last_name?'':'This filed is required.'}
                        />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='text' 
                        label="Email"
                        placeholder="Email"
                        value={email}
                        onChange={e => {setEmail(e.target.value); setValidation(prev => ({...prev, email: e.target.value!==""}))}}
                        error={!validation.email}
                        helperText={validation.email?'':'This filed is required.'}

                        />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='text' 
                        label="Phone Number"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={e => {setPhone(e.target.value); setValidation(prev => ({...prev, phone: e.target.value!==""}))}}
                        error={!validation.phone}
                        helperText={validation.phone?'':'This filed is required.'}
                            />

                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="value-select-label">Status</InputLabel>
                        <Select
                            labelId="value-select-label"
                            id="value-select"
                            label="Status"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                        </FormControl>

                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="value-select-label">Timezone</InputLabel>
                        <Select
                            labelId="value-select-label"
                            id="value-select"
                            label="Timezone"
                            value={timezone}
                            onChange={e => setTimezone(e.target.value)}
                        >
                            {timezoneList.map(timezone => (
                            <MenuItem key={timezone.text} value={timezone.text}>{timezone.text}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                            renderInput={(props) => <TextField {...props} fullWidth error={!validation.startTime1} helperText={validation.startTime1?'':'Invaild Date'} />}
                            label='Start Time 1'
                            value={startTime1}
                            onChange={(newValue) => {
                                setStartTime1(newValue);
                                setValidation(prev => ({...prev, startTime1: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                            }}
                            />
                        </LocalizationProvider>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            renderInput={(props) => <TextField {...props} fullWidth error={!validation.endTime1} helperText={validation.endTime1?'':'Invaild Date'} />}
                            label='End Time 1'
                            value={endTime1}
                            onChange={(newValue) => {
                                setEndTime1(newValue);
                                setValidation(prev => ({...prev, endTime1: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                            }}

                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <TimePicker
                            renderInput={(props) => <TextField {...props} fullWidth error={!validation.startTime2} helperText={validation.startTime2?'':'Invaild Date'} />}
                            label='Start Time 2'
                            value={startTime2}
                            onChange={(newValue) => {
                                setStartTime2(newValue);
                                setValidation(prev => ({...prev, startTime2: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                            }}


                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <TimePicker
                            renderInput={(props) => <TextField {...props} fullWidth error={!validation.endTime2} helperText={validation.endTime2?'':'Invaild Date'} />}
                            label='End Time 2'
                            value={endTime2}
                            onChange={(newValue) => {
                                setEndTime2(newValue);
                                setValidation(prev => ({...prev, endTime2: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                            }}

                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Button color="primary" variant="contained" type='submit' sx={{mr: 2}}>SAVE CHANGES</Button> 
                    <Button color="secondary" variant="contained" onClick={onReset}>RESET</Button> 
                </Grid>
            </Grid>        
            </form>
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
        </>
    )
}

export default AccountSettings;