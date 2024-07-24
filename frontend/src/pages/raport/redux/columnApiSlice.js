import { apiSlice } from '../../../app/api/apiSlice';

const COLUMN_URL = '/api/columns';

export const raportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addColumn: builder.mutation({
      query: ({ raportId, ...data }) => ({
        url: `${COLUMN_URL}/${raportId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Column', id: 'LIST' }, 'Raport'],
    }),
    deleteColumn: builder.mutation({
      query: ({ raportId, columnId }) => ({
        url: `${COLUMN_URL}/${raportId}`,
        method: 'DELETE',
        body: { columnId },
      }),
      invalidatesTags: [{ type: 'Column', id: 'LIST' }, 'Raport'],
    }),
  }),
});

export const { useAddColumnMutation, useDeleteColumnMutation } = raportApiSlice;
