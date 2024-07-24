import { apiSlice } from '../../../app/api/apiSlice';
const COLLABORATORS_URL = '/api/collaborators';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCollaborator: builder.mutation({
      query: (collaboratorData) => ({
        url: `${COLLABORATORS_URL}`,
        method: 'POST',
        body: collaboratorData,
      }),
      invalidatesTags: ['User'],
    }),
    getCollaboratorsByUsername: builder.query({
      query: (username) => `${COLLABORATORS_URL}?username=${username}`,
    }),
    getCollabsByMentor: builder.query({
      query: () => `${COLLABORATORS_URL}/collabs`,
    }),
  }),
});

export const {
  useAddCollaboratorMutation,
  useLazyGetCollaboratorsByUsernameQuery,
  useGetCollabsByMentorQuery,
} = userApiSlice;
