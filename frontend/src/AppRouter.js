// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route,Routes } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Resume from './pages/Resume';
import Stage1 from './pages/Stage1';
import Stage2 from './pages/Stage2';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Resume/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/stage-1" element={<Stage1/>}/>
        <Route path="/stage-2" element={<Stage2/>}/>
        
      </Routes>
    </Router>
  );
};

export default AppRouter;
