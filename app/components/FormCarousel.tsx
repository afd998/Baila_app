import React, { useState } from 'react';
import { YStack, XStack, Text, AnimatePresence, Button } from 'tamagui';
import { Dimensions } from 'react-native';
import StepIndicator from './StepIndicator';

const { width: screenWidth } = Dimensions.get('window');

interface FormCarouselProps {
  steps: React.ReactNode[];
  onComplete: () => void;
  onStepChange?: (step: number) => void;
  validateStep?: (step: number) => boolean;
  isStepValid?: (step: number) => boolean;
  stepTitles?: string[];
}

export default function FormCarousel({
  steps,
  onComplete,
  onStepChange,
  validateStep,
  isStepValid,
  stepTitles = [],
}: FormCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;

  const goToNextStep = () => {
    // Validate current step if validation function provided
    if (validateStep && !validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    } else {
      // Last step - complete the form
      onComplete();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  // Disabled for now - will add back when form validation is ready
  const goToStep = (step: number) => {
    // Disabled - no jumping between steps until validation is implemented
    return;
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isCurrentStepValid = isStepValid ? isStepValid(currentStep) : true;

  return (
    <YStack flex={1} backgroundColor="$background">

      {/* Step Title */}
      {stepTitles[currentStep] && (
        <YStack paddingHorizontal="$4" paddingBottom="$3">
          <Text
            fontSize="$6"
            fontWeight="600"
            color="$color"
            textAlign="center"
          >
            {stepTitles[currentStep]}
          </Text>
        </YStack>
      )}

      {/* Form Content - No swipe gestures */}
      <YStack flex={1}>
        <AnimatePresence mode="wait">
          <YStack
            key={currentStep}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            paddingHorizontal="$4"
            animation="quick"
            enterStyle={{
              opacity: 0,
              x: screenWidth * 0.2,
            }}
            exitStyle={{
              opacity: 0,
              x: -screenWidth * 0.2,
            }}
            opacity={1}
            x={0}
          >
            {steps[currentStep]}
          </YStack>
        </AnimatePresence>
      </YStack>

      {/* Navigation Buttons - 3 Column Layout */}
      <XStack
        width="100%"
        paddingHorizontal="$4"
        paddingVertical="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        {/* Column 1 - Back Button (33.33%) */}
        <YStack width="33.33%" justifyContent="center" alignItems="flex-start">
          {!isFirstStep && (
            <Button
              variant="outlined"
              onPress={goToPreviousStep}
              minWidth={80}
            >
              <Text color="$color">
                Back
              </Text>
            </Button>
          )}
        </YStack>

        {/* Column 2 - Step Indicator (33.33%) */}
        <YStack width="33.33%" justifyContent="center" alignItems="center">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepPress={goToStep}
            allowStepNavigation={false}
          />
        </YStack>

        {/* Column 3 - Next Button (33.33%) */}
        <YStack width="33.33%" justifyContent="center" alignItems="flex-end">
          {isCurrentStepValid && (
            <Button
              backgroundColor="$accent1"
              onPress={goToNextStep}
              minWidth={80}
            >
              <Text color="white" fontWeight="600">
                {isLastStep ? 'Complete' : 'Next'}
              </Text>
            </Button>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}