import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { setCityDetails, setStates } from '../store/slices/propertyDetails';


interface City {
  value: number;
  label: string;
}

interface State {
  value: number;
  label: string;
}

interface CitiesResponse {
  status: 'success' | 'error';
  message: string;
  cities: City[];
}

interface StatesResponse {
  status: 'success' | 'error';
  message: string;
  states: State[];
}

interface ErrorResponse {
  message?: string;
}

export const usePropertyQueries = () => {
  const dispatch = useDispatch();


  const citiesQuery = useQuery<City[], AxiosError<ErrorResponse>>({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await axios.get<CitiesResponse>('https://api.meetowner.in/general/getcities');
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch cities');
      }
      return response.data.cities;
    },
    staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
    
  });

 
  const statesQuery = useQuery<State[], AxiosError<ErrorResponse>>({
    queryKey: ['states'],
    queryFn: async () => {
      const response = await axios.get<StatesResponse>('https://api.meetowner.in/general/getstates');
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch states');
      }
      return response.data.states;
    },
    staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
    
  });

 
  useEffect(() => {
    if (citiesQuery.data) {
      dispatch(setCityDetails(citiesQuery.data));
    }
  }, [citiesQuery.data, dispatch]);

  useEffect(() => {
    if (statesQuery.data) {
      dispatch(setStates(statesQuery.data));
    }
  }, [statesQuery.data, dispatch]);

  return {
    citiesQuery,
    statesQuery,
  };
};