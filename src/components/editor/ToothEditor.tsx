import { Box, Typography, Slider, Button, Divider } from '@mui/material';
import { useStore } from '../../store/useStore';
import { DEFAULT_MOVEMENT } from '../../types/dental';
import type { ToothMovement } from '../../types/dental';

interface SliderConfig {
  label: string;
  field: keyof ToothMovement;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const SLIDER_CONFIGS: SliderConfig[] = [
  { label: 'Mesiodistal', field: 'mesiodistal', min: -5, max: 5, step: 0.1, unit: 'mm' },
  { label: 'Buccolingual', field: 'buccolingual', min: -5, max: 5, step: 0.1, unit: 'mm' },
  { label: 'Intrusion / Extrusion', field: 'intrusionExtrusion', min: -5, max: 5, step: 0.1, unit: 'mm' },
  { label: 'Tipping', field: 'tipping', min: -30, max: 30, step: 0.5, unit: '°' },
  { label: 'Torque', field: 'torque', min: -30, max: 30, step: 0.5, unit: '°' },
  { label: 'Rotation', field: 'rotation', min: -30, max: 30, step: 0.5, unit: '°' },
];

export function ToothEditor() {
  const selectedToothId = useStore((s) => s.selectedToothId);
  const currentStep = useStore((s) => s.currentStep);
  const plan = useStore((s) => s.plan);
  const updateMovement = useStore((s) => s.updateMovement);

  const movement: ToothMovement = {
    ...DEFAULT_MOVEMENT,
    ...(selectedToothId
      ? (plan.steps[currentStep]?.movements[selectedToothId] ?? {})
      : {}),
  };

  const handleChange = (field: keyof ToothMovement) => (_: Event, value: number | number[]) => {
    if (!selectedToothId) return;
    updateMovement(selectedToothId, currentStep, { [field]: value as number });
  };

  const handleReset = () => {
    if (!selectedToothId) return;
    updateMovement(selectedToothId, currentStep, { ...DEFAULT_MOVEMENT });
  };

  if (!selectedToothId) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Click a tooth in the viewer to edit its movements
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom>
        Tooth {selectedToothId}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {SLIDER_CONFIGS.map(({ label, field, min, max, step, unit }) => (
        <Box key={field} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="caption" color="primary">
              {movement[field].toFixed(1)}{unit}
            </Typography>
          </Box>
          <Slider
            value={movement[field]}
            min={min}
            max={max}
            step={step}
            onChange={handleChange(field)}
            size="small"
            sx={{ color: 'primary.main' }}
          />
        </Box>
      ))}

      <Button
        variant="outlined"
        size="small"
        onClick={handleReset}
        fullWidth
        sx={{ mt: 1 }}
      >
        Reset Tooth
      </Button>
    </Box>
  );
}
