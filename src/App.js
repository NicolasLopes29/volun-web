import React, { useState } from 'react';
import  './css/App.css';
import NavBar from './components/navbar';
import Logo from "./assets/img/logo.svg";
import Usuarios from './components/usuarios';
import Historico from './components/historico';
import Denuncias from './components/denuncias';
import Eventos from './components/eventos';

const Ap = () => {
  const [activeTab, setActiveTab] = useState('usuarios');

  let content;
  switch (activeTab) {
    case 'usuarios':
      content = <Usuarios />;
      break;
    case 'historico':
      content = <Historico />;
      break;
    case 'denuncias':
      content = <Denuncias />;
      break;
    case 'eventos':
      content = <Eventos />;
      break;
    default:
      content = <Usuarios />;
      break;
  }

  return (
    <div>
      <div className="header">
        <img src={Logo} alt="logo" className="logo" />
        <h1>Central</h1>
      </div>
      <div className='nav-bar'>
      <NavBar setActiveTab={setActiveTab} />
      <div>{content}</div>
      </div>
    </div>
  );
};

export default Ap;








    