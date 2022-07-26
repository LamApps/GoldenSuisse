import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Box,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  FormGroup,
  Stack,
  OutlinedInput,
  InputAdornment,
  Button,
  IconButton,
  FormHelperText
} from '@mui/material';


import { useForm, Controller  } from 'react-hook-form';

import useJwt from 'utils/jwt/useJwt';
import { addUser } from 'store/actions/user';

import { IconX, IconEye, IconEyeOff } from '@tabler/icons';

const helperText = {
    firstName: {
        required: "First Name is Required.",
    },
    lastName: {
        required: "First Name is Required.",
    },
    userName: {
        required: "First Name is Required.",
    },
    email: {
      required: "Email is Required.",
      pattern: "Invaild Email Address",
    },
    phoneNumber: {
        required: "Email is Required.",
        pattern: "Invaild Phone Number",
    },
    password: {
      required: "Password is Required.",
      minLength: "Password must be at least 6 characters long.",
    }
}

const AddSideBar = ({handleAddSidebar, setSnackBarMsg, setSnackBarOpen}) => {
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('advisor')

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };

    const { control, handleSubmit } = useForm({
        reValidateMode: 'onBlur'
    });

  // ** Function to handle form submit
    const onSubmit = values => {

        const data = {
            first_name: values.firstName,
            last_name: values.lastName,
            role,
            username: values.userName,
            phone: values.phoneNumber,
            email: values.email,
            password: values.password,
            status: 1
        }
        console.log(values);

        useJwt
            .addAdvisor(data)
            .then(res => {

            if (res.data.ResponseCode == 0) {
                const user = res.data.ResponseResult
                console.log('user', user);
                dispatch(addUser(user))
                handleAddSidebar()
                setSnackBarMsg({
                    text: 'Successfully Created.',
                    type: 'success'
                  })
                setSnackBarOpen(true);

            } else {
                console.log('error', res.data);
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
                console.log(err)
            })
    }  

    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Paper sx={{p:3, minWidth:285}}>
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5}}>
                <Typography component="h1" variant="h3">Add New User</Typography>
                <IconButton onClick={()=>{handleAddSidebar()}}>
                  <IconX size={18} stroke={1} />
                </IconButton>
              </Box> 
              <Stack direction="column" spacing={3}>
                <FormGroup>
                    <Controller
                        control={control}
                        name="firstName"
                        defaultValue=""
                        rules={{
                        required: true,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            type='text' 
                            label="First Name"
                            placeholder="First Name"
                            error={error !== undefined}
                            helperText={error ? helperText.firstName[error.type]: ''}
                            />
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="lastName"
                        defaultValue=""
                        rules={{
                            required: true,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            type='text' 
                            label="Last Name"
                            placeholder="Last Name"
                            error={error !== undefined}
                            helperText={error ? helperText.lastName[error.type]: ''}
                            />
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="userName"
                        defaultValue=""
                        rules={{
                            required: true,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            type='text' 
                            label="Username"
                            placeholder="Username"
                            error={error !== undefined}
                            helperText={error ? helperText.userName[error.type]: ''}
                            />
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="email"
                        defaultValue=""
                        rules={{
                            required: true,
                            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                        }}
                        render={({field, fieldState: {error}}) => (
                        <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            type='email' 
                            label="Email"
                            placeholder="Email"
                            error={error !== undefined}
                            helperText={error ? helperText.email[error.type]: ''}
                            />
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="phoneNumber"
                        defaultValue=""
                        rules={{
                            required: true,
                            pattern: /^[0-9|-]+$/
                        }}
                        render={({field, fieldState: {error}}) => (
                        <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            type='text' 
                            label="Phone Number"
                            placeholder="Phone Number"
                            error={error !== undefined}
                            helperText={error ? helperText.phoneNumber[error.type]: ''}
                            />
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Controller
                        control={control}
                        name="password"
                        defaultValue=""
                        rules={{
                            required: true,
                            minLength: 5,
                        }}
                        render={({field, fieldState: {error}}) => (
                        <FormControl sx={{width: '100%'}} variant="outlined" {...field}>
                            <InputLabel htmlFor="outlined-adornment-password" error={error !== undefined}>Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder='*****'
                                error={error !== undefined}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <IconEyeOff size={18} stroke={2} /> : <IconEye size={18} stroke={2} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {
                                error && <FormHelperText error>
                                    {helperText.password[error.type]}
                                </FormHelperText>
                            }
                        </FormControl>
                        )}
                    />
                </FormGroup>
                <Button color="primary" variant="contained" type='submit'>SAVE</Button> 
                <Button color="secondary" variant="contained" onClick={()=>handleAddSidebar()} >Cancel</Button>
              </Stack>
          </Paper>
      </form>
        
    )
}

export default AddSideBar;