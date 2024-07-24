import { createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../../app/api/apiSlice';
const USERS_URL = '/api/users';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    getUserByUsername: builder.query({
      query: (username) => `${USERS_URL}/${username}`,
      providesTags: ['User'],
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedUsers = responseData.users.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'User', id })),
          ];
        } else return [{ type: 'User', id: 'LIST' }];
      },
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/uploadProfilePhoto`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    addCollaborator: builder.mutation({
      query: (collaboratorData) => ({
        url: '/add-collaborator',
        method: 'POST',
        body: collaboratorData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useGetUserByUsernameQuery,
  useLazyGetUserByUsernameQuery,
  useGetUsersQuery,
  useUpdateUserProfileMutation,
  useUpdateUserMutation,
  useAddCollaboratorMutation,
} = userApiSlice;
