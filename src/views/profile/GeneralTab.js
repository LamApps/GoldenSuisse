import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import {
  Grid,
  Box,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';

import useJwt from 'utils/jwt/useJwt';
import { handleLogin } from 'store/actions'

const General = ({data}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [img, setImg] = useState(null)
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')  
    const [role, setRole] = useState('advisor')

    const [validation, setValidation] = useState({
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
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
        if (data) {
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPhone(data.phone);

            if (data.avatar && data.avatar.length) {
                return setImg(data.avatar)
            } else {
                return setImg(null)
            }
        }
    }, [data])

      // ** Function to change user image
    const onChange = e => {
        const reader = new FileReader(),
            files = e.target.files
        reader.onload = function () {
            setImg(reader.result)
        }
        reader.readAsDataURL(files[0])

        let idata = new FormData()
        idata.append('image', files[0])
        console.log(files);

        useJwt
        .updateAdvisorPhoto(idata)
        .then(res => {
            if (res.data.ResponseCode == 0) {
            const updatedUserData = { ...data }
            updatedUserData.avatar = res.data.ResponseResult.file_url;
            const rdata = { user: updatedUserData, access_token: useJwt.getToken(), refreshToken: '' }
            dispatch(handleLogin(rdata))
        
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

  // ** Function to handle form submit
    const handleSubmit = () => {
        setValidation(prev => ({...prev, first_name: first_name!=="", last_name: last_name!=="", email: email!=="", phone: phone!==""}))

        if(first_name==='' || last_name==='' || email==='' || phone==='') return;
        if(!validation.first_name || !validation.last_name || !validation.email || !validation.phone) return;

        const data = {
            first_name,
            last_name,
            email,
            phone,
          }
        // console.log(values);

        useJwt
        .updateAdvisorInfo(data)
        .then(res => {
          if (res.data.ResponseCode == 0) {
            console.log(res.data.ResponseResult)
            const updatedUserData = { ...data }
            updatedUserData.first_name = first_name;
            updatedUserData.last_name = last_name;
            updatedUserData.fullName = first_name + " " + last_name;
            updatedUserData.email = email;
            updatedUserData.phone = phone;
            
            const updtedAuthData = { user: updatedUserData, access_token: useJwt.getToken(), refreshToken: '' }
            dispatch(handleLogin(updtedAuthData))

            setSnackBarMsg({
                text: 'Successfully Updated.',
                type: 'success'
              })
            setSnackBarOpen(true);
            
          } else {
            console.log(res)
            if (res.data.ResponseCode == 1000004) {
                navigate(`/login`);
              }
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
        <>
            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit()
            }} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{display: 'flex'}}>
                        <Avatar alt={data?.fullName} src={img} sx={{ width: {xs: '90%', sm: 120}, height: {xs: 'auto', sm: 120} }}></Avatar>
                        <Box sx={{ml: 3, p: 3}}>
                            <Typography component="p" variant="h2">{data?.fullName}</Typography>
                            <Button variant="contained" sx={{mt: 2}} component="label">
                                Change
                                <input hidden accept="image/*" type="file" onChange={onChange} />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={12}>
                    <Button color="primary" variant="contained" type='submit' sx={{mr: 2}}>SAVE CHANGES</Button> 
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

export default General;