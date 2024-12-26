import React from 'react'
import './Cards.css'
import img1 from '../../assets/cards/cyper.png'
import img2 from '../../assets/cards/for.svg'
import img3 from '../../assets/cards/forNissan.svg'
import img4 from '../../assets/cards/ForTesla.svg'
import img5 from '../../assets/cards/GreenWeek.svg'
import img6 from '../../assets/cards/wantMore.svg'

const Cards = (props = {}) => {

    const cardsData = [
        { text: "Total Customers", subText: props?.customers?.length || 0, img: img1 ,type:"customer"},
        { text: "Total Swapping Station", subText: props?.shops?.length, img: img2,type:"shop" },
        { text: "Total E-Rickshaw Charging Slots", subText: "10", img: img3 },
        { text: "Total E-Bike Charging Slots", subText: "6", img: img3 },
        { text: "Total No. of Battery Transactions", subText: props?.transactions?.length||0, img: img3, type:"battery" },
        // { text: "Total Charging Seller", subText: props?.seller?.length || 0, img: img4 ,type:"sell"},
        // { text: "Live Charging Seller", subText: "45", img: img5 },
        { text: "Total App Downloads", subText: props?.shops?.length + props?.customers?.length || 0, img: img1 },
    ]

    return (

        <div className=''>
            <section className="stats-grid">
                {cardsData.map((item, index) => (
                    <div className={`stat-card card cmn-card ${props.currentSelected&&props.currentSelected===item.type?"active":""}`} key={index} onClick={()=>props.handleSelect(item.type)}>
                        <span className='title-txt'>{item.text}</span>
                        <span className="sub-txt">{item.subText}</span>
                        <img className='img-cls' src={item.img} alt='bacground-logo' />
                    </div>
                ))}
            </section>
        </div>
    )
}

export default Cards