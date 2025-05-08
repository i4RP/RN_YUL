import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const screens = ['Settings', 'Home', 'Details'] as const;
type Screen = typeof screens[number];

export default function App() {
  const currentIndex = useSharedValue(1); // 中央（Home）から開始
  const translateX = useSharedValue(-SCREEN_WIDTH); // 最初はHomeなので−SCREEN_WIDTH

  const goTo = (index: number) => {
    currentIndex.value = index;
    translateX.value = withSpring(-SCREEN_WIDTH * index);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = -SCREEN_WIDTH * currentIndex.value + e.translationX;
    })
    .onEnd((e) => {
      const threshold = SCREEN_WIDTH / 5;
      if (e.translationX > threshold && currentIndex.value > 0) {
        runOnJS(goTo)(currentIndex.value - 1); // 左に戻る
      } else if (e.translationX < -threshold && currentIndex.value < screens.length - 1) {
        runOnJS(goTo)(currentIndex.value + 1); // 右に進む
      } else {
        runOnJS(goTo)(currentIndex.value); // スナップバック
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.wrapper, animatedStyle]}>
            <SettingsScreen />
            <HomeScreen />
            <DetailsScreen />
          </Animated.View>
        </GestureDetector>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function SettingsScreen() {
  return (
    <Animated.View style={[styles.screen, { backgroundColor: '#e0f7fa' }]}>
      <Text style={styles.title}>⚙️ 設定</Text>
      <Text style={styles.link}>➡️ スワイプでホームへ</Text>
    </Animated.View>
  );
}

function HomeScreen() {
  return (
    <Animated.View style={styles.screen}>
      <Text style={styles.title}>🏠 ホーム</Text>
      <Text style={styles.link}>⬅️ 設定 / ➡️ 詳細</Text>
    </Animated.View>
  );
}

function DetailsScreen() {
  return (
    <Animated.View style={[styles.screen, { backgroundColor: '#f0f0f0' }]}>
      <Text style={styles.title}>📄 詳細</Text>
      <Text style={styles.link}>⬅️ スワイプでホームへ</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 3,
    height: '100%',
  },
  screen: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: '#007aff',
  },
});
