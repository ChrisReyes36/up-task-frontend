import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import AddMemberModal from "@/components/team/AddMemberModal";
import { getProjectTeam, removeUserToProject } from "@/api/TeamAPI";

export default function ProjectTeamView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: removeUserToProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  if (isLoading) return "Cargando...";

  if (isError) return <Navigate to={"/404"} />;

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">Administra Equipo</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra el equipo de trabajo para este proyecto
        </p>

        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(`${location.pathname}?addMember=true`)}
          >
            Agregar Colaborador
          </button>

          <Link
            to={`/projects/${projectId}`}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          >
            Volver a Proyecto
          </Link>
        </nav>

        <h2 className="text-5xl font-black my-10">Miembros actuales</h2>
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data.map((member) => (
              <li
                key={member._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-2xl font-black text-gray-600">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900">
                      <EllipsisVerticalIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </MenuButton>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-xl border border-gray-900/5 bg-white p-1 text-sm shadow-lg focus:outline-none">
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              type="button"
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-red-500 ${
                                focus ? "bg-red-50" : ""
                              }`}
                              onClick={() =>
                                mutate({ projectId, id: member._id })
                              }
                            >
                              <TrashIcon className="h-4 w-4 text-red-400" />
                              Eliminar del Proyecto
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">No hay miembros en este equipo</p>
        )}

        <AddMemberModal />
      </>
    );
}
