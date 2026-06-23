import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DentalArch } from './DentalArch';
import { UPPER_TEETH, LOWER_TEETH } from '../../types/dental';

export function ToothScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15] as [number, number, number], fov: 45 }}
      style={{ background: '#1a1a2e' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <OrbitControls enableDamping dampingFactor={0.05} />
      <DentalArch jaw="upper" toothIds={UPPER_TEETH} />
      <DentalArch jaw="lower" toothIds={LOWER_TEETH} />
    </Canvas>
  );
}
