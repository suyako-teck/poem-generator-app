import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import PhotoUpload from './components/PhotoUpload';
import PoemGenerator from './components/PoemGenerator';
import CharacterForm from './components/CharacterForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PhotoUpload />} />
          <Route path="/generate" element={<PoemGenerator />} />
          <Route path="/character" element={<CharacterForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 