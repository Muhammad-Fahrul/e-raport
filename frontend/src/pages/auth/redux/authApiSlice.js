import { apiSlice } from '../../../app/api/apiSlice';
import { rmCredentials, setCredentials } from './authSlice';

const AUTH_URL = '/api/auth';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(rmCredentials());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/refresh`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          if (err.status === 401) {
            dispatch(rmCredentials());
          }
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } =
  authApiSlice;
