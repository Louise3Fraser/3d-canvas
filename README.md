# Canvas3D: Model Tree and 3D View

## Core Features

- **Add Primitives**: `box`, `sphere`, `cylinder`, `cone`, `torus`, `capsule`
- **Transform Controls**: You may translate, rotate, and scale the primitives
- **Nested Hierarchy**: Groups, children, collapse/expand
- **Drag & Drop Tree**: Full subtree movement
- **Templates Gallery**: Some pre-created templates! (`Pumpkin`, `Donut`, etc.)
- **Smart Placement**: New primitives are never placed on top of other primitives
- **Properties Panel**: Edit colors, transform primitive, delete/duplicate item
- **Camera control**: You can fully move around the canvas
- **Toolbar**: Add shapes, show/hide grid, recenter item, toggle between translate/rotate, delete canvas
- **Export**: Export the .json version of your creation
- **Theme**: Change the background color
- **Type-Safe**: Full TypeScript

#### Some features I didn't get to but plan on adding:

- **Light/dark mode**
- **History (undo/redo)**
- **Multi-select items**
- **Adding more primitives!**

---

## Tech Stack

- React + TypeScript
- React Three Fiber + Drei
- Tailwind CSS
- DndKit
- Framer Motion
- Lucide Icons

---

## Running the app locally

#### 1. Clone & Install

```bash
git clone https://github.com/Louise3Fraser/canvas-3d.git
cd canvas-3d
npm install
```

#### 2. Run Dev Server

```bash
npm run dev
```

Open in localhost.

---
