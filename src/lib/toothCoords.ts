import * as THREE from 'three';
import type { ToothFrame, ToothMovement } from '../types/dental';

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

  // Apply translation from origin
  mesh.position
    .copy(frame.origin)
    .addScaledVector(frame.mdAxis, movement.mesiodistal * scale)
    .addScaledVector(frame.blAxis, movement.buccolingual * scale)
    .addScaledVector(frame.longAxis, movement.intrusionExtrusion * scale);

  // Apply rotations in tooth-local space
  const toRad = Math.PI / 180;

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

  mesh.quaternion.copy(qTipping).multiply(qTorque).multiply(qRotation);
}
