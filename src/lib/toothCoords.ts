import * as THREE from 'three';
import type { ToothFrame, ToothMovement } from '../types/dental';

// GLB models use ~29.5mm per scene unit (measured: tooth-11 mesiodistal span = 0.288 units ≈ 8.5mm).
// Slider values are in mm → multiply by this factor to get scene units.
const UNITS_PER_MM = 0.288 / 8.5;

export function extractToothFrame(scene: THREE.Object3D): ToothFrame {
  const box = new THREE.Box3().setFromObject(scene);
  const origin = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // Determine axes based on bounding box dimensions
  // Longest dimension → longAxis (intrusion/extrusion, typically Y in dental models)
  // For GLB tooth models, Y is typically the long axis (crown to root)
  const dims = [
    { axis: new THREE.Vector3(1, 0, 0), size: size.x },
    { axis: new THREE.Vector3(0, 1, 0), size: size.y },
    { axis: new THREE.Vector3(0, 0, 1), size: size.z },
  ].sort((a, b) => b.size - a.size);

  const longAxis = dims[0].axis.clone();
  const mdAxis = dims[1].axis.clone();
  const blAxis = new THREE.Vector3().crossVectors(longAxis, mdAxis).normalize();

  return { origin, longAxis, mdAxis, blAxis };
}

export function applyToothMovement(
  mesh: THREE.Object3D,
  frame: ToothFrame,
  movement: ToothMovement,
  t: number,
): void {
  const scale = t;
  const toRad = Math.PI / 180;

  // Build combined rotation quaternion (tipping → torque → rotation)
  const qTipping = new THREE.Quaternion().setFromAxisAngle(
    frame.blAxis,
    movement.tipping * toRad * scale,
  );
  const qTorque = new THREE.Quaternion().setFromAxisAngle(
    frame.mdAxis,
    movement.torque * toRad * scale,
  );
  const qRotation = new THREE.Quaternion().setFromAxisAngle(
    frame.longAxis,
    movement.rotation * toRad * scale,
  );
  const combined = new THREE.Quaternion().copy(qTipping).multiply(qTorque).multiply(qRotation);
  mesh.quaternion.copy(combined);

  // To rotate around the tooth center (frame.origin in world space when group is at origin),
  // rather than around the group's local origin (0,0,0):
  // group.position = frame.origin - Q(frame.origin) + translation_delta
  const rotatedOrigin = frame.origin.clone().applyQuaternion(combined);
  mesh.position
    .copy(frame.origin)
    .sub(rotatedOrigin)
    .addScaledVector(frame.mdAxis, movement.mesiodistal * scale * UNITS_PER_MM)
    .addScaledVector(frame.blAxis, movement.buccolingual * scale * UNITS_PER_MM)
    .addScaledVector(frame.longAxis, movement.intrusionExtrusion * scale * UNITS_PER_MM);
}
