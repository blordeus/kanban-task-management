import { useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { BoardView } from "./components/board/board-view";
import { boardData } from "./data/boards";

function App() {
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);

  return (
    <AppShell
      boards={boardData.boards}
      activeBoardIndex={activeBoardIndex}
      onBoardChange={setActiveBoardIndex}
    >
      <BoardView board={boardData.boards[activeBoardIndex]} />
    </AppShell>
  );
}

export default App;