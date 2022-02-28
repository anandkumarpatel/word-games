import { useState, Fragment } from "react"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import {
  Box,
  Container,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  AlertTitle,
} from "@mui/material"
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

export default function App() {
  const [word, setWord] = useState("")
  let list = localStorage.getItem("list")
  const [open, setOpen] = useState(false);
  const [reallyClear, setReallyClear] = useState(false);

  if (list) {
    list = list.split(":")
  } else {
    list = []
  }
  const [words, setWords] = useState(list)
  const [isDone, setDone] = useState(false)

  const handleSubmit = () => {
    if (!word) return
    const w = word.toLocaleLowerCase()
    if (words.includes(w)) {
      return alert(`Someone already said "${w}", pick another word`)
    }
    words.push(w)
    setWords(words)
    setWord("")
    localStorage.setItem("list", words.join(":"))
    setOpen(true)
  }

  const handleClear = () => {
    if (!reallyClear) {
      setTimeout(() => {
        setReallyClear(false)
      }, 1000)
      return setReallyClear(true)
    }
    setReallyClear(false)
    localStorage.setItem("list", "")
    setWords([])
    setDone(false)
  }

  const handleDone = () => {
    let shuffled = words
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    localStorage.setItem("list", shuffled.join(":"))
    setWords(shuffled)
    setDone(true)
  }

  const inView = (
    <Fragment>
      <Typography variant="body">Pass the phone around and have each person type in ONE word then press "Enter Word".</Typography>
      <Typography variant="body">Once everyone has entered their word, the last person press "done"</Typography>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
        <AlertTitle>Success</AlertTitle>
          Word saved, pass to next person!
        </Alert>
      </Snackbar>
      <TextField
        margin="normal"
        fullWidth
        id="word"
        label="word input"
        name="word"
        type="text"
        autoFocus
        value={word}
        onChange={(e) =>  {
          const v = e.target.value
          if (/^[a-zA-Z]+$/.test(v) || v === '') {
            setWord(v)
          }
        }}
        variant="outlined"
      />
      <Button variant="contained" fullWidth sx={{ mt: 3, mb: 1 }} onClick={handleSubmit}>
        Enter Word
      </Button>
      <Button variant="contained" color='success' fullWidth sx={{ mt: 5, mb: 2 }} onClick={handleDone}>
        Done
      </Button>
      <h1>Word count {words.length}</h1>
    </Fragment>
  )

  const doneView = (
    <Fragment>
      <Typography variant="body">List of all the words people said. Read them outloud then hit clear.</Typography>
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
      <Button variant="contained" fullWidth sx={{ mt: 3, mb: 2 }} onClick={() => setDone(false)}>
        {" "}
        back
      </Button>
    </Fragment>
  )
  return (
    <Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          component="form"
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          autoComplete="off"
        >
          <Typography component="h1" variant="h1">Corporate</Typography>
          {isDone ? doneView : inView}
          <Typography variant="body">This button clears all the entered words</Typography>
          <Button color={reallyClear ?  'error' : 'warning' } variant="contained" fullWidth sx={{ mt: 0, mb: 2 }} onClick={handleClear}>
            {reallyClear ?  'Confirm Delete All Words' : 'Delete All Words' }
          </Button>
        </Box>
      </Container>
    </Fragment>
  )
}
