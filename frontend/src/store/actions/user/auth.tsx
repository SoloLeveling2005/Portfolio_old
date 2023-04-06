export const AUTH_USER = 'AUTH_USER';

export const auth = (username:string, token:string) => ({
  type: AUTH_USER,
  payload: {username,token}
});
