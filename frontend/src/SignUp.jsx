import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const { username, password, email } = formData;
  
    try {
      // Send the signup request to the backend
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }), 
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("User created successfully:", result);
  
        if (result.token) {
          localStorage.setItem("token", result.token);
          console.log("Token saved:", result.token);
        }
  
        event.target.reset();
        navigate("/Dashboard");
      } else {
        console.error("Signup failed:", result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
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
          Sign Up
        </h1>
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-gray-600 font-medium"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 shadow-lg transform hover:scale-105 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
