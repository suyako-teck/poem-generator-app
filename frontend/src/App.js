import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import PhotoUpload from './components/PhotoUpload';
import PoemGenerator from './components/PoemGenerator';
import CharacterForm from './components/CharacterForm';
import LanguageSelector from './components/LanguageSelector';
import Advertisement from './components/Advertisement';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4081',
    },
    secondary: {
      main: '#00e5ff',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    h4: {
      fontFamily: '"Noto Serif JP", serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Noto Serif JP", serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [language, setLanguage] = useState('ja');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <LanguageSelector value={language} onChange={handleLanguageChange} />
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <Routes>
              <Route path="/" element={<PhotoUpload />} />
              <Route path="/generate" element={<PoemGenerator />} />
              <Route path="/character" element={<CharacterForm />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Box>
          <Advertisement />
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 