import React from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';

function Home() {
  return (
    <div className="App text-white">
        <div className='bgc-dark-1'>
            <Header/>
        </div>
        <div className="bgc-dark-4 w-100 h-100 py-3">
            <div className='table container text-white'>
                <div className="row">
                    <div className='col'>
                        <div className="card bgc-dark-3">
                            <div className="card-header">
                                Featured
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Special title treatment</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <a href="#" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                    <div className='col'>2</div>
                </div>
                
            </div>
            
        </div>
    </div>
  );
}

export default Home;
