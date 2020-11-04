import { useState, useEffect } from "react";
import Projects from "../constants/projects";

export const useFetchAllProjects = () => {
  const [allProjects, setAllProjects] = useState([]);

  // TODO have it fetch from remote server
  useEffect(() => {
    setAllProjects(Projects);
  }, []);

  return allProjects;
};

export const useFetchProjectByName = (name) => {
  const _project = Projects.filter((p) => p.name === name);

  return _project[0];
};
