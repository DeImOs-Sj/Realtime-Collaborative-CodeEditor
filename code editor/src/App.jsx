import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Editor from './Components/Editor';
import Login from './Components/Login';
import EditorPage from './Components/EditorPage';
import Signup from './Components/Signup';
import CreateRoom from './Components/CreateRoom';
import Toaster from "react-hot-toast"
import Sidebar from './Components/EditorPage';
// import ACTIONS from './Components/Actions.js';

function App() {
  return (
    <>
      {/* <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      /> */}

      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createRoom" element={<CreateRoom />} />

          <Route path="/editor/:roomId" element={<EditorPage />} />

          <Route path="/" element={<Navigate to="/signup" />} />
        </Routes>
      </Router>

    </>



  );
}

export default App;
