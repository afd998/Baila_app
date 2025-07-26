import { YStack, XStack, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FormCarousel from './components/FormCarousel';
import { Step1ActivityStyles, Step2LocationDetails, Step3MediaUpload } from './components/CreateFormSteps';
import { useDanceStyles, useDanceActivities, fallbackDanceStyles, fallbackDanceActivities } from '../lib/hooks/useDanceStyles';

interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

interface FormData {
  title: string;
  danceActivity: string;
  danceStyles: string[];
  category: string;
  location: string;
  privateNotes: string;
  media: MediaItem[];
}

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  // Fetch dance data using React Query hooks
  const { data: danceStylesData } = useDanceStyles();
  const { data: danceActivitiesData } = useDanceActivities();

  // Transform data for the autocomplete component
  const danceActivities = danceActivitiesData?.map(item => ({ 
    id: item.id, 
    label: item.name, 
    value: item.id 
  })) || fallbackDanceActivities;
  const danceOptions = danceStylesData?.map(item => ({ 
    id: item.id, 
    label: item.name, 
    value: item.id,
    color: item.color 
  })) || fallbackDanceStyles;

  const { control, handleSubmit, setValue, getValues, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      danceActivity: '',
      danceStyles: [],
      category: '',
      location: '',
      privateNotes: '',
      media: [],
    }
  });

  // Watch form values to trigger re-renders for validation
  watch();

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission here
    // After successful submission, navigate back
    router.back();
  };

  const isStepValid = (step: number): boolean => {
    const formValues = getValues();
    
    switch (step) {
      case 0: // Step 1: Title & Activity
        // Title is required
        if (!formValues.title || formValues.title.trim() === '') {
          return false;
        }
        // Dance activity is required
        if (!formValues.danceActivity) {
          return false;
        }
        return true;
        
      case 1: // Step 2: Location & Notes
        // All fields are optional for now
        return true;
        
      case 2: // Step 3: Media & Finish
        // Media is optional, always valid
        return true;
        
      default:
        return true;
    }
  };

  const steps = [
    <Step1ActivityStyles 
      control={control} 
      setValue={setValue} 
      danceActivities={danceActivities}
      danceOptions={danceOptions}
    />,
    <Step2LocationDetails 
      control={control} 
      setValue={setValue} 
      danceActivities={danceActivities}
      danceOptions={danceOptions}
    />,
    <Step3MediaUpload 
      control={control} 
      setValue={setValue} 
      danceActivities={danceActivities}
      danceOptions={danceOptions}
    />
  ];

  const stepTitles = [
    'Title & Activity',
    'Location & Notes', 
    'Media & Finish'
  ];

  const handleClose = () => {
    router.push('/(tabs)/home');
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      {/* Header with Close Button */}
      <XStack
        justifyContent="flex-start"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <TouchableOpacity onPress={handleClose}>
          <FontAwesome 
            name="times" 
            size={24} 
            color={theme.color?.val || '#000000'} 
          />
        </TouchableOpacity>
      </XStack>

      {/* Form Carousel */}
      <FormCarousel
        steps={steps}
        stepTitles={stepTitles}
        onComplete={handleSubmit(onSubmit)}
        isStepValid={isStepValid}
        onStepChange={(step) => console.log('Step changed to:', step)}
      />
    </YStack>
  );
}