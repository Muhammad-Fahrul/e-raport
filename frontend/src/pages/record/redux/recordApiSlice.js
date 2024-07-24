import { apiSlice } from '../../../app/api/apiSlice';

const RECORD_URL = '/api/records';

export const raportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecord: builder.query({
      query: ({ username, raportId }) => ({
        url: `${RECORD_URL}/${username}/${raportId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: [{ type: 'Record', id: 'LIST' }],
    }),
    addRecord: builder.mutation({
      query: ({ studentId, raportId, ...data }) => ({
        url: `${RECORD_URL}/${studentId}/${raportId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Record', id: 'LIST' }, 'Report'],
    }),
    deleteRecord: builder.mutation({
      query: ({ studentId, raportId, recordId }) => ({
        url: `${RECORD_URL}/${studentId}/${raportId}/${recordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Record', id: 'LIST' }, 'User', 'Report'],
    }),
  }),
});

export const {
  useAddRecordMutation,
  useGetRecordQuery,
  useDeleteRecordMutation,
} = raportApiSlice;
