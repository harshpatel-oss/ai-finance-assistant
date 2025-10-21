import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
   const Navigate = useNavigate();
 
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <p>Welcome to your finance dashboard! 🚀</p>
    </div>
  );
}

export default Home;
