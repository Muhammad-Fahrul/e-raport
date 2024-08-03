import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  rmCredentials,
  setCredentials,
} from '../../pages/auth/redux/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_URL_RAPORT_API
      : import.meta.env.VITE_URL_LOCAL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args); // request url, method, body
  // console.log(api); // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery(
      '/api/auth/refresh',
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else if (refreshResult?.error?.status === 401) {
      api.dispatch(rmCredentials());
      return refreshResult;
    }
  } else if (
    result?.error?.status === 401 &&
    args.url.split('/')[3] === 'refresh'
  ) {
    api.dispatch(rmCredentials());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Student', 'Raport', 'Column', 'Record', 'Report'],
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
});
