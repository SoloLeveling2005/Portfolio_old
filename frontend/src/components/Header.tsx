import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Header() {
  
  let [user, authUser] = useState({})
  // function switchNavF (event:any) {
  //   console.log('switch')
  // }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);


  return (
    <div className="Header">
      
      <section className='container py-2 d-flex justify-content-between align-items-center'>
        <Link to='/' className='fs-4 text-decoration-none text-white'>HubAnywhere</Link>
        <div>
          {/* <img src="/img/day-and-night-white.png" alt="" className='img-small-19-24 cursor-pointer ms-4' /> */}
          <Link to={`/settings`} className='fs-4 text-decoration-none text-white'><img src="/img/settings-white.png" alt="Настройки" title='Настройки' className='img-small-24 cursor-pointer ms-4' /></Link>
          <Link to={`/profile`} className='fs-4 text-decoration-none text-white'><img src="/img/user2-white.png" alt="Профиль" title='Профиль' className='img-small-24 cursor-pointer ms-4'/></Link>
         <img src="/img/logout-white.png" alt="Выход" title='Выход' className='img-small-24 cursor-pointer ms-4' />
        </div>
      </section>
    </div>
  );
}

export default Header;
