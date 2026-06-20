import { Link } from "react-router";

const Home = () => {
  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold">To‑Do List</h1>

      <p className="mt-2">Welcome — please log in or register to continue.</p>
      
      <div className="mt-4">
        <Link to="/login" className="mr-4 text-blue-600">
          Login
        </Link>

        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
