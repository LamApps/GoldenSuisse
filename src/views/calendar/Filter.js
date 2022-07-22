import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';

import { IconX } from '@tabler/icons';


const Filter = (props) => {
    const {
        store,
        dispatch,
        handleFilterSidebar,
        updateAllFilters,
        updateFilter,
      } = props

    const filters = [
        { label: 'Personal', color: 'error' },
        { label: 'Business', color: 'primary' },
        { label: 'Holiday', color: 'success' },
    ]

  
    return (
        <Paper sx={{p:3, minWidth:285}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5}}>
            <Typography component="h1" variant="h3">View Options</Typography>
            <IconButton onClick={()=>{handleFilterSidebar()}}>
                <IconX size={18} stroke={1} />
            </IconButton>
            </Box> 
            <FormGroup>
            <FormControlLabel control={<Checkbox checked={store.selectedCalendars.length === filters.length} color="secondary" onChange={e => dispatch(updateAllFilters(e.target.checked))} />} label="View All" />
            {
              filters.map(filter => <FormControlLabel key={filter.label} control={<Checkbox color={filter.color} checked={store.selectedCalendars.includes(filter.label)} onChange={e => dispatch(updateFilter(filter.label))} />} label={filter.label} />)
            }
            </FormGroup>
        </Paper> 
    )
}

export default Filter;