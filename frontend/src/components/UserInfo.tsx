import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function UserInfo(props:{'country':string, 'registered':string, 'last_login':string, 'gender':string|null, 'age':string}) {
  let country = props.country;
  let registered = props.registered;
  let last_login = props.last_login;
  const gender = props.gender;
  const age = props.age;
  return (
    <div className="card m-0 p-0 bg-white mb-3 w-100 ">
      <h5 className="card-header w-100">Информация</h5>
      <div className="card-body py-0 my-0 pt-2">
          <div className="table">

            <div className="row py-2">
              <div className="col fw-bold">Откуда</div>
              <div className="col">
                {country == null || country == '' ? (
                  <p className='p-0 m-0'>Не указано</p>
                ):(
                  <p className='p-0 m-0'>{country}</p>
                )}
              </div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Пол</div>
              <div className="col">
                {gender == null || gender == '' ? (
                  <p className='p-0 m-0'>Не указан</p>
                ):(
                  <p className='p-0 m-0'>{gender}</p>
                )}
              </div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Возраст</div>
              <div className="col">
                {age == null || age == '' ? (
                  <p className='p-0 m-0'>Не указан</p>
                ):(
                  <p className='p-0 m-0'>{age}</p>
                )}
              </div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Зарегистрирован</div>
              <div className="col">
                {registered == null || registered == '' ? (
                  <p className='p-0 m-0'>Не указано</p>
                ):(
                  <p className='p-0 m-0'>{registered}</p>
                )}
              </div>
            </div>
            <div className="row py-2">
              <div className="col fw-bold">Активность</div>
              <div className="col">
                {last_login == null || last_login == '' ? (
                  <p className='p-0 m-0'>Не указано</p>
                ):(
                  <p className='p-0 m-0'>{last_login}</p>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default UserInfo;
