import { Link } from "react-router-dom";

export const ProjectCard = ({ project }) => {
  return (
    <div
      className="
      bg-white
      dark:bg-slate-800
      border
      border-gray-200
      dark:border-slate-700
      rounded-xl
      p-5
      shadow-sm
      hover:shadow-md
      transition
      "
    >
      <h3 className="font-semibold text-lg mb-3">
        {project.name}
      </h3>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{
            width: `${project.progress}%`,
          }}
        />
      </div>

      <Link to={`/projects/${project.id}`}>
        <button
          className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-md
          text-sm
          hover:bg-blue-700
          transition
          "
        >
          Open
        </button>
      </Link>
    </div>
  );
};