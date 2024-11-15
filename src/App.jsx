import React, { useState } from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Snackbar, Alert, List, ListItem, ListItemIcon, ListItemText, TextField, Typography, AlertTitle, Stack } from '@mui/material'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'

export default function App() {
  const [word, setWord] = useState('')
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
  const [reallyClear, setReallyClear] = useState(false)
  let list = localStorage.getItem('list')?.split(':') || []
  const [words, setWords] = useState(list)
  const [isDone, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const input = word.trim().toLocaleLowerCase()
    if (!input) return setError('Please enter a word')
    setError('')
    setWords([...words, input])
    setWord('')
    localStorage.setItem('list', words.join(':'))
    setOpenSuccessAlert(true)
  }

  const handleClear = () => {
    setReallyClear(false)
    localStorage.setItem('list', '')
    setWords([])
    setDone(false)
    setError('')
    setWord('')
  }

  const handleDone = () => {
    let shuffled = words.sort(() => Math.random() - 0.5)
    localStorage.setItem('list', shuffled.join(':'))
    setWord('')
    setWords(shuffled)
    setDone(true)
  }

  const inView = (
    <Stack
      direction='column'
      spacing={2}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '100%',
        width: '100%',
      }}
    >
      <Box
        component='form'
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        autoComplete='off'
      >
        <Typography variant='body1'>Pass the phone around and have each person type in ONE word then press "Enter Word".</Typography>
        <Typography variant='body1'>Once everyone has entered their word, the last person press "done"</Typography>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSuccessAlert} autoHideDuration={5000} onClose={() => setOpenSuccessAlert(false)}>
          <Alert severity='success' sx={{ width: '100%' }}>
            <AlertTitle>Success</AlertTitle>
            Word saved, pass to next person!
          </Alert>
        </Snackbar>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={!!error} autoHideDuration={5000} onClose={() => setError('')}>
          <Alert severity='error' sx={{ width: '100%' }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Snackbar>
        <TextField
          margin='normal'
          fullWidth
          id='word'
          label='word input'
          name='word'
          type='text'
          autoFocus
          value={word}
          onChange={(e) => {
            const v = e.target.value
            if (/^[a-zA-Z]+$/.test(v) || v === '') {
              setWord(v)
            } else {
              setError(`Only letters allowed. Can't use ${v.slice(-1)}`)
            }
          }}
          variant='outlined'
        />
        <Button variant='contained' fullWidth sx={{ mt: 3, mb: 1 }} onClick={handleSubmit}>
          Enter Word
        </Button>
        <h1>Word count {words.length}</h1>
        <Button variant='contained' color='success' fullWidth onClick={handleDone}>
          Done
        </Button>
      </Box>
    </Stack>
  )

  const doneView = (
    <>
      <Typography variant='body1'>List of all the words people said. Read them outloud then hit clear.</Typography>
      <List>
        {words.map((w) => {
          return (
            <ListItem key={w}>
              <ListItemIcon>
                <RecordVoiceOverIcon />
              </ListItemIcon>
              <ListItemText key={w} primary={w} />
            </ListItem>
          )
        })}
      </List>
      <Button variant='contained' fullWidth sx={{ mt: 3, mb: 2 }} onClick={() => setDone(false)}>
        {' '}
        back
      </Button>
    </>
  )
  return (
    <>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={!!reallyClear} autoHideDuration={5000} onClose={() => setReallyClear(false)}>
        <Alert severity='error' sx={{ width: '100%' }}>
          <Button color='error' variant='contained' fullWidth sx={{ mt: 0, mb: 2 }} onClick={handleClear}>
            Confirm Delete All Words
          </Button>
        </Alert>
      </Snackbar>
      <CssBaseline />
      <Container maxWidth='xs'>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: isDone ? null : '100vh',
          }}
        >
          <Typography variant='h1'>Corporate</Typography>
          {isDone ? doneView : inView}
        </Box>
        <Typography variant='body1'>This button clears all the entered words</Typography>
        <Button color='warning' variant='contained' fullWidth sx={{ mt: 0, mb: 2 }} onClick={() => setReallyClear(true)}>
          Delete All Words
        </Button>
      </Container>
    </>
  )
}
