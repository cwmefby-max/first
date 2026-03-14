import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';

const PulsatingDot = ({ delay = 0 }) => {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true, delay }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return <Animated.View style={[styles.signalDot, { opacity }]} />;
};

export default function HomePage() {
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  const [isBellAnimating, setBellAnimating] = useState(false);
  const bellOpacity = useRef(new Animated.Value(1)).current;

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#3f015b', '#000000']}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            SmartLock
          </Text>
          <PulsatingDot />
          <PulsatingDot delay={800} />
        </View>
        <View style={styles.topIconsContainer}>
            <TouchableOpacity onPress={() => {}} style={{marginRight: 15}}>
                <MaterialCommunityIcons name="gamepad-variant" color="#ffffff" size={23} />
            </TouchableOpacity>
          <Animated.View style={[{ opacity: bellOpacity }]}>
              <TouchableOpacity onPress={handleBellPress} disabled={isBellAnimating}>
                  <MaterialCommunityIcons name="bell" color="#ffffff" size={21} />
              </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Home Page</Text>
        <Text style={styles.subtitle}>You have successfully unlocked the bike!</Text>
        <Link href="/" style={styles.link}>Go back</Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 35,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
  },
  signalDot: {
    width: 8,
    height: 8,
    backgroundColor: '#00ff00',
    borderRadius: 4,
    marginLeft: 12,
  },
  topIconsContainer: {
      flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Montserrat_500Medium',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Montserrat_500Medium',
    marginTop: 10,
  },
  link: {
      marginTop: 20,
      paddingVertical: 10,
      color: '#2e78b7',
      fontSize: 16,
      fontFamily: 'Montserrat_500Medium',
  },
});
