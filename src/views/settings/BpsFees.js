import {useState, useEffect} from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import {
    Box,
    Grid,
    Stack,
    Paper,
    TextField,
    Typography,
    Chip,
    Button,
    Badge,
    Pagination,
    Link,
    IconButton,
    FormControl,
    InputLabel,
    InputAdornment,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogActions,
    DialogTitle,
    Snackbar,
    Alert,
    Drawer,
    DialogContent,
  } from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

import useJwt from 'utils/jwt/useJwt';
import { useForm, Controller  } from 'react-hook-form';

import { IconUser, IconCheck, IconStar, IconPhone, IconPlus, IconSearch, IconTrash, IconEdit, IconFileDescription, IconDotsVertical } from '@tabler/icons';

const BpsFees = ({data}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

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

  const onSubmit = data => {
    useJwt
      .updateSettingsInfo(data)
      .then(res => {
        if (res.data.ResponseCode == 0) {
          setSnackBarMsg({
            text: 'Successfully Saved',
            type: 'success'
          })
          setSnackBarOpen(true);

        } else {
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
      .catch(err => console.log(err))
  }


  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography color="primary" sx={{mb: 3}}>Sales Investment Coins</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Controller
            control={control}
            name="fee_sales_gold_coins"
            defaultValue={data.fee_sales_gold_coins}
            rules={{
              required: true,
            }}
            render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                fullWidth
                variant="outlined"
                type='text' 
                label="Gold"
                placeholder="Fee sales investment gold coins"
                error={error !== undefined}
                helperText={error ? 'This field is required': ''}
                />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Controller
            control={control}
            name="fee_sales_silver_coins"
            defaultValue={data.fee_sales_silver_coins}
            rules={{
              required: true,
            }}
            render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                fullWidth
                variant="outlined"
                type='text' 
                label="Silver"
                placeholder="Fee sales investment silver coins"
                error={error !== undefined}
                helperText={error ? 'This field is required': ''}
                />
            )}
          />
        </Grid>
      </Grid>
      <Typography color="primary" sx={{my: 3}}>Sales Investment Bars</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Controller
            control={control}
            name="fee_sales_gold_bars"
            defaultValue={data.fee_sales_gold_bars}
            rules={{
              required: true,
            }}
            render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                fullWidth
                variant="outlined"
                type='text' 
                label="Gold"
                placeholder="Fee sales investment gold bars"
                error={error !== undefined}
                helperText={error ? 'This field is required': ''}
                />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Controller
            control={control}
            name="fee_sales_silver_bars"
            defaultValue={data.fee_sales_silver_bars}
            rules={{
              required: true,
            }}
            render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                fullWidth
                variant="outlined"
                type='text' 
                label="Silver"
                placeholder="Fee sales investment silver bars"
                error={error !== undefined}
                helperText={error ? 'This field is required': ''}
                />
            )}
          />
        </Grid>
      </Grid>
      <Typography color="primary" sx={{my: 3}}>Storage and Management Fee per year</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Controller
            control={control}
            name="fee_year_gold_store_manage"
            defaultValue={data.fee_year_gold_store_manage}
            rules={{
              required: true,
            }}
            render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                fullWidth
                variant="outlined"
                type='text' 
                label="Gold"
                placeholder="Gold Storage and Management Fee per Year"
                error={error !== undefined}
                helperText={error ? 'This field is required': ''}
                />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Controller
            control={control}
            name="fee_year_silver_store_manage"
            defaultValue={data.fee_year_silver_store_manage}
            rules={{
              required: true,
            }}
            render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                fullWidth
                variant="outlined"
                type='text' 
                label="Silver"
                placeholder="Gold Storage and Management Fee per Year"
                error={error !== undefined}
                helperText={error ? 'This field is required': ''}
                />
            )}
          />
        </Grid>
      </Grid>
      <Button color="primary" variant='contained' type="submit" sx={{mt: 3}}>Save Changes</Button>
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

export default BpsFees;