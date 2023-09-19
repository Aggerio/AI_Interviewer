// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route,Routes } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Resume from './pages/Resume';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Resume/>} />
        <Route path="/login" element={<Login/>}>
          {/* <Login /> */}
        </Route>
        
      </Routes>
    </Router>
  );
};

export default AppRouter;
