import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';

function Home() {

    const [nav, switchNav] = useState('profile');

    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    return (
        <div className="Home text-white">
            <div className=''>
                <Header/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black pb-2">
                                <div className="card-title">
                                    <img src="https://hsto.org/getpro/habr/avatars/252/fee/ec9/252feeec93d4d2f2d8b57ac5e52fbdda.png" alt="" className='img-normal-50' />
                                    <h4 className='pb-1 mb-0'>artem mikhailov</h4>
                                    <p>Люблю данные и все что с ними связано</p>
                                    <div className='d-flex '>
                                       {nav == 'profile' ? (
                                            <button className='btn btn-primary me-2 ' value='profile' onClick={switchNavF}>Профиль</button>
                                        ):(
                                            <button className='btn me-2' value='profile' onClick={switchNavF}>Профиль</button>
                                        )}
                                        {nav == 'articles' ? (
                                            <button className='btn btn-primary me-2' value='articles' onClick={switchNavF}>Публикации</button>
                                        ):(
                                            <button className='btn me-2' value='articles' onClick={switchNavF}>Публикации</button>
                                        )}
                                        {nav == 'comments' ? (
                                            <button className='btn btn-primary me-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                        ):(
                                            <button className='btn me-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {nav == 'profile' && 
                            <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                <h5 className="card-header w-100">Умный поиск</h5>
                                <div className="card-body">
                                    <div className="answer_guestion mb-4">
                                        <span className="message">- Hello. There are some questions? Ask I will try to answer.</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <input type="email" className="form-control border border-2 me-2" id="exampleFormControlInput1" placeholder=""></input>
                                        <button className='btn btn-success'>Send</button>
                                    </div>
                                </div>
                            </div>
                            }         
                            
                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            <div className='padding-top-20-px position-sticky top-0'>
                                <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                    <h5 className="card-header w-100">Умный поиск</h5>
                                    <div className="card-body">
                                        <div className="answer_guestion mb-4">
                                            <span className="message">- Hello. There are some questions? Ask I will try to answer.</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <input type="email" className="form-control border border-2 me-2" id="exampleFormControlInput1" placeholder=""></input>
                                            <button className='btn btn-success'>Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
