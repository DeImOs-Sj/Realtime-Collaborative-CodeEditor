import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Editor from './Components/Editor';
import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import Signup from './Components/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
    // <div>
    //   {/* <Login /> */}
    //   {/* <Editor /> */}
    // </div>
  );
}

export default App;
