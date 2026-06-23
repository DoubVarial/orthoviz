import { useStore } from '../../store/useStore';
import type { ToothId } from '../../types/dental';
import { ToothMesh } from './ToothMesh';

interface DentalArchProps {
  jaw: 'upper' | 'lower';
  toothIds: ToothId[];
}

export function DentalArch({ jaw, toothIds }: DentalArchProps) {
  const activeJaw = useStore((s) => s.activeJaw);

  const visible =
    activeJaw === 'both' ||
    (activeJaw === 'upper' && jaw === 'upper') ||
    (activeJaw === 'lower' && jaw === 'lower');

  if (!visible) return null;

  return (
    <>
      {toothIds.map((id) => (
        <ToothMesh key={id} id={id} />
      ))}
    </>
  );
}
