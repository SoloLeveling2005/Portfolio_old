import { createStore } from 'redux';
import { AUTH_USER } from './actions/user/auth';


// начальное состояние хранилища
const initialState = {
  user: {
    username: '',
    token: ''
  },
};

// редьюсер, который обрабатывает действия и изменяет состояние
const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'AUTH_USER':
        return {
            ...state,
            user: state.user.username = action.payload.username,
            token: state.user.token = action.payload.token,
        };
    default:
      return state;
  }
};

// создаем хранилище, передавая редьюсер
const store = createStore(counterReducer);
export default store;
// // пример использования хранилища
// console.log(store.getState()); // { count: 0 }

// store.dispatch({ type: 'INCREMENT' });
// console.log(store.getState()); // { count: 1 }

// store.dispatch({ type: 'DECREMENT' });
// console.log(store.getState()); // { count: 0 }
