import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function ActivityUser(props:{articles:[{url:string, title:string, count_activity:any}]}) {
  let data = props.articles;
  return (
    <div className="card m-0 p-0 bg-white mb-3 w-100 ">
      <h5 className="card-header w-100">Вклады в сообщества</h5>
      <div className="card-body py-0 my-0 pt-2">
          <div className="table">
            <div className="row p-2 d-flex align-items-center">
              <img className=' col-3 min-img-40-px p-0' src="https://hsto.org/getpro/habr/hub/6fa/6da/62d/6fa6da62d615ba8e7d9f0186eacfabbf.png" alt="" />
              <div className="col fw-bold d-flex align-items-center flex-wrap">
                <div className='w-100 d-flex justify-content-between pt-0'>
                  <span>Прототипирование</span>
                  <span>123</span>
                </div>
                <div className='w-100 bg-success height-5px p-0'></div>
              </div>
            </div>
            <div className="row p-2">
              <img className='col-3 min-img-40-px p-0' src="https://hsto.org/getpro/geektimes/hub/02f/206/0b9/02f2060b99e6f4d9403eee0420d7d5b8.png" alt="" />
              <div className="col fw-bold d-flex align-items-center flex-wrap">
                <div className='w-100 d-flex justify-content-between pt-0'>
                  <span>Научно-популярное</span>
                  <span>123</span>
                </div>
                <div className='w-100 bg-success height-5px p-0'></div>
              </div>
            </div>
            <div className="row p-2">
              <img className='col-3 min-img-40-px p-0' src="https://hsto.org/getpro/geektimes/hub/4fc/240/caa/4fc240caaae6907407cd6127f23a4aee.png" alt="" />
              <div className="col fw-bold d-flex align-items-center flex-wrap">
                <div className='w-100 d-flex justify-content-between pt-0'>
                  <span>Робототехника</span>
                  <span>123</span>
                </div>
                <div className='w-100 bg-success height-5px p-0'></div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default ActivityUser;
