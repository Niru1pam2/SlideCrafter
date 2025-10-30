import { containerVariants } from "@/lib/constants";
import { Project } from "@/lib/generated/prisma/client";
import { motion } from "framer-motion";
import ProjectCard from "../project-card";

type Props = {
  projects: Project[];
};

export default function Projects({ projects }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {projects.map((project, idx) => (
        <ProjectCard
          key={idx}
          projectId={project?.id}
          title={project?.title}
          createdAt={project?.createdAt}
          isDelete={project?.isDeleted}
          slideData={project?.slides}
          themeName={project?.themeName}
        />
      ))}
    </motion.div>
  );
}
