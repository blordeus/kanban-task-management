import { Button } from "../ui/button";

export function EmptyBoard() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)]">
      <p className="max-w-[500px] text-lg font-bold leading-tight text-medium-grey md:text-2xl">
        This board is empty. Create a new column to get started.
      </p>

      <Button className="mt-6 h-12 px-6 text-[15px] md:mt-8">
        + Add New Column
      </Button>
    </div>
  );
}