import { useRef, useEffect, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { extractToothFrame, applyToothMovement } from '../../lib/toothCoords';
import { DEFAULT_MOVEMENT } from '../../types/dental';
import type { ToothId, ToothMovement } from '../../types/dental';

interface ToothMeshProps {
  id: ToothId;
}

export function ToothMesh({ id }: ToothMeshProps) {
  const { scene } = useGLTF(`/models/tooth-${id}.glb`);

  const groupRef = useRef<THREE.Group>(null);

  const setToothFrame = useStore((s) => s.setToothFrame);
  const setSelectedTooth = useStore((s) => s.setSelectedTooth);
  const selectedToothId = useStore((s) => s.selectedToothId);
  const plan = useStore((s) => s.plan);
  const currentStep = useStore((s) => s.currentStep);
  const stepProgress = useStore((s) => s.stepProgress);

  // Clone scene so each tooth has its own material/transform
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Extract and register the tooth frame once the scene is loaded
  useEffect(() => {
    const frame = extractToothFrame(clonedScene);
    setToothFrame(id, frame);
  }, [clonedScene, id, setToothFrame]);

  // Apply/remove emissive highlight based on selection
  useEffect(() => {
    const isSelected = selectedToothId === id;
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = child.material;
      }
      if (isSelected) {
        const mat = (child.userData.originalMaterial as THREE.MeshStandardMaterial).clone();
        mat.emissive = new THREE.Color(0x0044ff);
        mat.emissiveIntensity = 0.4;
        child.material = mat;
      } else {
        child.material = child.userData.originalMaterial;
      }
    });
  }, [selectedToothId, id, clonedScene]);

  // Animate: interpolate between current and next step movements
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const state = useStore.getState();
    const frame = state.toothFrames[id];
    if (!frame) return;

    const steps = state.plan.steps;
    const curMovement: ToothMovement = {
      ...DEFAULT_MOVEMENT,
      ...(steps[state.currentStep]?.movements[id] ?? {}),
    };
    const nextStep = state.currentStep + 1;
    const nextMovement: ToothMovement = {
      ...DEFAULT_MOVEMENT,
      ...(nextStep < steps.length ? (steps[nextStep]?.movements[id] ?? {}) : {}),
    };

    const p = state.stepProgress;
    const interpolated: ToothMovement = {
      mesiodistal: THREE.MathUtils.lerp(curMovement.mesiodistal, nextMovement.mesiodistal, p),
      buccolingual: THREE.MathUtils.lerp(curMovement.buccolingual, nextMovement.buccolingual, p),
      intrusionExtrusion: THREE.MathUtils.lerp(curMovement.intrusionExtrusion, nextMovement.intrusionExtrusion, p),
      tipping: THREE.MathUtils.lerp(curMovement.tipping, nextMovement.tipping, p),
      torque: THREE.MathUtils.lerp(curMovement.torque, nextMovement.torque, p),
      rotation: THREE.MathUtils.lerp(curMovement.rotation, nextMovement.rotation, p),
    };

    applyToothMovement(group, frame, interpolated, 1);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedTooth(id);
  };

  // suppress unused-variable warnings for reactive store subscriptions
  void plan;
  void currentStep;
  void stepProgress;

  return (
    <group ref={groupRef} onClick={handleClick}>
      <primitive object={clonedScene} />
    </group>
  );
}
