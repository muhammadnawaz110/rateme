import axios from "axios";
import { hideProgressBar, showProgressBar } from "./progressBarActons";
import { showError, showSuccess } from "./alertActions";

export const userActions = {
  ADD_USER: 'addUser',
  UPDATE_USER: 'updateUser',
  REMOVE_USER: 'removeUser',
  USERS_LOADED: 'usersLoaded',
}


export const addUser = (user) => ({ type: userActions.ADD_USER, user });

export const updateUser = (user) => ({ type: userActions.UPDATE_USER, user });

export const loadUsers = () => {
  return (dispatch, getState) => {

    dispatch(showProgressBar())
    axios.get('api/users/all').then(result => {
      dispatch({ type: userActions.USERS_LOADED, users: result.data.users })
      dispatch(hideProgressBar())
    }).catch(error => {
      dispatch(hideProgressBar())
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(showError(message))
    })
  }
}

export const deleteUser = (id) => {
  return (dispatch, getState) => {

    dispatch(showProgressBar())
    axios.post('api/users/delete', { id }).then(({ data }) => {
      if (data.success) {
        dispatch({ type: userActions.REMOVE_USER, id })
        dispatch(hideProgressBar())
        dispatch(showSuccess('Department deleted successfully'))
      }
    }).catch(error => {
      dispatch(hideProgressBar())
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(showError(message))
    })
  }
}