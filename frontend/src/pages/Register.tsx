import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.detail || "Email already registered.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 16px", fontSize: "16px" }}>
          Register
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
      <p style={{ marginTop: "24px" }}>
        Already have an account? <button onClick={() => navigate("/login")} style={{ color: "blue", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Log in</button>
      </p>
    </div>
  );
}
