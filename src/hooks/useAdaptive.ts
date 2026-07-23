import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

import {DESIGN_HEIGHT, DESIGN_WIDTH} from '../constants/theme';

export function useAdaptive() {
  const {width, height} = useWindowDimensions();

  return useMemo(() => {
    const isNarrow = width < 370;
    const isSmallHeight = height < 740;
    const isTinyHeight = height < 660;

    const scale = (size: number) => (width / DESIGN_WIDTH) * size;
    const verticalScale = (size: number) => (height / DESIGN_HEIGHT) * size;

    return {
      width,
      height,
      isNarrow,
      isSmallHeight,
      isTinyHeight,
      scale,
      verticalScale,
      horizontalPadding: isNarrow ? scale(16) : scale(18),
      loaderLogoSize: isTinyHeight
        ? scale(120)
        : isSmallHeight
        ? scale(140)
        : scale(160),
      artSize: isSmallHeight ? scale(300) : scale(360),
    };
  }, [width, height]);
}
