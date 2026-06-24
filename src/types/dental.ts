import * as THREE from 'three';

// ISO-3950 tooth IDs: "11"–"18", "21"–"28", "31"–"38", "41"–"48"
export type ToothId = string;

// Local orthodontic coordinate frame, extracted from GLB mesh at load time
export interface ToothFrame {
  origin: THREE.Vector3;   // geometric center (bounding box center)
  longAxis: THREE.Vector3; // intrusion/extrusion direction (longest axis)
  mdAxis: THREE.Vector3;   // mesiodistal axis (second axis, along arch)
  blAxis: THREE.Vector3;   // buccolingual axis (cross product of longAxis × mdAxis)
}

// 6-DOF movement delta in tooth-local coordinates
export interface ToothMovement {
  mesiodistal: number;         // mm
  buccolingual: number;        // mm
  intrusionExtrusion: number;  // mm
  tipping: number;             // degrees (rotation around blAxis)
  torque: number;              // degrees (rotation around mdAxis)
  rotation: number;            // degrees (rotation around longAxis)
}

export interface TreatmentStep {
  movements: Record<ToothId, Partial<ToothMovement>>;
}

export interface TreatmentPlan {
  steps: TreatmentStep[];
}

export const UPPER_TEETH: ToothId[] = [
  '11','12','13','14','15','16','17','18',
  '21','22','23','24','25','26','27','28',
];

export const LOWER_TEETH: ToothId[] = [
  '31','32','33','34','35','36','37','38',
  '41','42','43','44','45','46','47','48',
];

const QUADRANT_NAMES: Record<string, string> = {
  '1': 'Upper Right',
  '2': 'Upper Left',
  '3': 'Lower Left',
  '4': 'Lower Right',
};

const TOOTH_TYPE_NAMES: Record<string, string> = {
  '1': 'Central Incisor',
  '2': 'Lateral Incisor',
  '3': 'Canine',
  '4': 'First Premolar',
  '5': 'Second Premolar',
  '6': 'First Molar',
  '7': 'Second Molar',
  '8': 'Third Molar',
};

export function getToothName(id: ToothId): string {
  const quadrant = id[0];
  const position = id[1];
  const quadrantName = QUADRANT_NAMES[quadrant] ?? '';
  const typeName = TOOTH_TYPE_NAMES[position] ?? '';
  return `${quadrantName} ${typeName}`.trim();
}

export const DEFAULT_MOVEMENT: ToothMovement = {
  mesiodistal: 0,
  buccolingual: 0,
  intrusionExtrusion: 0,
  tipping: 0,
  torque: 0,
  rotation: 0,
};
