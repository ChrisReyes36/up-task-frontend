import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteProject, getProjects } from "@/api/ProjectAPI";

export default function DashboardView() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading) return "Cargando...";

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">Mis Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Maneja y administra tus proyectos
        </p>

        <nav className="my-5">
          <Link
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to="/projects/create"
          >
            Nuevo Proyecto
          </Link>
        </nav>

        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white shadow-inner hover:bg-gray-700">
                      <span>Opciones</span>
                      <EllipsisVerticalIcon
                        className="h-5 w-5 text-white/60"
                        aria-hidden="true"
                      />
                    </MenuButton>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-xl border border-gray-900/5 bg-white p-1 text-sm shadow-lg focus:outline-none
                        transition duration-100 ease-out
                        data-[closed]:scale-95 data-[closed]:opacity-0
                        data-[enter]:ease-out data-[enter]:duration-100
                        data-[leave]:ease-in data-[leave]:duration-75"
                    >
                      <MenuItem>
                        {({ focus }) => (
                          <Link
                            to={`/projects/${project._id}`}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-gray-900 ${
                              focus ? "bg-gray-100" : ""
                            }`}
                          >
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                            Ver Proyecto
                          </Link>
                        )}
                      </MenuItem>

                      <MenuItem>
                        {({ focus }) => (
                          <Link
                            to={`/projects/${project._id}/edit`}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-gray-900 ${
                              focus ? "bg-gray-100" : ""
                            }`}
                          >
                            <PencilIcon className="h-4 w-4 text-gray-400" />
                            Editar Proyecto
                          </Link>
                        )}
                      </MenuItem>

                      <div className="my-1 h-px bg-gray-900/5" />

                      <MenuItem>
                        {({ focus }) => (
                          <button
                            type="button"
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-red-500 ${
                              focus ? "bg-red-50" : ""
                            }`}
                            onClick={() => mutate(project._id)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-400" />
                            Eliminar Proyecto
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">
            No hay proyecto aún{" "}
            <Link to="/projects/create" className="text-fuchsia-500 font-bold">
              Crear Proyecto
            </Link>
          </p>
        )}
      </>
    );
}
