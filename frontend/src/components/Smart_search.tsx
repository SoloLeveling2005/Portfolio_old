import React from 'react';
import '../App.css';

function Smart_search() {
  return (
    <div className="card m-0 p-0 bg-white mb-3 w-100 ">
      <h5 className="card-header w-100">Умный поиск</h5>
      <div className="card-body">
          <div className="answer_guestion mb-4">
              <span className="message">- Hello. There are some questions? Ask I will try to answer.</span>
              <div className='w-100'>
                <div className="alert alert-dark min-width min-width-50-per p-2 fs-6" role="alert">
                  A simple primary alert—check it out!
                </div>
              </div>
              <div className='w-100 d-flex justify-content-end'>
                <div className="alert alert-dark min-width min-width-50-per p-2 fs-6" role="alert">
                  A simple primary alert—check it out!
                </div>
              </div>
          </div>
          <div className="d-flex align-items-center">
              <input type="email" className="form-control border border-2 me-2" id="exampleFormControlInput1" placeholder=""></input>
              <button className='btn btn-success'>Send</button>
          </div>
      </div>
    </div>
  );
}

export default Smart_search;
