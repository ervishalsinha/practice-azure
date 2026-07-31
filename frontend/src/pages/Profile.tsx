import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/profile")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setError("Unable to load profile. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (!user) {
    return <p>{error || "No profile available."}</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "80px auto" }}>
      <h1>Profile</h1>
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <button
        onClick={handleLogout}
        style={{ marginTop: "24px", padding: "10px 16px", fontSize: "16px" }}
      >
        Log Out
      </button>
    </div>
  );
}
