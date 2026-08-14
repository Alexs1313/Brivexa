import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

import {DESIGN_HEIGHT, DESIGN_WIDTH} from '../constants/theme';

export function useAdaptativo() {
  const {width, height} = useWindowDimensions();

  return useMemo(() => {
    const isNarrow = width < 370;
    const isSmallAltura = height < 740;
    const isTinyAltura = height < 660;

    const scale = (size: number) => (width / DESIGN_WIDTH) * size;
    const verticalEscala = (size: number) => (height / DESIGN_HEIGHT) * size;

    return {
      width,
      height,
      isNarrow,
      isSmallAltura,
      isTinyAltura,
      scale,
      verticalEscala,
      horizontalRelleno: isNarrow ? scale(16) : scale(18),
      loaderLogoTamano: isTinyAltura
        ? scale(120)
        : isSmallAltura
        ? scale(140)
        : scale(160),
      artTamano: isSmallAltura ? scale(300) : scale(360),
    };
  }, [width, height]);
}
