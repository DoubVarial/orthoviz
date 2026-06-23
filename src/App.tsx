import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Box, Paper } from '@mui/material';
import { AppToolbar } from './components/toolbar/AppToolbar';
import { ToothScene } from './components/viewer/ToothScene';
import { ToothEditor } from './components/editor/ToothEditor';
import { StepList } from './components/editor/StepList';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fc3f7',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        {/* Top AppBar */}
        <AppBar position="static" elevation={2} sx={{ bgcolor: '#0d1f2d' }}>
          <Toolbar disableGutters sx={{ minHeight: '48px !important' }}>
            <AppToolbar />
          </Toolbar>
        </AppBar>

        {/* Main content: 3D viewer + side panel */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 3D Canvas — takes all remaining space */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <ToothScene />
          </Box>

          {/* Right panel: editor + step list */}
          <Paper
            elevation={4}
            square
            sx={{
              width: 300,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ToothEditor />
            <StepList />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
