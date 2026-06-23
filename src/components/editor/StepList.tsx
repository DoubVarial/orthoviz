import { Box, Typography, List, ListItemButton, ListItemText, IconButton, Button, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../../store/useStore';

export function StepList() {
  const plan = useStore((s) => s.plan);
  const currentStep = useStore((s) => s.currentStep);
  const setCurrentStep = useStore((s) => s.setCurrentStep);
  const addStep = useStore((s) => s.addStep);
  const removeStep = useStore((s) => s.removeStep);

  return (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Steps
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addStep}
          variant="outlined"
        >
          Add
        </Button>
      </Box>
      <List dense disablePadding>
        {plan.steps.map((_, index) => (
          <ListItemButton
            key={index}
            selected={index === currentStep}
            onClick={() => setCurrentStep(index)}
            sx={{
              pl: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.dark',
                '&:hover': { backgroundColor: 'primary.dark' },
              },
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body2">
                  Step {index + 1}
                  {index === currentStep && (
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: 'primary.light' }}>
                      ← current
                    </Typography>
                  )}
                </Typography>
              }
            />
            {plan.steps.length > 1 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeStep(index);
                }}
                sx={{ color: 'text.secondary' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
