import React, { useState } from 'react'
import './Dashboard.css'
import LiveTrackingMap from './LiveTracking/LiveTrackingMap'
import ShopList from './List/ShopList'
import { useEffect } from 'react'
import Cards from '../common/Cards'
import DropdownComponent from './List/Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCustomers } from '../../Redux/Features/getAllCustomersSlice'
import { fetchShops } from '../../Redux/Features/getAllShopsSlice'
import { fetchBatteryTransactions } from '../../Redux/Features/getBatteryTransactionsSlice'; // Import battery transactions action

import { Button, Container, Dropdown } from 'react-bootstrap'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { fetchSellUnits } from '../../Redux/Features/getAllSellUnits'
import logo from '../../assets/Taboda.png'
import logo1 from '../../assets/iit_logo.jpeg'
import logo2 from "../../assets/images (10).jpeg"


const Dashboard = () => {

    const dispatch = useDispatch();
    const [selected, setSelected] = useState("All");
    const { data: seller } = useSelector((state) => state.sellUnits);
    const { shops } = useSelector((store) => store.shops);
    const { customers } = useSelector((store) => store.customers);
    const { transactions } = useSelector((store) => store.batteryTransactions); // Fetch battery transactions


    const [data, setData] = useState();

    const handleSelect = (type) => {
        if (selected == type) setSelected("All")
        else setSelected(type)
    };
    useEffect(() => {
        // Combine data based on selected filter
        if (selected === "All") setData([...seller, ...shops, ...customers, ...transactions]);
        else if (selected === "customer") setData([...customers]);
        else if (selected === "sell") setData([...seller]);
        else if (selected === "shop") setData([...shops]);
        else if (selected === "battery") setData([...transactions]); // Add battery filter
    }, [seller, shops, customers, transactions, selected]);


    useEffect(() => {
        // Fetch initial data
        dispatch(fetchCustomers());
        dispatch(fetchShops());
        dispatch(fetchSellUnits());
        dispatch(fetchBatteryTransactions());

        // Polling logic to fetch updated customer data every 5 seconds
        const interval = setInterval(() => {
            dispatch(fetchCustomers());
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [dispatch]);

    

    return (
        <>
            <div className='d-flex flex-column gap-3'>
                <div className='header'>
                    <div className='d-flex flex-row align-items-center justify-content-between mt-4'>
                        <div>
                            {/* <h5 className='sub-txt'>Pages / Dashboard</h5> */}
                            <h1 className='head-txt-1'>Dashboard</h1>
                        </div>
                        <div>
                            <h1 className='head-txt'>Battery Swapping Portal</h1>
                        </div>
                        <div className='img-section-wrapper'>

                        <p className='sub-txt-1'>Chhattisgarh State Renewable Energy Development Agency</p>


                        <div className='img-section-creda'>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={logo2} alt='CREDA-LOGO' />
                        </div>
                        {/* <div className='img-section-totoba'>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={logo} alt='TOTOBA-LOGO' />
                        </div>
                        <div className='img-section-iit'>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={logo1} alt='IIT-LOGO' />
                        </div> */}
                        </div>
                    </div>
                </div>
                <Cards seller={seller} shops={shops} customers={customers} transactions={transactions} handleSelect={handleSelect} currentSelected={selected} />

                <div className="map-cnt p-4 rounded" >
                    <div className="d-flex flex-row justify-content-between align-items-center mb-4 font-weight-bold">
                        <span className='map-title d-flex flex-row gap-3 align-items-center'>Live Tracking <div className='track-circle'></div></span>

                    </div>
                    {data?.length > 0 && <div><LiveTrackingMap data={data} /></div>}
                </div>
            </div>

            <DropdownComponent type={selected} />

        </>
    )
}

export default Dashboard