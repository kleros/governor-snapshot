import { useState, useEffect } from "react";
import Projects from "../constants/projects";

export const useFetchProjects = () => {
  const [allProjects, setAllProjects] = useState([]);

  // TODO have it fetch from remote server
  useEffect(() => {
    setAllProjects(Projects);
  }, []);

  return allProjects;
};
