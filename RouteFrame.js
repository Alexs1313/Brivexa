import React, {useRef, useState} from 'react';
import {
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AppManagerChild({navigation, route}) {
  const linkRefresh = route.params.data;
  const userAgent = route.params.userAgent;
  const webViewRef = useRef(null);

  const [isTwoClick, setTwoClick] = useState(false);

  function backHandlerButton() {
    if (isTwoClick) {
      navigation.goBack();
      return;
    }
    setTwoClick(true);
    webViewRef.current.goBack();
    setTimeout(() => {
      setTwoClick(false);
    }, 1000);
  }

  const getScheme = url => {
    if (!url) return '';
    const match = /^([a-zA-Z][a-zA-Z0-9+.\-]*):/.exec(url);
    return match ? match[1].toLowerCase() : '';
  };

  const WEBVIEW_SCHEMES = ['http', 'https', 'about'];

  const onShouldStartLoadWithRequest = event => {
    const scheme = getScheme(event.url);

    if (!scheme || WEBVIEW_SCHEMES.includes(scheme)) {
      return true;
    }

    Linking.openURL(event.url).catch(() => {});
    return false;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
        <WebView
          originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
          source={{uri: linkRefresh}}
          textZoom={100}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          onError={syntEvent => {
            const {nativeEvent} = syntEvent;
            const {code} = nativeEvent;
            if (code === -1101 || code === -1002) {
              navigation.goBack();
            }
          }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          allowFileAccess={true}
          showsVerticalScrollIndicator={false}
          javaScriptCanOpenWindowsAutomatically={true}
          style={{flex: 1}}
          ref={webViewRef}
          userAgent={userAgent}
        />

        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            position: 'absolute',
            bottom: 0,
            left: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            backHandlerButton();
          }}>
            <Ionicons name="arrow-back" size={21} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            position: 'absolute',
            bottom: 5,
            right: 25,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
          onPress={() => {
            webViewRef.current.reload();
          }}>
            <Ionicons name="reload" size={21} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
  );
}
