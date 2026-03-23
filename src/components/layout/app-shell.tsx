import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import { SidebarToggle } from "./sidebar-toggle";
import { MobileBoardMenu } from "./mobile-board-menu";
import { TaskModal } from "../board/task-modal";
import { AddEditTaskModal } from "../board/add-edit-task-modal";
import { AddEditBoardModal } from "../board/add-edit-board-modal";
import { DeleteModal } from "../ui/delete-modal";
import type { Board, Task } from "../../types/board";
import type { EditableColumnInput } from "../board/add-edit-board-modal";

type AppShellProps = {
  boards: Board[];
  activeBoardIndex: number;
  activeBoardName: string;
  activeBoard: Board;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  selectedTask: Task | null;
  isAddTaskOpen: boolean;
  isAddBoardOpen: boolean;
  isEditBoardOpen: boolean;
  isDeleteBoardOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  onBoardChange: (index: number) => void;
  onHideSidebar: () => void;
  onShowSidebar: () => void;
  onSelectTask: (task: Task | null) => void;
  onCloseTaskModal: () => void;
  onOpenAddTask: () => void;
  onCloseAddTask: () => void;
  onOpenAddBoard: () => void;
  onCloseAddBoard: () => void;
  onOpenEditBoard: () => void;
  onCloseEditBoard: () => void;
  onOpenDeleteBoard: () => void;
  onCloseDeleteBoard: () => void;
  onCreateBoard: (name: string, columns: EditableColumnInput[]) => void;
  onUpdateBoard: (name: string, columns: EditableColumnInput[]) => void;
  onCreateTask: (input: {
    title: string;
    description: string;
    statusColumnId: string;
    subtasks: string[];
  }) => void;
  onDeleteBoard: () => void;
  onOpenNewColumn: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onChangeTaskStatus: (taskId: string, columnId: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AppShell({
  boards,
  activeBoardIndex,
  activeBoardName,
  activeBoard,
  isSidebarOpen,
  isMobileMenuOpen,
  selectedTask,
  isAddTaskOpen,
  isAddBoardOpen,
  isEditBoardOpen,
  isDeleteBoardOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onBoardChange,
  onHideSidebar,
  onShowSidebar,
  onCloseTaskModal,
  onOpenAddTask,
  onCloseAddTask,
  onOpenAddBoard,
  onCloseAddBoard,
  onOpenEditBoard,
  onCloseEditBoard,
  onOpenDeleteBoard,
  onCloseDeleteBoard,
  onCreateBoard,
  onUpdateBoard,
  onCreateTask,
  onDeleteBoard,
  onToggleSubtask,
  onChangeTaskStatus,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, onCloseMobileMenu]);

  useEffect(() => {
    setIsBoardMenuOpen(false);
  }, [activeBoardIndex, selectedTask]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        {isSidebarOpen && (
          <Sidebar
            boards={boards}
            activeBoardIndex={activeBoardIndex}
            onBoardChange={onBoardChange}
            onHideSidebar={onHideSidebar}
            onOpenAddBoard={onOpenAddBoard}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col bg-[var(--app-bg)]">
          <AppHeader
            boardName={activeBoardName}
            isSidebarOpen={isSidebarOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            isBoardMenuOpen={isBoardMenuOpen}
            canAddTask={activeBoard.columns.length > 0}
            onToggleMobileMenu={onToggleMobileMenu}
            onToggleBoardMenu={() => setIsBoardMenuOpen((prev) => !prev)}
            onCloseBoardMenu={() => setIsBoardMenuOpen(false)}
            onOpenAddTask={onOpenAddTask}
            onOpenEditBoard={onOpenEditBoard}
            onOpenDeleteBoard={onOpenDeleteBoard}
          />
          <main className="min-w-0 flex-1 overflow-hidden bg-[var(--app-bg)]">
            {children}
          </main>
        </div>
      </div>

      {!isSidebarOpen && <SidebarToggle onShowSidebar={onShowSidebar} />}

      <MobileBoardMenu
        boards={boards}
        activeBoardIndex={activeBoardIndex}
        isOpen={isMobileMenuOpen}
        onClose={onCloseMobileMenu}
        onBoardChange={onBoardChange}
        onOpenAddBoard={onOpenAddBoard}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {selectedTask ? (
        <TaskModal
          task={selectedTask}
          statusOptions={activeBoard.columns.map((column) => ({
            value: column.id,
            label: column.name,
          }))}
          onClose={onCloseTaskModal}
          onToggleSubtask={onToggleSubtask}
          onChangeStatus={onChangeTaskStatus}
        />
      ) : null}

      {isAddTaskOpen ? (
        <AddEditTaskModal
          statusOptions={activeBoard.columns.map((column) => ({
            value: column.id,
            label: column.name,
          }))}
          onClose={onCloseAddTask}
          onSubmit={onCreateTask}
        />
      ) : null}

      {isAddBoardOpen ? (
        <AddEditBoardModal
          mode="add"
          title="Add New Board"
          submitLabel="Create New Board"
          initialColumns={[{ id: "", name: "" }]}
          onClose={onCloseAddBoard}
          onSubmit={onCreateBoard}
        />
      ) : null}

      {isEditBoardOpen ? (
        <AddEditBoardModal
          mode="edit"
          title="Edit Board"
          submitLabel="Save Changes"
          initialName={activeBoard.name}
          initialColumns={activeBoard.columns.map((column) => ({
            id: column.id,
            name: column.name,
          }))}
          onClose={onCloseEditBoard}
          onSubmit={onUpdateBoard}
        />
      ) : null}

      {isDeleteBoardOpen ? (
        <DeleteModal
          title="Delete this board?"
          description={`Are you sure you want to delete the ‘${activeBoard.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
          onCancel={onCloseDeleteBoard}
          onConfirm={onDeleteBoard}
        />
      ) : null}
    </div>
  );
}
