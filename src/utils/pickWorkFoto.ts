import { NativeModules } from 'react-native';
import {
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';

type NativeImagePicker = {
  launchImageLibrary: (
    options: Record<string, unknown>,
    callback: (result: ImagePickerResponse) => void,
  ) => void;
};

const OPTIONS = {
  mediaType: 'photo' as const,
  quality: 0.8,
  selectionLimit: 1,
};

function unwrap(result: ImagePickerResponse | ImagePickerResponse[]) {
  return Array.isArray(result) ? result[0] : result;
}

export function pickWorkFoto(): Promise<ImagePickerResponse> {
  const native = NativeModules.ImagePicker as NativeImagePicker | undefined;

  if (native?.launchImageLibrary) {
    return new Promise(resolve => {
      native.launchImageLibrary(OPTIONS, result => {
        resolve(unwrap(result) ?? { didCancel: true });
      });
    });
  }

  return launchImageLibrary(OPTIONS).then(
    result => unwrap(result) ?? { didCancel: true },
    () => ({
      errorCode: 'others' as const,
      errorMessage: 'Rebuild the app to enable the photo library.',
    }),
  );
}
