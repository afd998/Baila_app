import { useState } from 'react';

export interface GooglePlace {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export const useGooglePlaces = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = async (query: string): Promise<GooglePlace[]> => {
    console.log('useGooglePlaces - searchPlaces called with:', query);
    
    if (!query || query.length < 2) {
      console.log('useGooglePlaces - Query too short or empty');
      return [];
    }
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('Google Places API key not found');
      return [];
    }
    
    console.log('useGooglePlaces - API key found, making API call');

    setIsLoading(true);
    setError(null);

    try {
      // Try with better parameters for the legacy API first
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${GOOGLE_PLACES_API_KEY}&types=address&components=country:us`;
      
      console.log('useGooglePlaces - Making API call to:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('useGooglePlaces - API response:', data);

      if (data.status === 'OK') {
        console.log('useGooglePlaces - Returning predictions:', data.predictions?.length || 0);
        return data.predictions || [];
      } else {
        console.error('useGooglePlaces - API error status:', data.status, data);
        setError(`Google Places API error: ${data.status}`);
        return [];
      }
    } catch (err) {
      setError('Failed to fetch places');
      console.error('Google Places API error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('Google Places API key not found');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,geometry,types&key=${GOOGLE_PLACES_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      } else {
        setError(`Google Places API error: ${data.status}`);
        return null;
      }
    } catch (err) {
      setError('Failed to fetch place details');
      console.error('Google Places API error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchPlaces,
    getPlaceDetails,
    isLoading,
    error,
  };
};