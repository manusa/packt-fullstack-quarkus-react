import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {Home} from './Home';
import {Users} from './users/Users';

const App = () => (
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route exact path="/users" element={<Users />} />
  </Routes>
);

export default App;
