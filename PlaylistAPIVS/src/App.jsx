import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/styles.css";

const App = () => {
  const [currentUser, setCurrentUser] = React.useState(null);

  return (
    <Router>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router> 
  );
};

export default App;
