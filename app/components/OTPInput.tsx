import React, { useRef, useState } from 'react';
import { Input, XStack } from 'tamagui';
import { Platform } from 'react-native';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OTPInput({ value, onChange, length = 6 }: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<any[]>([]);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) {
      return;
    }

    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newValue = value.split('');
    newValue[index] = text;
    const newValueStr = newValue.join('');

    onChange(newValueStr);

    if (text) {
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // If this is the last digit, blur the input
        inputRefs.current[index]?.blur();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (value[index]) {
        // If there's a value in current input, just clear it
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // If current input is empty and not first input, go to previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <XStack space="$2" ai="center" jc="center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          keyboardType="number-pad"
          maxLength={1}
          size="$4"
          width={40}
          height={50}
          textAlign="center"
          fontSize={24}
          boc={focusedIndex === index ? "$accent1" : "$gray5"}
          col="$color"
          bg="$background"
          autoComplete={Platform.OS === 'android' ? 'one-time-code' : 'off'}
          cursorColor="transparent"
          selectionColor="transparent"
        />
      ))}
    </XStack>
  );
} 