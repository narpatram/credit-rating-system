import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import theme from './theme';
import Navbar from './components/Navbar';
import MortgageForm from './components/MortgageForm';
import MortgageList from './components/MortgageList';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
              <Routes>
                <Route path="/" element={<MortgageForm />} />
                <Route path="/mortgages" element={<MortgageList />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 