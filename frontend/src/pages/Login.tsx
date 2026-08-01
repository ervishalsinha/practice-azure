import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/profile");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid emails or password. Please register iff you are not registered.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}> 
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
        <button
          type="submit"
          style={{ padding: "10px 16px", fontSize: "16px" }}
        >
          Log In
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
      <p style={{ marginTop: "24px" }}>
        Not registered yet? <button onClick={() => navigate("/register")} style={{ color: "blue", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Create an account</button>
      </p>
    </div>
  );
}
