import {
  TextField,
  FormGroup,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import { useForm, Controller  } from 'react-hook-form';

import { IconX } from '@tabler/icons';

const helperText = {
    email: {
      required: "Email is Required.",
      pattern: "Invaild Email Address",
    },
}

const AddConnection = ({handleModalClose, handleConnect}) => {

    const { control, handleSubmit } = useForm({
        reValidateMode: 'onBlur'
    });

    return (
      <form onSubmit={handleSubmit(handleConnect)} noValidate>
            <DialogTitle id="alert-dialog-title">
              Connect Form
              <IconButton
                aria-label="close"
                onClick={handleModalClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <IconX size={18} stroke={2} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormGroup sx={{mt: 2, width: 250}}>
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
            </DialogContent>
            <DialogActions>
                <Button color="primary" type='submit'>SUBMIT</Button> 
            </DialogActions>
      </form>
        
    )
}

export default AddConnection;