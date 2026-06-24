import { useState } from 'react';
import { Box, Typography, Slider, Button, Divider, TextField, InputAdornment } from '@mui/material';
import { useStore } from '../../store/useStore';
import { DEFAULT_MOVEMENT, getToothName } from '../../types/dental';
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

interface SliderRowProps extends SliderConfig {
  value: number;
  onSliderChange: (_: Event, value: number | number[]) => void;
  onCommit: (value: number) => void;
}

function SliderRow({ label, min, max, step, unit, value, onSliderChange, onCommit }: SliderRowProps) {
  // null = not editing (show live store value); string = user is typing
  const [editText, setEditText] = useState<string | null>(null);
  const displayValue = editText ?? value.toFixed(1);

  const commit = () => {
    if (editText !== null) {
      const parsed = parseFloat(editText);
      if (!isNaN(parsed)) {
        onCommit(Math.max(min, Math.min(max, parsed)));
      }
      setEditText(null);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <TextField
          value={displayValue}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setEditText(null);
          }}
          size="small"
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.secondary">
                    {unit}
                  </Typography>
                </InputAdornment>
              ),
            },
            htmlInput: {
              style: { textAlign: 'right', padding: '2px 4px', fontSize: '0.75rem', width: '36px' },
            },
          }}
          sx={{ width: 80 }}
        />
      </Box>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onSliderChange}
        size="small"
        sx={{ color: 'primary.main' }}
      />
    </Box>
  );
}

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

  const handleSliderChange = (field: keyof ToothMovement) => (_: Event, value: number | number[]) => {
    if (!selectedToothId) return;
    updateMovement(selectedToothId, currentStep, { [field]: value as number });
  };

  const handleInputCommit = (field: keyof ToothMovement) => (value: number) => {
    if (!selectedToothId) return;
    updateMovement(selectedToothId, currentStep, { [field]: value });
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
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Tooth {selectedToothId}
      </Typography>
      <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
        {getToothName(selectedToothId)}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {SLIDER_CONFIGS.map((config) => (
        <SliderRow
          key={config.field}
          {...config}
          value={movement[config.field]}
          onSliderChange={handleSliderChange(config.field)}
          onCommit={handleInputCommit(config.field)}
        />
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
