import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { useParams, useSearchParams } from "react-router-dom";
import { deleteNote } from "@/api/NoteAPI";
import useAuth from "@/hooks/useAuth";
import type { Note } from "@/types";
import { formatDate } from "@/utils/utils";

type NoteDetailProps = {
  note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("viewTask")!;

  const { data, isLoading } = useAuth();
  const canDelete = useMemo(
    () => data?._id === note.createdBy._id,
    [data, note],
  );

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  if (isLoading) return "Cargando...";

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por:{" "}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>

      {canDelete && (
        <button
          type="button"
          className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
