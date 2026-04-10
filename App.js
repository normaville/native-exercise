import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text } from '@rneui/themed';

// Data Structure
const EXERCISES = [
  { id: '1', name: 'Push Ups', type: 'repetition', suggested: 'Plank' },
  { id: '2', name: 'Running', type: 'duration', suggested: 'Push Ups' },
  { id: '3', name: 'Plank', type: 'duration', suggested: 'Running' },
  { id: '4', name: 'Sit Ups', type: 'repetition', suggested: 'Plank' },
];

const Stack = createStackNavigator();

// Home
function HomeScreen({ navigation, route }) {
  const exercises = route.params?.exercises || EXERCISES;

  return (
    <View style={styles.container}>
      <Text h4 style={styles.headerText}>Exercises</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            containerStyle={styles.listButton}
            onPress={() => {
              const screen = item.type === 'repetition' ? 'Repetition' : 'Duration';
              navigation.navigate(screen, { exercise: item, allExercises: exercises });
            }}
          />
        )}
      />
    </View>
  );
}

// Repetition Exercise
function RepetitionScreen({ route, navigation }) {
  const { exercise, allExercises } = route.params;
  const [count, setCount] = useState(0);

  return (
    <View style={styles.containerCenter}>
      <Text h2>{exercise.name}</Text>
      <Text h1 style={styles.display}>{count}</Text>
      <Button title="Count +" onPress={() => setCount(count + 1)} containerStyle={styles.mainBtn} />
      <Button title="Reset" type="outline" onPress={() => setCount(0)} containerStyle={styles.mainBtn} />
      
      <View style={styles.navRow}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button 
          title={`Next: ${exercise.suggested}`} 
          onPress={() => {
            const next = allExercises.find(ex => ex.name === exercise.suggested);
            navigation.push(next.type === 'repetition' ? 'Repetition' : 'Duration', { exercise: next, allExercises });
          }} 
        />
      </View>
    </View>
  );
}

// Duration Exercise
function DurationScreen({ route, navigation }) {
  const { exercise, allExercises } = route.params;
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.containerCenter}>
      <Text h2>{exercise.name}</Text>
      <Text h1 style={styles.display}>{formatTime(seconds)}</Text>
      <Button title={running ? "Stop" : "Start"} onPress={() => setRunning(!running)} containerStyle={styles.mainBtn} />
      <Button title="Reset" type="outline" onPress={() => { setSeconds(0); setRunning(false); }} containerStyle={styles.mainBtn} />
      
      <View style={styles.navRow}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button 
          title={`Next: ${exercise.suggested}`} 
          onPress={() => {
            const next = allExercises.find(ex => ex.name === exercise.suggested);
            navigation.push(next.type === 'repetition' ? 'Repetition' : 'Duration', { exercise: next, allExercises });
          }} 
        />
      </View>
    </View>
  );
}

// App Export
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} initialParams={{ exercises: EXERCISES }} />
        <Stack.Screen name="Repetition" component={RepetitionScreen} />
        <Stack.Screen name="Duration" component={DurationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f4f4f4',
    alignItems: 'center'
  },
  containerCenter: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  headerText: { 
    textAlign: 'center', 
    marginVertical: 20 
  },
  listButton: { 
    marginBottom: 10,
    width: 250,
    borderRadius: 10 
  },
  mainBtn: { 
    width: 250, 
    marginBottom: 10 
  },
  display: { 
    marginVertical: 40, 
    fontSize: 60 
  },
  navRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 30 
  }
});

