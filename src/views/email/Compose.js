import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useForm, Controller  } from 'react-hook-form';
import useJwt from 'utils/jwt/useJwt';

import { Link as RouterLink, useOutletContext, useNavigate  } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import { IconTrash, IconArrowBack, IconX, IconMenu, IconSearch } from '@tabler/icons';

const helperText = {
    email: {
      required: "Email is Required.",
      pattern: "Invaild Email Address",
    },
    subject: {
        required: "Subject is Required.",
    }
}

export default function Compose () {
    const [openSidebar, handleToggleSidebar] = useOutletContext();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const { control, handleSubmit } = useForm({
        reValidateMode: 'onBlur'
    });

    const log = () => {
        if (editorRef.current) {
          console.log(editorRef.current.getContent());
        }
      };

    const send = (data) => {
        const content = editorRef.current.getContent();
        if(content == '') return;
        const mailData = {
            from: '',
            to: data.email,
            subject: data.subject,
            content: content
        }
        useJwt
        .sendEmail(mailData)
        .then(res => {
            if(res.data.mail) navigate('/email/sent');
        })
    }

    const saveInDraft = (data) => {
        const content = editorRef.current.getContent();
        if(content == '') return;
        const mailData = {
            from: '',
            to: data.email,
            subject: data.subject,
            content: content
        }
        useJwt
        .saveMailDraft(mailData)
        .then(res => {
            if(res.data.mail) navigate('/email/draft');
        })
    }

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
            <form onSubmit={handleSubmit(send)} noValidate>
                <Stack spacing={1}>
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
                            label="To"
                            placeholder="Recipent"
                            error={error !== undefined}
                            helperText={error ? helperText.email[error.type]: ''}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="subject"
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
                            label="Subject"
                            placeholder="Subject"
                            error={error !== undefined}
                            helperText={error ? helperText.subject[error.type]: ''}
                            />
                        )}
                    />
                    <Editor
                        apiKey='6d962k2f7b9agmq38v9cjpijf10uwvvzwn97xpt1zcjuqkgc'
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        skin: "oxide-dark",
                        content_css: "dark"
                        }}
                    />
                </Stack>
                <Box sx={{mt: 3}}>
                    <Button variant="outlined" sx={{ml: 1}} color="secondary" onClick={handleSubmit(saveInDraft)}>Save in draft</Button>
                    <Button type="submit" variant="outlined" sx={{ml: 1}} color="primary" >Send</Button>
                    <Button variant="outlined" sx={{ml: 1}} color="inherit" onClick={()=>{navigate(-1)}}>Back</Button>
                </Box>
            </form>
        </Box>
    )
}