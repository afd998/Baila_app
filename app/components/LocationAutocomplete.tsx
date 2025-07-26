import React, { useState, useCallback, useRef, useEffect } from 'react';
import { YStack, Text, useTheme } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import CreateAutocomplete from './CreateAutocomplete';
import { useGooglePlaces, GooglePlace } from '../../lib/hooks/useGooglePlaces';

interface LocationOption {
    label: string;
    value: string;
    place_id: string;
    main_text: string;
    secondary_text: string;
    types: string[];
}

interface LocationAutocompleteProps {
    value?: string;
    onValueChange?: (value: string) => void;
    onLocationSelect?: (location: {
        place_id: string;
        name: string;
        address: string;
        coordinates: { lat: number; lng: number };
    }) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export default function LocationAutocomplete({
    value,
    onValueChange,
    onLocationSelect,
    placeholder = 'Search for a location...',
    label = 'Location',
    disabled = false,
}: LocationAutocompleteProps) {
    const theme = useTheme();
    const { searchPlaces, getPlaceDetails, isLoading } = useGooglePlaces();
    const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleLocationSearch = useCallback((query: string) => {
        console.log('LocationAutocomplete - Search query:', query, 'Length:', query.length);
        
        // Clear existing debounce timer
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        if (query.length < 2) {
            console.log('LocationAutocomplete - Query too short, clearing options');
            setLocationOptions([]);
            return;
        }

        // Debounce the API call by 500ms
        debounceRef.current = setTimeout(async () => {
            console.log('LocationAutocomplete - Debounced API call for:', query);
            const places = await searchPlaces(query);
            console.log('LocationAutocomplete - Got places:', places.length, places);
            
            const options: LocationOption[] = places.map((place: GooglePlace) => ({
                label: place.description,
                value: place.place_id,
                place_id: place.place_id,
                main_text: place.structured_formatting.main_text,
                secondary_text: place.structured_formatting.secondary_text,
                types: place.types,
            }));

            console.log('LocationAutocomplete - Setting options:', options);
            setLocationOptions(options);
        }, 500); // 500ms debounce delay
    }, [searchPlaces]);

    const handleLocationSelect = useCallback(async (selectedValue: string | string[]) => {
        if (typeof selectedValue !== 'string') return;

        const selectedOption = locationOptions.find(option => option.value === selectedValue);
        if (!selectedOption) return;

        onValueChange?.(selectedOption.label);

        // Get detailed place information
        const placeDetails = await getPlaceDetails(selectedOption.place_id);
        if (placeDetails && onLocationSelect) {
            onLocationSelect({
                place_id: placeDetails.place_id,
                name: placeDetails.name,
                address: placeDetails.formatted_address,
                coordinates: {
                    lat: placeDetails.geometry.location.lat,
                    lng: placeDetails.geometry.location.lng,
                },
            });
        }
    }, [locationOptions, onValueChange, onLocationSelect, getPlaceDetails]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const customRenderOption = (option: any, isSelected: boolean) => {
        // Cast to LocationOption to access our custom properties
        const locationOption = option as LocationOption;
        
        return (
            <TouchableOpacity
                onPress={() => handleLocationSelect(locationOption.value)}
                style={{
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                }}
            >
                <FontAwesome
                    name="map-marker"
                    size={16}
                    color={theme.accent1?.val || '#007AFF'}
                    style={{ marginRight: 12 }}
                />
                <YStack flex={1}>
                    <Text
                        style={{
                            color: theme.color?.val || '#000000',
                            fontSize: 16,
                            fontWeight: '500',
                        }}
                    >
                        {locationOption.main_text}
                    </Text>
                    {locationOption.secondary_text && (
                        <Text
                            style={{
                                color: theme.gray11?.val || '#666666',
                                fontSize: 14,
                                marginTop: 2,
                            }}
                        >
                            {locationOption.secondary_text}
                        </Text>
                    )}
                </YStack>
                {isSelected && (
                    <FontAwesome
                        name="check"
                        size={16}
                        color={theme.accent1?.val || '#007AFF'}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <CreateAutocomplete
            label={label}
            options={locationOptions}
            value={value}
            onValueChange={handleLocationSelect}
            placeholder={placeholder}
            disabled={disabled}
            loading={isLoading}
            onSearch={handleLocationSearch}
            renderOption={customRenderOption}
        />
    );
}