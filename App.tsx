import React from 'react';
import { Text, StyleSheet, Dimensions, View, Image } from 'react-native';
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
    <GestureHandlerRootView style={styles.rootView}>
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
    <Animated.View style={[styles.screen, styles.settingsScreen]}>
      <Text style={styles.title}>⚙️ 設定</Text>
      <Text style={styles.link}>➡️ スワイプでホームへ</Text>
    </Animated.View>
  );
}

function HomeScreen() {
  interface NeuMorphProps {
    children: React.ReactNode;
    size?: number;
    style?: any;
  }

  const NeuMorph: React.FC<NeuMorphProps> = ({ children, size, style }) => {
    return (
      <View style={styles.topShadow}>
        <View style={styles.bottomShadow}>
          <View
            style={[
              styles.inner,
              { width: size ?? 40, height: size ?? 40, borderRadius: (size ?? 40) / 2 },
              style
            ]}
          >
            {children}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.screen, styles.homeScreen]}>
      <View style={styles.topContainer}>
        <NeuMorph size={48} style={{}}>
          <Text style={styles.iconText}>←</Text>
        </NeuMorph>

        <View>
          <Text style={styles.playing}>PLAYING NOW</Text>
        </View>

        <NeuMorph size={48} style={{}}>
          <Text style={styles.iconText}>≡</Text>
        </NeuMorph>
      </View>

      <View style={styles.songArtContainer}>
        <NeuMorph size={200} style={{}}>
          <Image source={require('./src/assets/images/flower.jpg')} style={styles.songArt} />
        </NeuMorph>
      </View>

      <View style={styles.songContainer}>
        <Text style={styles.songTitle}>Lost it</Text>
        <Text style={styles.artist}>Flume ft. Vic Mensa</Text>
      </View>

      <View style={styles.trackContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.time}>1:21</Text>
          <Text style={styles.time}>3:46</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <NeuMorph size={60} style={{}}>
          <Text style={styles.iconText}>⏮</Text>
        </NeuMorph>

        <NeuMorph size={60} style={{ backgroundColor: '#8AAAFF', borderColor: '#8AAAFF' }}>
          <Text style={styles.iconTextWhite}>⏸</Text>
        </NeuMorph>

        <NeuMorph size={60} style={{}}>
          <Text style={styles.iconText}>⏭</Text>
        </NeuMorph>
      </View>
      
      <Text style={styles.link}>⬅️ 設定 / ➡️ 詳細</Text>
    </Animated.View>
  );
}

function DetailsScreen() {
  return (
    <Animated.View style={[styles.screen, styles.detailsScreen]}>
      <Text style={styles.title}>📄 詳細</Text>
      <Text style={styles.link}>⬅️ スワイプでホームへ</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
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
  settingsScreen: {
    backgroundColor: '#e0f7fa',
  },
  homeScreen: {
    backgroundColor: '#DEE9FD',
    paddingHorizontal: 32,
  },
  detailsScreen: {
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: '#007aff',
    marginTop: 20,
  },
  topShadow: {
    shadowOffset: {
      width: -6,
      height: -6
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowColor: '#FBFFFF'
  },
  bottomShadow: {
    shadowOffset: {
      width: 6,
      height: 6
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowColor: '#B7C4DD'
  },
  inner: {
    backgroundColor: '#DEE9F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E2ECFD',
    borderWidth: 1
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  playing: {
    color: '#91A1BD',
    fontWeight: '800'
  },
  songArtContainer: {
    marginVertical: 32,
    alignItems: 'center'
  },
  songArt: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: '#D7E1F3',
    borderWidth: 10
  },
  songContainer: {
    alignItems: 'center'
  },
  songTitle: {
    fontSize: 30,
    color: '#6C7A93',
    fontWeight: '600'
  },
  artist: {
    fontSize: 14,
    marginTop: 6,
    color: '#91A1BD',
    fontWeight: '500'
  },
  trackContainer: {
    marginTop: 32,
    marginBottom: 32
  },
  time: {
    fontSize: 10,
    color: '#91A1BD',
    fontWeight: '700'
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 20,
    color: '#91A1BD',
  },
  iconTextWhite: {
    fontSize: 20,
    color: '#FFFFFF',
  }
});
