import { apiSlice } from '../../../app/api/apiSlice';

const RAPORT_URL = '/api/raports';

export const raportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRaportById: builder.query({
      query: (raportId) => ({
        url: `${RAPORT_URL}/mentor/${raportId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ['Raport'],
    }),
    getRaportsByMentorId: builder.query({
      query: () => ({
        url: `${RAPORT_URL}/mentor`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: [{ type: 'Raport', id: 'LIST' }],
    }),
    addRaport: builder.mutation({
      query: (data) => ({
        url: `${RAPORT_URL}/mentor`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Raport', id: 'LIST' }, 'User'],
    }),
    updateRaportById: builder.mutation({
      query: (raportId) => ({
        url: `${RAPORT_URL}/mentor/${raportId}`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Column', id: 'LIST' }, 'Raport'],
    }),
    deleteRaportById: builder.mutation({
      query: (raportId) => ({
        url: `${RAPORT_URL}/mentor/${raportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Column', id: 'LIST' }, 'Raport'],
    }),
    addRaportRelation: builder.mutation({
      query: ({ raportId, username }) => ({
        url: `${RAPORT_URL}/mentor/${raportId}/relation`,
        method: 'POST',
        body: { username },
      }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const {
  useAddRaportMutation,
  useUpdateRaportByIdMutation,
  useDeleteRaportByIdMutation,
  useGetRaportByIdQuery,
  useGetRaportsByMentorIdQuery,
  useAddRaportRelationMutation,
} = raportApiSlice;
