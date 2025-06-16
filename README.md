# Team Members Flow

A dynamic React application for visualizing and managing team structures using React Flow, Zustand, Tailwind CSS, and shadcn UI components.

## Tech Stack

- [React](https://reactjs.org/) — UI library
- [Vite](https://vitejs.dev/) — Build tool and development server
- [@xyflow/react](https://github.com/xyflow/react) — React Flow renderer
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) — Accessible UI components (Dialog, Button, Input)
- [UUID](https://github.com/uuidjs/uuid) — Unique ID generation

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```
4. **Start the development server**

   ```bash
   npm run dev
   ```

## Usage

- **Add Nodes**: Drag a sample member from the left sidebar and drop onto the canvas.
- **Connect Nodes**: Hover over a node, drag the connector handle to another node to link reporting lines.
- **Edit Member**: Click any node to open a modal and update the name.

## Project Structure

```
src/
├── components/
│   ├── custom/
│   │   ├── EditMemberModal.tsx    # Modal dialog for editing
│   │   └── TeamFlow.tsx           # Main flow and sidebar
│   └── ui/
│       ├── button.tsx            # Shadcn Button component
│       ├── dialog.tsx            # Shadcn Dialog component
│       └── input.tsx             # Shadcn Input component
├── lib/
│   ├── data.ts                   # Sample data definitions
│   └── utils.ts                  # Utility functions
├── store/
│   └── teamStore.ts              # Zustand store with persistence
├── types/
│   └── memberInterfaces.ts       # TypeScript interfaces for members
├── App.tsx                       # Entry point rendering TeamFlow
├── main.tsx                      # ReactDOM bootstrap
└── index.css                     # Tailwind directives
```


