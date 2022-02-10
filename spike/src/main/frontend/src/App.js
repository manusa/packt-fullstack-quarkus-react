import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {Home} from './Home';
import {Login} from './auth';
import {Users} from './users';

const App = () => (
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route exact path="/login" element={<Login />} />
    <Route exact path="/users" element={<Users />} />
  </Routes>
);

export default App;
