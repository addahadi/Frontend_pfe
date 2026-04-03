import { useEffect, useState } from "react";
import { mockProjects } from "../mocks/user.mock";

export const useUserDashboard = () => {

  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setProjects(mockProjects);

    setProfile({
      name: "Abdelhak",
      email: "abdelhak@email.com",
      phone: "0550000000",
      company: "Construction"
    });

    setLoading(false);

  }, []);

  return {
    projects,
    profile,
    loading,
  };

};