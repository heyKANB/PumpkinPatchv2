import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const GAME_URL = 'https://your-deployed-url.replit.app'; // Replace with your actual Replit URL

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: GAME_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFit={false}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        allowsFullscreenVideo={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP error: ', nativeEvent);
        }}
        onLoadStart={() => console.log('Loading started')}
        onLoadEnd={() => console.log('Loading finished')}
        renderError={() => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load the game. Please check your internet connection.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4ade80',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});