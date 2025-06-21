import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TokenLoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Save token under "token" key to match your app's usage
      localStorage.setItem("token", token);

      // Optionally verify token by fetching tasks
      axios.get("http://localhost:3001/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Tasks loaded", res.data);
        navigate("/"); // Redirect to main app page
      })
      .catch((err) => {
        console.error("Token invalid or expired", err);
        alert("Login failed. Invalid or expired link.");
        navigate("/login"); // Redirect back to login page
      });
    } else {
      alert("No token provided.");
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default TokenLoginPage;
