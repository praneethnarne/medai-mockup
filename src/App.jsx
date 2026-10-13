import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Detect from "./pages/Detect.jsx";
import Result from "./pages/Result.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/detect" element={<Detect />} />
      <Route path="/result/:id" element={<Result />} />
    </Routes>
  );
}
