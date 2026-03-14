import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Easing, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
                Animated.timing(arrowTranslateX, { toValue: 10, duration: 500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
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
        <View style={styles.swipeContainer}>
            <Text style={styles.swipeTitle}>Slide to unlock bike</Text>
            <Animated.View
                style={[{ transform: [{ translateX: pan }] }, styles.swipeThumb]}
                {...panResponder.panHandlers}
            >
                <Animated.View style={{ transform: [{ translateX: arrowTranslateX }] }}>
                    <MaterialCommunityIcons name="arrow-right" color="black" size={24} />
                </Animated.View>
            </Animated.View>
        </View>
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
            toValue: -220, 
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
    <LinearGradient colors={['#0D0D0D', 'rgb(0, 0, 0)']}
      style={styles.container}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }}>
            <Text style={styles.text}>{text}</Text>
        </Animated.View>

        {showPoweredBy && (
            <View style={styles.poweredByWrapper}>
                <View style={styles.poweredByContainer}>
                    <Animated.View style={{ transform: [{ translateY: line1Anim }] }}>
                        <Text style={styles.poweredByText}>Powered by Tech</Text>
                    </Animated.View>
                </View>
                <View style={styles.poweredByContainer}>
                    <Animated.View style={{ transform: [{ translateY: line2Anim }] }}>
                        <Text style={styles.poweredByText}>Driven with Pride</Text>
                    </Animated.View>
                </View>
            </View>
        )}

        {isTextAnimationComplete && (
            <>
                <Animated.View style={[styles.bellIcon, { opacity: bellOpacity }]}>
                    <TouchableOpacity onPress={handleBellPress} disabled={isBellAnimating}>
                        <MaterialCommunityIcons name="bell" color="#d5ff40" size={25} />
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.swipeButtonContainer}>
                    <CustomSwipeButton onSwipeSuccess={() => router.push('/home')} />
                </View>
            </>
        )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#d5ff40',
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
  },
  poweredByWrapper: {
      position: 'absolute',
      transform: [{ translateY: -145 }],
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
  },
  swipeContainer: {
    width: SWIPE_WIDTH,
    height: THUMB_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeTitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
    color: '#555555',
    position: 'absolute',
    right: 50
  },
  swipeThumb: {
    width: 50,
    height: 50,
    backgroundColor: '#d5ff40',
    borderRadius: 40,
    position: 'absolute',
    left: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
