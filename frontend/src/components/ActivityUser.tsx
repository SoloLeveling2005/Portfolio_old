import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function ActivityUser(props:{articles:[{url:string, title:string, count_activity:Int32Array}]}) {
  let data = props.articles;
  return (
    <div className="card m-0 p-0 bg-white mb-3 w-100 ">
      <h5 className="card-header w-100">Информация</h5>
      <div className="card-body py-0 my-0 pt-2">
          <div className="table">
            <div className="row py-2">
              <div className="col fw-bold">Откуда</div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Зарегистрирован</div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Активность</div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default ActivityUser;
