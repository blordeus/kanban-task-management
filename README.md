# Kanban Task Management Web App

## Overview
A fully functional Kanban-style task management application built with React, TypeScript, and Tailwind CSS. This project allows users to create boards, manage columns, and organize tasks with subtasks in a clean, responsive, and interactive UI.

## Features
- Create, edit, and delete boards
- Add, rename, and remove columns
- Create, edit, and delete tasks
- Drag and drop tasks across columns
- Reorder tasks within columns
- Subtask tracking with completion state
- LocalStorage persistence (data persists after refresh)
- Light and dark theme toggle
- Responsive design (mobile, tablet, desktop)

## Tech Stack
- React (Vite)
- TypeScript
- Tailwind CSS
- dnd-kit (drag and drop)
- LocalStorage for persistence

## Folder Structure
src/
  components/
  pages/
  styles/
  data/
  utils/

## Key Implementation Details

### Data Model
- Boards contain columns
- Columns contain tasks
- Tasks reference columns by ID (not name)
- Subtasks are nested within tasks

### State Management
- Local state using React hooks
- Derived state for selected task (using task ID)
- Modal state separated from data state

### Drag and Drop
- Implemented with dnd-kit
- Supports:
  - Reordering tasks within a column
  - Moving tasks across columns
- Uses SortableContext and useSortable
- Handles edge cases like empty columns and drop positions

### Persistence
- Data stored in LocalStorage
- Boards, active board, and theme are persisted

## Accessibility
- Keyboard navigation supported
- Focus states included
- Semantic HTML used throughout
- Drag threshold prevents accidental interactions

## How to Run Locally
1. Clone the repository
2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

## Deployment
Recommended platforms:
- Vercel
- Netlify

## Screenshots
(Add screenshots here)
- Desktop view
- Mobile view
- Drag and drop interaction
- Task modal
- Board editor

## Lessons Learned
- Importance of separating UI state from data state
- Using IDs instead of names for stable relationships
- Managing complex modal flows cleanly
- Implementing drag-and-drop without overengineering
- Structuring scalable component architecture

## Future Improvements
- Drag overlay animations
- Backend integration (Supabase / Firebase)
- User authentication
- Real-time collaboration
- Activity history

## Author
Bryan Lordeus
