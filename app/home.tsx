import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, Montserrat_500Medium } from '@expo-google-fonts/montserrat';

export default function HomePage() {
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Text style={styles.subtitle}>You have successfully unlocked the bike!</Text>
      <Link href="/" style={styles.link}>Go back</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
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
  }
});
