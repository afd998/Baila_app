import React from 'react';
import { XStack, YStack, useTheme } from 'tamagui';
import { TouchableOpacity } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepPress?: (step: number) => void;
  allowStepNavigation?: boolean;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  onStepPress,
  allowStepNavigation = false,
}: StepIndicatorProps) {
  const theme = useTheme();

  const renderDot = (stepIndex: number) => {
    const isActive = stepIndex === currentStep;
    const isCompleted = stepIndex < currentStep;
    
    const dotContent = (
      <YStack
        width={12}
        height={12}
        borderRadius={6}
        backgroundColor={
          isActive 
            ? theme.accent1?.val || '#007AFF'
            : isCompleted 
              ? theme.accent1?.val || '#007AFF'
              : theme.gray8?.val || '#E0E0E0'
        }
        opacity={isActive ? 1 : isCompleted ? 0.8 : 0.4}
        borderWidth={isActive ? 2 : 0}
        borderColor={theme.background?.val || '#FFFFFF'}
      />
    );

    if (allowStepNavigation && onStepPress) {
      return (
        <TouchableOpacity
          key={stepIndex}
          onPress={() => onStepPress(stepIndex)}
          style={{ padding: 8 }}
        >
          {dotContent}
        </TouchableOpacity>
      );
    }

    return (
      <YStack key={stepIndex} padding="$2">
        {dotContent}
      </YStack>
    );
  };

  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      space="$1"
      paddingVertical="$3"
    >
      {Array.from({ length: totalSteps }, (_, index) => renderDot(index))}
    </XStack>
  );
}