import { apiSlice } from '../../../app/api/apiSlice';

const RAPORT_URL = '/api/analysis';

export const raportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => ({
        url: `${RAPORT_URL}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ['Report'],
    }),
    getReportsArrayType: builder.query({
      query: () => ({
        url: `${RAPORT_URL}/array`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ['Report'],
    }),
  }),
});

export const { useGetReportsQuery, useGetReportsArrayTypeQuery } =
  raportApiSlice;
