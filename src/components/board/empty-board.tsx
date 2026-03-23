import { Button } from "../ui/button";

export function EmptyBoard() {
  return (
    <div className="flex min-h-[calc(100vh-97px)] flex-col items-center justify-center px-6 text-center">
      <p className="max-w-md text-lg font-bold text-medium-grey md:text-2xl">
        This board is empty. Create a new column to get started.
      </p>

      <Button className="mt-8">+ Add New Column</Button>
    </div>
  );
}