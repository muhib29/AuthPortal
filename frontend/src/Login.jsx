import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });

      localStorage.setItem("token", response.data.token);

      setError("");
      alert("Login successful!");
      navigate("/Dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div
    className="w-full h-screen flex items-center justify-center"
    style={{
      backgroundImage: "linear-gradient(to right, #ff7e5f, #feb47b)",
    }}
  >
    <div className="flex flex-col items-center justify-center bg-white p-8 sm:p-10 rounded-xl shadow-lg w-11/12 max-w-md">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
        Login
      </h1>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Username"
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-md font-medium hover:from-pink-600 hover:to-orange-600 transition duration-300"
        >
          Log In
        </button>
      </form>
      {error && <p   className="text-red-500 mt-4">{error}</p>}
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <a href="/SignUp" className="text-pink-500 hover:underline cursor-pointer">
          Sign Up
        </a>
      </p>
    </div>
  </div> 
  );
}
export default Login;
