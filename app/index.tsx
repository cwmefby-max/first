import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Easing, PanResponder, ImageBackground } from 'react-native';
import { useFonts, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const SWIPE_WIDTH = 300;
const THUMB_WIDTH = 60;

// Define props type for the component
interface CustomSwipeButtonProps {
    onSwipeSuccess: () => void;
}

// Custom Swipe Button Component
const CustomSwipeButton = ({ onSwipeSuccess }: CustomSwipeButtonProps) => {
    const pan = useRef(new Animated.Value(0)).current;
    const arrowTranslateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(arrowTranslateX, { toValue: 5, duration: 500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(arrowTranslateX, { toValue: 0, duration: 500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
            ])
        ).start();
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0 && gestureState.dx < SWIPE_WIDTH - THUMB_WIDTH) {
                    pan.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > SWIPE_WIDTH / 2) {
                    Animated.timing(pan, { toValue: SWIPE_WIDTH - THUMB_WIDTH, duration: 200, useNativeDriver: true }).start(() => {
                        onSwipeSuccess();
                        // Reset position after a delay
                        setTimeout(() => pan.setValue(0), 500);
                    });
                } else {
                    Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
                }
            },
        })
    ).current;

    return (
        <BlurView style={styles.swipeContainer} tint="dark" intensity={0}>
            <Text style={styles.swipeTitle}>Slide to unlock bike</Text>
            <Animated.View
                style={[{ transform: [{ translateX: pan }] }, styles.swipeThumb]}
                {...panResponder.panHandlers}
            >
                <Animated.View style={{ transform: [{ translateX: arrowTranslateX }] }}>
                    <MaterialCommunityIcons name="arrow-right" color="white" size={24} />
                </Animated.View>
            </Animated.View>
        </BlurView>
    );
};


export default function WelcomeScreen() {
  const [text, setText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(0));
  const [showPoweredBy, setShowPoweredBy] = useState(false);
  const [line1Anim] = useState(new Animated.Value(40));
  const [line2Anim] = useState(new Animated.Value(40));
  const fullText = 'Hello Mefby!';
  
  const [isTextAnimationComplete, setTextAnimationComplete] = useState(false);
  const [isBellAnimating, setBellAnimating] = useState(false);
  const bellOpacity = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
  });

  const handleBellPress = () => {
    if (isBellAnimating) return;
    setBellAnimating(true);

    const blinks = [];
    for (let i = 0; i < 30; i++) {
        blinks.push(
            Animated.timing(bellOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(bellOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
        );
    }

    Animated.sequence(blinks).start(() => {
        setBellAnimating(false);
    });
  };

  useEffect(() => {
    if (fontsLoaded) {
      let i = 0;
      const intervalId = setInterval(() => {
        i++;
        setText(fullText.substring(0, i));
        if (i >= fullText.length) {
          clearInterval(intervalId);
          Animated.timing(translateYAnim, {
            toValue: -250, 
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setShowPoweredBy(true);
            Animated.stagger(200, [
                Animated.timing(line1Anim, { toValue: 0, duration: 800, useNativeDriver: true }),
                Animated.timing(line2Anim, { toValue: 0, duration: 800, useNativeDriver: true })
            ]).start(() => {
                setTextAnimationComplete(true);
            });
        });
        }
      }, 80);

      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
      return () => clearInterval(intervalId);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground 
        source={{ uri: 'https://image2url.com/r2/default/images/1773477843779-19831b65-912e-4467-adeb-a0b64a1a0585.png' }}
        style={styles.container}
    >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }}>
            <Text style={styles.text}>{text}</Text>
        </Animated.View>

        {showPoweredBy && (
            <View style={styles.poweredByWrapper}>
                <View style={styles.poweredByContainer}>
                    <Animated.View style={{ transform: [{ translateY: line1Anim }] }}>
                        <Text style={styles.poweredByText}>
                            Powered by <Text style={styles.highlightedText}>Tech</Text>
                        </Text>
                    </Animated.View>
                </View>
                <View style={styles.poweredByContainer}>
                    <Animated.View style={{ transform: [{ translateY: line2Anim }] }}>
                        <Text style={styles.poweredByText}>
                            Driven with <Text style={styles.highlightedText}>Pride</Text>
                        </Text>
                    </Animated.View>
                </View>
            </View>
        )}

        {isTextAnimationComplete && (
            <>
                <Animated.View style={[styles.bellIcon, { opacity: bellOpacity }]}>
                    <TouchableOpacity onPress={handleBellPress} disabled={isBellAnimating}>
                        <MaterialCommunityIcons name="bell" color="#ffffff" size={23} />
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.swipeButtonContainer}>
                    <CustomSwipeButton onSwipeSuccess={() => router.push('/home')} />
                </View>
            </>
        )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#888888',
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
  },
  poweredByWrapper: {
      position: 'absolute',
      transform: [{ translateY: -175 }],
  },
  poweredByContainer: {
      overflow: 'hidden',
  },
  poweredByText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'center',
    paddingVertical: 0,
  },
  highlightedText: {
    color: '#8c00ff',
  },
  bellIcon: {
      position: 'absolute',
      top: 50,
      right: 35,
  },
  swipeButtonContainer: {
      position: 'absolute',
      bottom: 70,
      width: SWIPE_WIDTH,
      height: THUMB_WIDTH,
      borderRadius: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  swipeContainer: {
    width: SWIPE_WIDTH,
    height: THUMB_WIDTH,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  swipeTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
    color: '#888888',
    position: 'absolute',
    right: 50
  },
  swipeThumb: {
    width: 50,
    height: 50,
    backgroundColor: '#8c00ff',
    borderRadius: 40,
    position: 'absolute',
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
