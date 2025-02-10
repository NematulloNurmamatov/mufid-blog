import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar'; // Ensure correct import path
import Footer from './Components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
