import { useState, useCallback, useRef } from 'react';

export const useDebouncedSearch = (delay: number = 300) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSetQuery = useCallback((query: string) => {
    // Clear the previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
  }, [delay]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    debouncedSetQuery(text);
  }, [debouncedSetQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    handleSearchChange,
    clearSearch,
  };
}; 