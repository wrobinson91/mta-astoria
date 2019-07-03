import * as types from '../constants/actionTypes.js';

// need to fetch user creds

export const loginToPage = () => ({
  type: types.LOGIN_REQ,
  payload: true,
});
