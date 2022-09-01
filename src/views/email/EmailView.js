import {useState, useEffect} from "react";
import { Link as RouterLink, useOutletContext, useNavigate, useParams  } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import DOMPurify from "dompurify";

import useJwt from 'utils/jwt/useJwt';

import IconButton from '@mui/material/IconButton';
import { IconTrash, IconArrowBack, IconX, IconMenu, IconSearch } from '@tabler/icons';

export default function EmailView () {
    const [openSidebar, handleToggleSidebar] = useOutletContext();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [subject, setSubject] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [dirtyHTML, setDirtyHTML] = useState('');

    useEffect(() => {
        useJwt.getMailContent(id)
        .then( res => {
            if(res.data.ResponseResult) {
                const data = res.data.ResponseResult
                setSubject(data.subject);
                setCreatedAt(data.created_at);
                setDirtyHTML(data.content);
            }
        })
    }, [])

    const cleanHTML = DOMPurify.sanitize(dirtyHTML, {
        USE_PROFILES: { html: true },
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <IconButton sx={{mr: 1}} onClick={handleToggleSidebar}>
                {openSidebar ? <IconX size={18} stroke={2} />: <IconMenu size={18} stroke={2} />}
                </IconButton>
                <Box>
                    <IconButton onClick={()=>{navigate(-1)}}><IconArrowBack size={14} stroke={2} /></IconButton>
                    <IconButton><IconTrash size={14} stroke={2} /></IconButton>
                </Box>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography component="h1" variant="h2">
                    {subject}
                </Typography>
                <Typography variant="body2">
                    {new Date(createdAt).toLocaleString()}
                </Typography>
            </Box>
            <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
            <Box sx={{mt: 3}}>
                <Button variant="outlined" sx={{ml: 1}} color="primary">Reply</Button>
                <Button variant="outlined" sx={{ml: 1}} color="error">Delete</Button>
                <Button variant="outlined" sx={{ml: 1}} color="inherit" onClick={()=>{navigate(-1)}}>Back</Button>
            </Box>
        </Box>
    )
}