import { createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../../app/api/apiSlice';

const STUDENT_URL = '/api/students';

const studentsAdapter = createEntityAdapter({});

const initialState = studentsAdapter.getInitialState();

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentsByMentorId: builder.query({
      query: () => ({
        url: `${STUDENT_URL}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedStudents = responseData.students.map((student) => {
          student.id = student._id;
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'Student', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Student', id })),
          ];
        } else return [{ type: 'Student', id: 'LIST' }];
      },
    }),
    addStudent: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),
    deleteStudent: builder.mutation({
      query: ({ username }) => ({
        url: `${STUDENT_URL}/${username}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Student', id: arg.id },
      ],
    }),
    addStudents: builder.mutation({
      query: (formData) => ({
        url: `${STUDENT_URL}/multiple`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const {
  useAddStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsByMentorIdQuery,
  useAddStudentsMutation,
} = studentApiSlice;
