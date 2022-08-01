import { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  FormControl,
  InputLabel,
  FormGroup,
  Stack,
  OutlinedInput,
  InputAdornment,
  Button,
  IconButton,
  FormHelperText,
  Snackbar,
  Alert
} from '@mui/material';


import { useForm, Controller  } from 'react-hook-form';

import useJwt from 'utils/jwt/useJwt';

import { IconEye, IconEyeOff } from '@tabler/icons';

const helperText = {
    old_password: {
        required: "First Name is Required.",
        minLength: "Password must be at least 5 characters long.",
    },
    new_password: {
        required: "First Name is Required.",
        minLength: "Password must be at least 5 characters long.",
    },
    confirm_password: {
        required: "First Name is Required.",
        minLength: "Password must be at least 5 characters long.",
    },
}

const PasswordTab = () => {

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const { control, handleSubmit } = useForm({
        reValidateMode: 'onBlur'
    });

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

    // ** Function to handle form submit
    const onSubmit = values => {
        if (values.old_password === values.new_password) {
            setSnackBarMsg({
                text: 'Used same password.',
                type: 'error'
              })
            setSnackBarOpen(true);
            return;
        }
        if (values.new_password !== values.confirm_password) {
            setSnackBarMsg({
                text: 'Confirm password do not match.',
                type: 'error'
              })
            setSnackBarOpen(true);
            return;
        }
        useJwt
            .resetPassword({ old_password: values.old_password, new_password: values.new_password })
            .then(res => {
            if (res.data.ResponseCode == 0) {
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
            .catch(err => console.log(err))
    }  

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack direction="column" spacing={3}>
                <FormGroup>
                    <Controller
                        control={control}
                        name="old_password"
                        defaultValue=""
                        rules={{
                            required: true,
                            minLength: 5,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <FormControl sx={{width: '100%'}} variant="outlined" {...field}>
                            <InputLabel htmlFor="outlined-adornment-password" error={error !== undefined}>Old Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder='*****'
                                error={error !== undefined}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=>{setShowOldPassword(!showOldPassword)}}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showOldPassword ? <IconEyeOff size={18} stroke={2} /> : <IconEye size={18} stroke={2} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {
                                error && <FormHelperText error>
                                    {helperText.old_password[error.type]}
                                </FormHelperText>
                            }
                        </FormControl>
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="new_password"
                        defaultValue=""
                        rules={{
                            required: true,
                            minLength: 5,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <FormControl sx={{width: '100%'}} variant="outlined" {...field}>
                            <InputLabel htmlFor="outlined-adornment-password" error={error !== undefined}>New Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder='*****'
                                error={error !== undefined}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=>{setShowNewPassword(!showNewPassword)}}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showNewPassword ? <IconEyeOff size={18} stroke={2} /> : <IconEye size={18} stroke={2} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {
                                error && <FormHelperText error>
                                    {helperText.new_password[error.type]}
                                </FormHelperText>
                            }
                        </FormControl>
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="confirm_password"
                        defaultValue=""
                        rules={{
                            required: true,
                            minLength: 5,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <FormControl sx={{width: '100%'}} variant="outlined" {...field}>
                            <InputLabel htmlFor="outlined-adornment-password" error={error !== undefined}>Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='*****'
                                error={error !== undefined}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showConfirmPassword ? <IconEyeOff size={18} stroke={2} /> : <IconEye size={18} stroke={2} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {
                                error && <FormHelperText error>
                                    {helperText.confirm_password[error.type]}
                                </FormHelperText>
                            }
                        </FormControl>
                        )}
                    />
                </FormGroup>
                <Button color="primary" variant="contained" type='submit'>SAVE</Button> 
                </Stack>
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

export default PasswordTab;