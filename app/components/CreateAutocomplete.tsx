import React, { useState, useEffect, useRef, ReactElement } from 'react';
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  ScrollView,
  useTheme,
  Sheet,
  ListItem,
  Separator,
} from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';

// Helper function to darken a hex color
const darkenColor = (color: string, amount: number = 0.3): string => {
  if (!color || !color.startsWith('#')) return color;
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const darkenedR = Math.max(0, Math.floor(r * (1 - amount)));
  const darkenedG = Math.max(0, Math.floor(g * (1 - amount)));
  const darkenedB = Math.max(0, Math.floor(b * (1 - amount)));
  
  return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
};

// Helper function to lighten a hex color
const lightenColor = (color: string, amount: number = 0.8): string => {
  if (!color || !color.startsWith('#')) return '#007AFF'; // Return fallback color
  
  const hex = color.replace('#', '');
  if (hex.length !== 6) return '#007AFF'; // Return fallback for invalid hex
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Check for NaN values
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#007AFF';
  
  const lightenedR = Math.min(255, Math.floor(r + (255 - r) * amount));
  const lightenedG = Math.min(255, Math.floor(g + (255 - g) * amount));
  const lightenedB = Math.min(255, Math.floor(b + (255 - b) * amount));
  
  return `#${lightenedR.toString(16).padStart(2, '0')}${lightenedG.toString(16).padStart(2, '0')}${lightenedB.toString(16).padStart(2, '0')}`;
};

interface AutocompleteOption {
  label: string;
  value: string;
  [key: string]: any;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => void;
  renderOption?: (option: AutocompleteOption, isSelected: boolean) => React.ReactNode;
  maxHeight?: number;
  width?: number | string;
  multiSelect?: boolean;
}

export default function CreateAutocomplete({
  options,
  value,
  onValueChange,
  placeholder = 'Search...',
  label,
  disabled = false,
  loading = false,
  onSearch,
  renderOption,
  maxHeight = 200,
  width = '100%',
  multiSelect = false,
}: AutocompleteProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options);
  const inputRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  // Handle both single and multi-select values
  const selectedValues = multiSelect ? (Array.isArray(value) ? value : []) : [];
  const singleValue = multiSelect ? '' : (typeof value === 'string' ? value : '');
  
  // Find selected options
  const selectedOptions = multiSelect 
    ? options.filter(option => selectedValues.includes(option.value))
    : options.find(option => option.value === singleValue) ? [options.find(option => option.value === singleValue)!] : [];

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (!multiSelect && selectedOptions.length > 0) {
      setInputValue(selectedOptions[0].label);
    }
  }, [selectedOptions, multiSelect]);



  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    // Filter options based on input
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(filtered);
    
    // Call onSearch if provided
    if (onSearch) {
      onSearch(text);
      // For remote search (like Google Places), open dropdown if text length > 0
      if (text.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      // For local search, open dropdown if there are filtered options
      if (filtered.length > 0 && text.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    if (multiSelect) {
      const isCurrentlySelected = selectedValues.includes(option.value);
      const newSelectedValues = isCurrentlySelected
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      onValueChange?.(newSelectedValues);
      
      // Clear input after selection in multiselect
      setInputValue('');
      setFilteredOptions(options);
    } else {
      setInputValue(option.label);
      onValueChange?.(option.value);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleInputFocus = () => {
    if (filteredOptions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // For multiselect, don't close on blur to allow multiple selections
    if (!multiSelect) {
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const clearInput = () => {
    setInputValue('');
    if (multiSelect) {
      onValueChange?.([]);
    } else {
      onValueChange?.('');
    }
    setFilteredOptions(options);
    setIsOpen(false);
  };

  const removeSelectedItem = (valueToRemove: string) => {
    if (multiSelect) {
      const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
      onValueChange?.(newSelectedValues);
    }
  };

  const defaultRenderOption = (option: AutocompleteOption, isSelected: boolean) => (
    <TouchableOpacity
      onPress={() => {
        console.log('Option pressed:', option.label, option.value);
        handleOptionSelect(option);
      }}
      style={{
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text
        style={{
          color: theme.color?.val || '#000000',
          fontSize: 16,
          flex: 1,
        }}
      >
        {option.label}
      </Text>
      {isSelected && (
        <FontAwesome 
          name="check" 
          size={16} 
          color={theme.accent1?.val || '#007AFF'} 
        />
      )}
    </TouchableOpacity>
  );



  return (
    <YStack width={width} position="relative" ref={containerRef}>
        {label && (
        <Text color="$color" fontSize="$3" mb="$2" fontWeight="500">
          {label}
        </Text>
      )}
      
      {/* Selected Items Display (Multi-select) */}
      {multiSelect && selectedOptions.length > 0 && (
        <YStack mb="$2" space="$2">
          <XStack flexWrap="wrap" gap="$2">
            {selectedOptions.map((option, index) => (
              <TouchableOpacity
                key={`selected-${option.value}-${index}`}
                onPress={() => removeSelectedItem(option.value)}
                style={{
                  backgroundColor: option.color ? 
                    lightenColor(option.color, 0.8) : 
                    lightenColor(theme.accent1?.val || '#007AFF', 0.8),
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: option.color || theme.accent1?.val || '#007AFF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Text 
                  style={{ 
                    color: option.color || theme.accent1?.val || '#007AFF',
                    fontSize: 12,
                    fontWeight: '600'
                  }}
                >
                  {option.label}
                </Text>
                <FontAwesome 
                  name="times" 
                  size={10} 
                  color={option.color || theme.accent1?.val || '#007AFF'}
                />
              </TouchableOpacity>
            ))}
          </XStack>
        </YStack>
      )}
      
      <XStack position="relative" alignItems="center">
        <Input
          ref={inputRef}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          flex={1}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          borderColor={isOpen ? '$accent1' : '$borderColor'}
          borderWidth={isOpen ? 2 : 1}
        />
        
        <XStack position="absolute" right="$2" space="$2">
          {loading && (
            <FontAwesome 
              name="spinner" 
              size={16} 
              color={theme.accent1?.val || '#007AFF'} 
            />
          )}
          
          {inputValue.length > 0 && (
            <TouchableOpacity onPress={clearInput}>
              <FontAwesome 
                name="times" 
                size={16} 
                color={theme.color?.val || '#000000'} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
            <FontAwesome 
              name={isOpen ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={theme.color?.val || '#000000'} 
            />
          </TouchableOpacity>
        </XStack>
      </XStack>

      {/* Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <YStack
          position="absolute"
          top="100%"
          left={0}
          right={0}
          backgroundColor="$background"
          borderColor="$borderColor"
          borderWidth={1}
          borderRadius="$3"
          maxHeight={maxHeight}
          zIndex={1000}
        >
          <ScrollView>
            {filteredOptions.map((option, index) => {
              const isSelected = multiSelect 
                ? selectedValues.includes(option.value)
                : option.value === singleValue;
              
              return (
                <YStack key={`${option.value}-${index}`}>
                  {renderOption ? 
                    renderOption(option, isSelected) :
                    defaultRenderOption(option, isSelected)
                  }
                  {index < filteredOptions.length - 1 && (
                    <Separator key={`separator-${index}`} marginHorizontal="$3" />
                  )}
                </YStack>
              );
            })}
          </ScrollView>
        </YStack>
      )}

      {/* No results */}
      {isOpen && filteredOptions.length === 0 && inputValue.length > 0 && (
        <YStack
          position="absolute"
          top="100%"
          left={0}
          right={0}
          backgroundColor="$background"
          borderColor="$borderColor"
          borderWidth={1}
          borderRadius="$3"
          padding="$3"
          zIndex={1000}
        >
          <Text color="$gray11" fontSize="$3" textAlign="center">
            No results found
          </Text>
        </YStack>
      )}
    </YStack>
  );
} 