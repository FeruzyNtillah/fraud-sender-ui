import React, { useState, useMemo } from 'react';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SenderInterface from './components/SenderInterface';
import RecipientInterface from './components/RecipientInterface';
import './App.css';

// Custom theme with muted teal color scheme
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          primary: {
            main: '#4db6ac',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#80cbc4',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#e0f2f1',
            secondary: '#b2dfdb',
          },
        }
      : {
          primary: {
            main: '#26a69a',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#80cbc4',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#004d40',
            secondary: '#00796b',
          },
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <CssBaseline />
          
          {/* Navigation Bar */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Mobile Transaction simulation
              </Typography>
              <Button color="inherit" component={Link} to="/sender">
                Sender
              </Button>
              <Button color="inherit" component={Link} to="/recipient">
                Recipient
              </Button>
              <IconButton
                sx={{ ml: 1 }}
                onClick={toggleColorMode}
                color="inherit"
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Routes>
              <Route path="/sender" element={<SenderInterface />} />
              <Route path="/recipient" element={<RecipientInterface />} />
              <Route path="/" element={<SenderInterface />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;