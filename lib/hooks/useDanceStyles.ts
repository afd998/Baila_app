import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';

export interface DanceStyle {
  id: string;
  name: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface DanceActivity {
  id: string;
  name: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch dance styles from Supabase
const fetchDanceStyles = async (): Promise<DanceStyle[]> => {
  const { data, error } = await supabase
    .from('dance_styles')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Error fetching dance styles: ${error.message}`);
  }

  return data || [];
};

// Fetch dance activities from Supabase
const fetchDanceActivities = async (): Promise<DanceActivity[]> => {
  const { data, error } = await supabase
    .from('dance_activities')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Error fetching dance activities: ${error.message}`);
  }

  return data || [];
};

// Hook for dance styles
export const useDanceStyles = () => {
  return useQuery({
    queryKey: ['danceStyles'],
    queryFn: fetchDanceStyles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for dance activities
export const useDanceActivities = () => {
  return useQuery({
    queryKey: ['danceActivities'],
    queryFn: fetchDanceActivities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fallback data in case the database tables don't exist yet
export const fallbackDanceStyles: { label: string; value: string }[] = [
  { label: 'Bachata', value: 'bachata' },
  { label: 'Ballet', value: 'ballet' },
  { label: 'Belly dance', value: 'belly_dance' },
  { label: 'ChaCha', value: 'chacha' },
  { label: 'Ecstatic dance', value: 'ecstatic_dance' },
  { label: 'Fox Trot', value: 'fox_trot' },
  { label: 'Free-style', value: 'free_style' },
  { label: 'Hip-hop', value: 'hip_hop' },
  { label: 'Hustle', value: 'hustle' },
  { label: 'Lindy Hop', value: 'lindy_hop' },
  { label: 'Line Dance', value: 'line_dance' },
  { label: 'Pole dance', value: 'pole_dance' },
  { label: 'Rhumba', value: 'rhumba' },
  { label: 'Salsa', value: 'salsa' },
  { label: 'Swing', value: 'swing' },
  { label: 'Square Dance', value: 'square_dance' },
  { label: 'Tango', value: 'tango' },
  { label: 'Two-step', value: 'two_step' },
  { label: 'Vogue', value: 'vogue' },
  { label: 'Waltz', value: 'waltz' },
  { label: 'Zumba', value: 'zumba' },
  { label: 'Other', value: 'other' },
];

export const fallbackDanceActivities: { label: string; value: string }[] = [
  { label: 'Class', value: 'class' },
  { label: 'Lesson', value: 'lesson' },
  { label: 'Practice', value: 'practice' },
  { label: 'Rehearsal', value: 'rehearsal' },
  { label: 'Recital', value: 'recital' },
  { label: 'Competition', value: 'competition' },
  { label: 'Party', value: 'party' },
  { label: 'Festival', value: 'festival' },
  { label: 'Music Event', value: 'music_event' },
  { label: 'Other', value: 'other' },
]; 