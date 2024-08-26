"use client"
import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Container, Typography, Box } from '@mui/material';

interface Voice {
  id: number;
  title: string;
  content: string;
  path: string;
}

export default function Home() {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [voices, setVoices] = useState<Voice[]>([]);

  // 登録処理などが発生したら再実行する
  const fetchWavFiles = async () => {
    const res = await fetch(`/api/voices`);
    if (res.ok) {
      const j = await res.json();
      setVoices(j);
    } else {
      alert('fetch: failed');
    }
  }

  const handleSubmit = async () => {
    const body = JSON.stringify({
      title,
      content
    })
    const res = await fetch(`/api/voice`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      alert('post: success');
      setTitle('');
      setContent('');
      fetchWavFiles();
    } else {
      alert('post: failed');
      console.error(res);
    }
  }

  useEffect(() => {
    fetchWavFiles();
  }, [])

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Voice Uploader
        </Typography>

        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          fullWidth
          label="Content"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>

        <List sx={{ mt: 4 }}>
          {voices.map((v, i) => (
            <ListItem key={i} component="a" href={v.path} button>
              <ListItemText primary={v.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
