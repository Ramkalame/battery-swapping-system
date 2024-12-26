import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './SideBar.css'

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPathSelected = (paths) => paths.includes(location.pathname);

    const menuItems = [
        { text: "Dashboard", icon: "bi-grid-1x2-fill", paths: ['/dashboard'] },
        { text: "Locations", icon: "bi-geo-alt", paths: ['/stations'] }
    ]

    return (

        <div className='d-flex flex-column gap-4 pt-5' style={{marginLeft:"1em"}}>
            {menuItems.map((item, index) => (
                <div className='d-flex flex-row gap-3 align-items-center ' key={index} onClick={() => navigate(item.paths[0])}>
                    <i className={`bi ${item.icon} ${isPathSelected(item.paths) ? "icon-click" : ""} icon-size`}></i>
                    <span className={`${isPathSelected(item.paths) ? "icon-click" : ""} items`}>{item.text}</span>
                </div>
            ))}
        </div>
    )
}

export default SideBar