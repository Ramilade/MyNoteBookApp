import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const Stack = createNativeStackNavigator();

const Page1 = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (route.params?.updatedNote && route.params?.noteIndex !== undefined) {
      const updatedNotes = [...notes];
      updatedNotes[route.params.noteIndex] = route.params.updatedNote;
      setNotes(updatedNotes);
    }
  }, [route.params?.updatedNote, route.params?.noteIndex]);

  const addNote = () => {
    if (title.trim()) {
      setNotes([...notes, { title, content: '' }]);
      setTitle('');
    }
  };

  const deleteNote = (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Note Index</Text>
      <View style={styles.centeredContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Note Title"
          value={title}
          onChangeText={setTitle}
        />
        <Button title="Add Note" onPress={addNote} color="#ff0000" />
      </View>
      <FlatList
        data={notes}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Page2', { note: item, noteIndex: index })}>
              <Text style={styles.listItem}>{item.title}</Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => deleteNote(index)} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const Page2 = ({ navigation, route }) => {
  const [editableTitle, setEditableTitle] = useState(route.params?.note?.title || '');
  const [editableContent, setEditableContent] = useState(route.params?.note?.content || '');

  const saveAndGoBack = () => {
    navigation.navigate('Page1', { updatedNote: { title: editableTitle, content: editableContent }, noteIndex: route.params.noteIndex });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editableTitle || 'New Note'}</Text>
      <View style={styles.centeredContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Note Title"
          value={editableTitle}
          onChangeText={setEditableTitle}
        />
        <TextInput
          style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Note Content"
          value={editableContent}
          onChangeText={setEditableContent}
          multiline
        />
        <Button title="Save" onPress={saveAndGoBack} />
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Page1">
        <Stack.Screen name="Page1" component={Page1} options={{ title: 'Note Index' }} />
        <Stack.Screen name="Page2" component={Page2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  centeredContainer: {
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 8,
  },
  listItem: {
    fontSize: 18,
    flex: 1,
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    width: '100%',
  },
});
