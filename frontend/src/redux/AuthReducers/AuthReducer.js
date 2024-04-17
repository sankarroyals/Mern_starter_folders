/* eslint-disable camelcase */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../Components/axiosInstance';
import { ApiServices } from '../../Services/ApiServices';

export const apiCallSlice = createSlice(
  {
    name: 'apiCall',
    initialState: {
      loginDetails: {},
      onlineUsers: [],
      ToastDetails: {
        message: '',
        bgColor: '',
        visible: 'no'
      },
      LoadingDetails: {
        visible: 'no'
      }
    },
    reducers: {
      setLoginData: (state, action) => {
        state.loginDetails = action.payload;
      },
      setToast: (state, action) => {
        state.ToastDetails = action.payload;
      },
      setLoading: (state, action) => {
        state.LoadingDetails = action.payload;
      },
      setOnlineUsers: (state, action) => {
        state.onlineUsers = action.payload;
      },
    }
  });


export const apicallloginDetails = () => async (dispatch) => {
  if (localStorage.getItem('user')) {
  axiosInstance.customFnAddTokenInHeader(JSON.parse(localStorage.getItem('user')).accessToken);
  }
  
  if (localStorage.getItem('user')) {
    dispatch(setLoading({ visible: 'yes' }))
    await ApiServices.verifyAccessToken({ accessToken: JSON.parse(localStorage.getItem('user')).accessToken }).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data))
      dispatch(setLoginData(jwtDecode(JSON.parse(localStorage.getItem('user')).accessToken)))
      axiosInstance.customFnAddTokenInHeader(JSON.parse(localStorage.getItem('user')).accessToken);
      dispatch(setLoading({ visible: 'no' }))
    }).catch(async (err) => {
      localStorage.removeItem('user')
      window.location.href = '/login'
      // await ApiServices.refreshToken({ refreshToken: JSON.parse(localStorage.getItem('user')).refreshToken }).then((res) => {
      //   localStorage.setItem('user', JSON.stringify(res.data))
      //   dispatch(setLoginData(jwtDecode(res.data.accessToken)))
      //   axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
      //   dispatch(setLoading({ visible: 'no' }))

      // }).catch(err => {
      //   localStorage.removeItem('user')
      //   window.location.href = '/login'
      //   dispatch(setLoading({ visible: 'no' }))
      // })

    })
    dispatch(setLoading({ visible: 'no' }))
  }
}

export const { setLoginData, setToast, setOnlineUsers, setLoading } = apiCallSlice.actions;

// this is for configureStore
export default apiCallSlice.reducer;
