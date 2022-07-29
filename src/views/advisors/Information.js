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
  FormHelperText,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useJwt from 'utils/jwt/useJwt';
import { updateUser } from 'store/actions/user';

import { IconX, IconEye, IconEyeOff } from '@tabler/icons';

const Information = ({selectedUser}) => {
    const dispatch = useDispatch();

    // ** State
    const [bio, setBio] = useState(selectedUser?.brief || '')
    const [company, setCompany] = useState(selectedUser?.company || '')
    const [dob, setDob] = useState(new Date(selectedUser?.date_of_birth) || new Date())
    const [gender, setGender] = useState(selectedUser?.gender)

    const [validation, setValidation] = useState({
        bio: true,
        company: true,
        dob: true,
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

    const handleSubmit = () => {
        setValidation(prev => ({...prev, bio: bio!=="", company: company!=="", dob: dob!==null && !(dob instanceof Date && isNaN(dob))}))
        if(bio === "" || company === "" || (dob!==null && (dob instanceof Date && isNaN(dob)))) return;
        if(!validation.bio || !validation.company || !validation.dob) return;

        if (bio.replaceAll(/\s/g,'') == '') {
            setSnackBarMsg({
                text: 'Please input valid bio',
                type: 'error'
              })
            setSnackBarOpen(true);
          return
        }
    
        if (company.replaceAll(/\s/g,'') == '') {
            setSnackBarMsg({
                text: 'Please input valid company',
                type: 'error'
              })
            setSnackBarOpen(true);
          return
        }
    
        const uData = {
          user_id: selectedUser.id,
          brief: bio,
          date_of_birth: dob,
          gender: gender,
          company: company
        }
        
        useJwt
          .updateAdvisorInfo(uData)
          .then(res => {
            if (res.data.ResponseCode == 0) {
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

    const onReset = () => {
        setBio(selectedUser?.brief);
        setCompany(selectedUser?.company);
        setDob(new Date(selectedUser?.date_of_birth));
        setGender(selectedUser?.gender);
    }

    return (
        <>
            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit()
            }} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='text' 
                        label="Bio"
                        placeholder="Bio"
                        multiline
                        rows={4}
                        value={bio}
                        onChange={e => {setBio(e.target.value); setValidation(prev => ({...prev, bio: e.target.value!==""}))}}
                        error={!validation.bio}
                        helperText={validation.bio?'':'This filed is required.'}
                        />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='text' 
                        label="Company"
                        placeholder="Company"
                        value={company}
                        onChange={e => {setCompany(e.target.value); setValidation(prev => ({...prev, company: e.target.value!==""}))}}
                        error={!validation.company}
                        helperText={validation.company?'':'This filed is required.'}
                        />
                </Grid>
                <Grid item xs={6} sm={6} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                            renderInput={(props) => <TextField {...props} fullWidth error={!validation.dob} helperText={validation.dob?'':'Invaild Date'} />}
                            label='Date of Birth'
                            value={dob}
                            onChange={(newValue) => {
                                setDob(newValue);
                                setValidation(prev => ({...prev, dob: newValue!==null && !(newValue instanceof Date && isNaN(newValue))}))
                            }}


                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="value-select-label">Gender</InputLabel>
                        <Select
                            labelId="value-select-label"
                            id="value-select"
                            label="Gender"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                        >
                            <MenuItem value='male'>Male</MenuItem>
                            <MenuItem value='female'>Female</MenuItem>
                        </Select>
                    </FormControl>
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

export default Information;