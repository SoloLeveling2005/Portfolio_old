
import { createStore } from 'redux';


// Actions
const signInAction = (data: any) => {
  return {
    type: 'SIGN_IN',
    payload: data,
  };
};

const signUpAction = (data: any) => {
  return {
    type: 'SIGN_UP',
    payload: data,
  };
};

const signOutAction = (data: any) => {
  return {
    type: 'SIGN_OUT',
    payload: data,
  };
};


// Reducer
const database = {
  user: Object,
  access_token: '',
  refresh_token: ''
};

const authReducer = (state = database, action: any) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        username: action.payload.user,
        access_token:action.payload.access_token,
        refresh_token:action.payload.refresh_token
      };
    case 'SIGN_UP':
      return {
        ...state,
        username: action.payload.user,
        access_token:action.payload.access_token,
        refresh_token:action.payload.refresh_token
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Store
const store = createStore(authReducer);

export const signIn = (data: any) => {
  store.dispatch(signInAction(data));
};

export const signUp = (data: any) => {
  store.dispatch(signUpAction(data));
};

export const signOut = (data: any) => {
  store.dispatch(signOutAction(data));
};

export default store;
// // пример использования хранилища
// console.log(store.getState()); // { count: 0 }

// store.dispatch({ type: 'INCREMENT' });
// console.log(store.getState()); // { count: 1 }

// store.dispatch({ type: 'DECREMENT' });
// console.log(store.getState()); // { count: 0 }
