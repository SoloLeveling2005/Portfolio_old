import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function UserInfo(props:{'country':string, 'registered':string, 'last_login':string}) {
  let country = props.country;
  let registered = props.registered;
  let last_login = props.last_login;
  return (
    <div className="card m-0 p-0 bg-white mb-3 w-100 ">
      <h5 className="card-header w-100">Информация</h5>
      <div className="card-body py-0 my-0 pt-2">
          <div className="table">
            <div className="row py-2">
              <div className="col fw-bold">Откуда</div>
              <div className="col">{country}</div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Зарегистрирован</div>
              <div className="col">{registered}</div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Активность</div>
              <div className="col">{last_login}</div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default UserInfo;
