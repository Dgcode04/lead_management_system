import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';
import theme from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
