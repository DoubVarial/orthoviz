# OrthoViz

**Interactive 3D orthodontic treatment planning tool** built as a portfolio demo for Align Technology (Invisalign).

Visualize and plan tooth movements step-by-step in real time — directly in the browser, no plugins required.

**Live Demo:** https://\<your-username\>.github.io/orthoviz/

---

## Features

- **6-DOF tooth movement** — translate and rotate each tooth along all three axes (X, Y, Z) with millimeter-precise slider controls
- **Multi-step treatment animation** — add, remove, and navigate between treatment steps; animate the full sequence with play/pause
- **Upper / lower jaw toggle** — switch between maxillary and mandibular arch views
- **Reset View** — restore the default camera position with a single click
- **Editable numeric inputs** — click any slider value to type an exact number directly
- **ISO 3950 tooth notation** — internationally standardized two-digit tooth numbering used throughout the UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript |
| 3D rendering | Three.js, React Three Fiber, React Three Drei |
| UI components | Material UI (MUI) v9 |
| State management | Zustand |
| Build tool | Vite |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:

```bash
npm run build
```

---

## ISO 3950 Tooth Notation

OrthoViz uses the **ISO 3950 / FDI two-digit numbering system**, the international standard for identifying teeth:

- The **first digit** identifies the quadrant (1 = upper right, 2 = upper left, 3 = lower left, 4 = lower right)
- The **second digit** identifies the tooth within that quadrant (1 = central incisor → 8 = third molar)

**Example:** Tooth **21** = upper left central incisor (what most people call the "front tooth on the left side").

This notation is used by orthodontists and dental professionals worldwide and is the standard in Invisalign clinical workflows.

---

## Credits

The 3D tooth models are from [Permanent Dentition](https://sketchfab.com/3d-models/permanent-dentition-2f69d7b59c3e4a6a8bcae041bd8e591b) by **University of Dundee, School of Dentistry**, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

---

## Project Structure

```
src/
  components/       # React UI components (panels, sliders, controls)
  store/            # Zustand state (tooth positions, treatment steps)
  types/            # TypeScript interfaces
public/
  models/           # 3D tooth models (.glb)
```
