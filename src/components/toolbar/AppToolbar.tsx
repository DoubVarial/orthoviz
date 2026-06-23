import { useEffect, useRef } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import HomeIcon from '@mui/icons-material/Home';
import { useStore } from '../../store/useStore';

export function AppToolbar() {
  const activeJaw = useStore((s) => s.activeJaw);
  const setActiveJaw = useStore((s) => s.setActiveJaw);
  const currentStep = useStore((s) => s.currentStep);
  const setCurrentStep = useStore((s) => s.setCurrentStep);
  const setStepProgress = useStore((s) => s.setStepProgress);
  const isPlaying = useStore((s) => s.isPlaying);
  const setPlaying = useStore((s) => s.setPlaying);
  const totalSteps = useStore((s) => s.plan.steps.length);
  const resetView = useStore((s) => s.resetView);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Auto-advance stepProgress while playing
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const STEP_DURATION_MS = 2000; // 2 seconds per step

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const state = useStore.getState();
      let newProgress = state.stepProgress + dt / STEP_DURATION_MS;

      if (newProgress >= 1) {
        const nextStep = state.currentStep + 1;
        if (nextStep >= state.plan.steps.length) {
          // End of plan
          setPlaying(false);
          setCurrentStep(0);
          return;
        }
        setCurrentStep(nextStep);
        newProgress = 0;
      } else {
        setStepProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, setPlaying, setCurrentStep, setStepProgress]);

  const handleJawChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) {
      setActiveJaw(value as 'upper' | 'lower' | 'both');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1,
        width: '100%',
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, mr: 2 }}>
        OrthoViz
      </Typography>

      {/* Jaw Toggle */}
      <ToggleButtonGroup
        value={activeJaw}
        exclusive
        onChange={handleJawChange}
        size="small"
        sx={{ '& .MuiToggleButton-root': { color: 'inherit', borderColor: 'rgba(255,255,255,0.3)' } }}
      >
        <ToggleButton value="upper">Upper</ToggleButton>
        <ToggleButton value="lower">Lower</ToggleButton>
        <ToggleButton value="both">Both</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ flex: 1 }} />

      {/* Step Navigation */}
      <IconButton size="small" onClick={handlePrev} disabled={currentStep === 0} color="inherit">
        <NavigateBeforeIcon />
      </IconButton>
      <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'center' }}>
        Step {currentStep + 1} / {totalSteps}
      </Typography>
      <IconButton size="small" onClick={handleNext} disabled={currentStep === totalSteps - 1} color="inherit">
        <NavigateNextIcon />
      </IconButton>

      {/* Play/Pause */}
      <IconButton
        size="small"
        onClick={() => setPlaying(!isPlaying)}
        color="inherit"
        title={isPlaying ? 'Pause' : 'Play all steps'}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      {/* Skip to end */}
      <IconButton
        size="small"
        onClick={() => setCurrentStep(totalSteps - 1)}
        color="inherit"
        title="Skip to last step"
      >
        <SkipNextIcon />
      </IconButton>

      {/* Reset View */}
      <IconButton
        size="small"
        onClick={resetView}
        color="inherit"
        title="Reset camera view"
      >
        <HomeIcon />
      </IconButton>
    </Box>
  );
}
