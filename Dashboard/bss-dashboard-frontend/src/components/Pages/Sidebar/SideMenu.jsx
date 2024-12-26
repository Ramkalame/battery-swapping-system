import React from 'react';
import './SideMenu.css';
import SideBar from './SideBar';


const SideMenu = () => {
   
   return (
      <div className="dashboard-container">
         <aside className="sidebar">
            <div className='logo d-flex align-items-center justify-content-center'>
               <span className='d-flex flex-row gap-2 align-items-center'>
                  <i className="bi bi-lightning-charge-fill"></i>
                  <span className='txt-clr'>EV</span>
                  <span className='txt-logo'>HUB</span>
               </span>
               <div className='logo-shadow'></div>
            </div>
            <SideBar />
         </aside>
      </div>
   );
};

export default SideMenu;
