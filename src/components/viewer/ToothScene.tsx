import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { DentalArch } from './DentalArch';
import { UPPER_TEETH, LOWER_TEETH } from '../../types/dental';
import { useStore } from '../../store/useStore';

export function ToothScene() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const resetViewToken = useStore((s) => s.resetViewToken);

  useEffect(() => {
    if (resetViewToken > 0) controlsRef.current?.reset();
  }, [resetViewToken]);

  return (
    <Canvas
      camera={{ position: [0, 0.3, 3] as [number, number, number], fov: 45 }}
      style={{ background: '#1a1a2e' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0.3, 0.8] as [number, number, number]}
      />
      <DentalArch jaw="upper" toothIds={UPPER_TEETH} />
      <DentalArch jaw="lower" toothIds={LOWER_TEETH} />
    </Canvas>
  );
}
