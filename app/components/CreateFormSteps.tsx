import React from 'react';
import { YStack, Text, TextArea, ScrollView } from 'tamagui';
import { Controller, Control } from 'react-hook-form';
import CreateAutocomplete from './CreateAutocomplete';
import LocationAutocomplete from './LocationAutocomplete';
import { DanceMediaUpload } from './DanceMediaUpload';

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
  location: string;
  category: string;
  privateNotes: string;
  media: MediaItem[];
}

interface StepProps {
  control: Control<FormData>;
  setValue: (name: keyof FormData, value: any) => void;
  danceActivities: Array<{label: string, value: string}>;
  danceOptions: Array<{label: string, value: string, color?: string}>;
}

// Step 1: Title & Activity & Styles
export function Step1ActivityStyles({ control, setValue, danceActivities, danceOptions }: StepProps) {
  const handleDanceActivityChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setValue('danceActivity', value);
    }
  };

  const handleDanceStylesChange = (value: string | string[]) => {
    console.log('handleDanceStylesChange called with:', value, typeof value);
    if (Array.isArray(value)) {
      setValue('danceStyles', value);
    } else {
      setValue('danceStyles', [value]);
    }
  };

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <YStack space="$6" paddingBottom="$4">
        <YStack space="$2">
          <Text color="$gray11" fontSize="$4" textAlign="center">
            Give your dance session a title and tell us about it
          </Text>
        </YStack>

        {/* Title Field */}
        <Controller
          name="title"
          control={control}
          rules={{ 
            required: 'Title is required',
            minLength: { value: 1, message: 'Title cannot be empty' }
          }}
          render={({ field }) => (
            <YStack space="$2">
              <Text color="$color" fontSize="$3" fontWeight="500">
                Title
              </Text>
              <TextArea
                placeholder="What would you like to call this dance session?"
                value={field.value}
                onChangeText={field.onChange}
                minHeight={50}
                maxHeight={50}
                textAlignVertical="center"
                borderColor="$borderColor"
                borderWidth={1}
                borderRadius="$3"
                padding="$3"
                fontSize="$4"
              />
            </YStack>
          )}
        />

        {/* Dance Activity Selection */}
        <Controller
          name="danceActivity"
          control={control}
          rules={{ 
            required: 'Please select a dance activity' 
          }}
          render={({ field }) => (
            <CreateAutocomplete
              label="Dance Activity"
              options={danceActivities}
              value={field.value}
              onValueChange={handleDanceActivityChange}
              placeholder="Select dance activity..."
            />
          )}
        />
        
        {/* Dance Styles Multi-Select */}
        <Controller
          name="danceStyles"
          control={control}
          render={({ field }) => (
            <CreateAutocomplete
              label="Dance Styles"
              options={danceOptions}
              value={field.value}
              onValueChange={handleDanceStylesChange}
              placeholder="Search dance styles (select multiple)"
              multiSelect={true}
            />
          )}
        />
      </YStack>
    </ScrollView>
  );
}

// Step 2: Location & Notes
export function Step2LocationDetails({ control, setValue }: StepProps) {
  const handleCategoryChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setValue('category', value);
    }
  };

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <YStack space="$6" paddingBottom="$4">
        <YStack space="$2">
          <Text color="$gray11" fontSize="$4" textAlign="center">
            Where did this take place and any notes?
          </Text>
        </YStack>

        {/* Location Autocomplete */}
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <LocationAutocomplete
              value={field.value}
              onValueChange={(value) => setValue('location', value)}
              onLocationSelect={(location) => {
                console.log('Selected location:', location);
              }}
              placeholder="Search for a location..."
              label="Location"
            />
          )}
        />

        {/* Additional Category Field */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CreateAutocomplete
              label="Category (Optional)"
              options={[
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'Professional', value: 'professional' },
              ]}
              value={field.value}
              onValueChange={handleCategoryChange}
              placeholder="Select difficulty level..."
            />
          )}
        />

        {/* Private Notes Text Area */}
        <Controller
          name="privateNotes"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <YStack space="$2">
              <Text color="$color" fontSize="$3" fontWeight="500">
                Private Notes
              </Text>
              <TextArea
                placeholder="How did it go? What did you learn? How did you feel?"
                value={field.value}
                onChangeText={field.onChange}
                minHeight={120}
                textAlignVertical="top"
                borderColor="$borderColor"
                borderWidth={1}
                borderRadius="$3"
                padding="$3"
                fontSize="$4"
              />
            </YStack>
          )}
        />
      </YStack>
    </ScrollView>
  );
}

// Step 3: Media Upload
export function Step3MediaUpload({ control, setValue }: StepProps) {
  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <YStack space="$6" paddingBottom="$4">
        <YStack space="$2">
          <Text color="$gray11" fontSize="$4" textAlign="center">
            Add photos or videos to your dance session
          </Text>
        </YStack>

        {/* Media Upload Component */}
        <Controller
          name="media"
          control={control}
          render={({ field }) => (
            <DanceMediaUpload
              mediaItems={field.value || []}
              onMediaChange={(items) => setValue('media', items)}
              maxItems={5}
            />
          )}
        />


      </YStack>
    </ScrollView>
  );
}