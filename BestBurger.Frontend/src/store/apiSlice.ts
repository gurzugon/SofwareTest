import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AnalysisRequest, AnalysisResponse, HealthResponse } from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Analysis'],
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => '/health',
    }),
    analyzeRoads: builder.mutation<AnalysisResponse, AnalysisRequest>({
      query: (request) => ({
        url: '/analysis',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Analysis'],
    }),
  }),
});

export const { 
  useGetHealthQuery, 
  useAnalyzeRoadsMutation 
} = apiSlice;
