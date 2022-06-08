import React, { useState, useEffect } from 'react';
import Listbox from './Listbox';
import Dropdown from "./Dropdown";
import Detail from './Detail';
import { Info } from './Info';
import SideBar from './sidebar'
import MainPage from './MainPage'
import GetToken from './getToken'
import useAuth from './useAuth'
import axios from 'axios';

const App = () => {
      const token = useAuth()
      if (token) localStorage.token = token
  return (
    <div className="mainApp">
      <SideBar />
      <MainPage />
    </div>

  );
}

export default App;
