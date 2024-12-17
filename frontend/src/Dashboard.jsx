import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [error, setError] = useState("");
  const [timeWhenLogin, setTimeWhenLogin] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token exists
        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("User data:", data);

        if (data && data.iat) {
          const loginTime = new Date(data.iat * 1000); 
          const hours = loginTime.getHours() % 12 || 12;
          const minutes = String(loginTime.getMinutes()).padStart(2, "0"); 
          const amPm = loginTime.getHours() >= 12 ? "PM" : "AM";
          const formattedTime = `${hours}:${minutes} ${amPm}`;

          setTimeWhenLogin(formattedTime);
        } else {
          console.error("Invalid or missing `iat` value in response.");
        }

        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  const Logout = () => {
    // Confirm logout before proceeding
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      setUser(null);
      setError("");
      window.location.href = "/";
      }
    }
  return (
    <div className="bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 min-h-screen p-8">
      <nav className="bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-white font-semibold">Dashboard</h2>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-white hover:text-teal-300">Home</a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-teal-300">Your email: {user.email}</a>
            </li>
            <li>
              <a href={"#"} onClick={() => Logout()} className="text-white hover:text-teal-300">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="h-[72vh]">
      <main className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        <section className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
          <p className="text-gray-600">Username: <strong>{user.username || "Loading..."}</strong></p>
          <p className="text-gray-600">Email: <strong>{user.email || "Loading..."}</strong></p>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="text-gray-600">
            <li>{user.username} logged in at {timeWhenLogin || "Loading..."}</li>
          </ul>
        </section>
      </main>
      </div>

      <footer className="text-center mt-8 text-white">
        <p className="text-lg">&copy; 2024 Syed Muhib Farooq. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
