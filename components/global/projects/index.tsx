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
          src={
            project?.thumbnail ||
            "https://images.unsplash.com/photo-1761026532879-0b5301cca459?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1033"
          }
        />
      ))}
    </motion.div>
  );
}
