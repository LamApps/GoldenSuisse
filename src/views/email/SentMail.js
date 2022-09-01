import * as React from 'react';
import { Link as RouterLink, useOutletContext, useNavigate  } from 'react-router-dom';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'; 
import FormControl from '@mui/material/FormControl'; 
import InputLabel from '@mui/material/InputLabel'; 
import OutlinedInput from '@mui/material/OutlinedInput'; 
import InputAdornment from '@mui/material/InputAdornment'; 
import { IconTrash, IconEye, IconX, IconMenu, IconSearch } from '@tabler/icons';

import useJwt from 'utils/jwt/useJwt';

const headCells = [
  {
    id: 'receiver',
    label: 'Recipient',
  },
  {
    id: 'subject',
    label: 'Subject',
  },
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } =
    props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding='none'
          >
              {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, rows } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <></>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <IconTrash size={18} stroke={2} />
          </IconButton>
        </Tooltip>
      ) : (
        <Typography sx={{my: 1}} color="primary">You have sent {rows} mails in total</Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
};

export default function SentMail() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows]  = React.useState([]);

  const [openSidebar, handleToggleSidebar] = useOutletContext();

  React.useEffect(()=> {
    const advisorId = useJwt.getUserID();

    useJwt.getSentMails(advisorId)
    .then(res => {
      if(res.data.ResponseResult.length && res.data.ResponseResult.length>0) {
        setRows(res.data.ResponseResult);
      }
    })
  }, [])

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = val => {

  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3}}>
        <IconButton sx={{mr: 1}} onClick={handleToggleSidebar}>
          {openSidebar ? <IconX size={18} stroke={2} />: <IconMenu size={18} stroke={2} />}
        </IconButton>
        <Box sx={{flexGrow: 1}}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{color: 'white'}} htmlFor="search-box">Search</InputLabel>
            <OutlinedInput
              id="search-box"
              sx={{color:'white'}}
              onChange={e => handleFilter(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="search icon"
                    edge="end"
                  >
                    <IconSearch />
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
            />
          </FormControl>
        </Box>
      </Box>
      <Card sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} rows={rows.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleSelect(event, row.id)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Link underline="none" color="primary" component={RouterLink} to={"/email/view/"+row.id}>{row.to}</Link>
                      </TableCell>
                      <TableCell padding="none">{row.subject}</TableCell>
                      <TableCell padding="none">{new Date(row.created_at).toLocaleString()}</TableCell>
                      <TableCell padding="none">
                        <IconButton onClick={()=>{navigate("/email/view/"+row.id)}}>
                          <IconEye size={14} stroke={2} />
                        </IconButton>
                        <IconButton>
                          <IconTrash size={14} stroke={2} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}
