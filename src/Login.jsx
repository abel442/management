import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      
      <div className="w-100 bg-white p-6 rounded-lg shadow-lg">
        
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form className="space-y-4">

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-md p-2"
            />
          </div>

          <button
            className="w-full bg-black text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;