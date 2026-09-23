import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import type { CalculatorId } from '../../data/calculators';
import { CalculatorsScreen } from '../../screens/CalculatorsScreen';
import { FertilizerScreen } from '../../screens/FertilizerScreen';
import { SeedRateScreen } from '../../screens/SeedRateScreen';
import { SprayMixtureScreen } from '../../screens/SprayMixtureScreen';

export function CalcTabHost() {
  const navigation = useNavigation();
  const [active, setActive] = useState<CalculatorId | null>(null);

  const closeCalculadora = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    // Re-tapping the Calc tab returns to the calculator list.
    const unsubscribe = (
      navigation as {
        addListener: (
          event: string,
          callback: () => void,
        ) => () => void;
      }
    ).addListener('tabPress', () => {
      setActive(null);
    });

    return unsubscribe;
  }, [navigation]);

  if (active === 'seed') {
    return <SeedRateScreen onBack={closeCalculadora} />;
  }
  if (active === 'fertilizer') {
    return <FertilizerScreen onBack={closeCalculadora} />;
  }
  if (active === 'spray') {
    return <SprayMixtureScreen onBack={closeCalculadora} />;
  }

  return <CalculatorsScreen onOpenCalculadora={setActive} />;
}
