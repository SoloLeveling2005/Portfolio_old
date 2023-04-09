import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Header(props:{'page':string}) {
  let page = props.page
  let [user, authUser] = useState({})
  // function switchNavF (event:any) {
  //   console.log('switch')
  // }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);


  return (
    <section>
      <div className="Header">
        <section className='container py-3 d-flex justify-content-between align-items-center'>
          <Link to='/' className='fw-bold fs-4 text-decoration-none text-white'>HubAnywhere</Link>
        </section>
      </div>
      <Navbar page={`page`}/>
    </section>
    
  );
}

export default Header;
