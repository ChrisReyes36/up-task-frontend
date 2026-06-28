import { useDroppable } from "@dnd-kit/react";
import type { TaskStatus } from "@/types";

type DropTaskProps = {
  status: TaskStatus;
  canEdit: boolean;
};

export default function DropTask({ status, canEdit }: DropTaskProps) {
  const { ref, isDropTarget } = useDroppable({
    id: status,
    data: { status },
    disabled: !canEdit,
  });

  return (
    <div
      ref={ref}
      className={`text-xs font-semibold uppercase p-2 border border-dashed mt-5 grid place-content-center transition-colors ${
        isDropTarget
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-slate-500 text-slate-500"
      }`}
    >
      Soltar tarea aquí
    </div>
  );
}
