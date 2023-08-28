import React, { useState } from 'react';
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

// Header for Page1
const Header1 = () => {
  return <Text style={styles.header}>Note Index</Text>;
};

// Header for Page2
const Header2 = ({ editableTitle }) => {
  return <Text style={styles.header}>{editableTitle || 'New Note'}</Text>;
};

// Input fields for Page1
const InputFields1 = ({ title, setTitle }) => {
  return (
    <View style={styles.centeredContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Note Title"
        onChangeText={(txt) => setTitle(txt)}
        value={title}
      />
    </View>
  );
};

// Input fields for Page2
const InputFields2 = ({ editableTitle, setEditableTitle, editableContent, setEditableContent }) => {
  return (
    <View style={styles.centeredContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Note Title"
        value={editableTitle}
        onChangeText={(text) => setEditableTitle(text)}
      />
      <TextInput
        style={[styles.textInput, { height: 100 }]}
        placeholder="Note Content"
        value={editableContent}
        onChangeText={(text) => setEditableContent(text)}
        multiline
      />
    </View>
  );
};

// Add Note Button for Page1
const AddNoteButton = ({ addBtnPressed }) => {
  return <Button title="Add Note" onPress={addBtnPressed} color="#ff0000" />;
};

const Page1 = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);

  const addBtnPressed = () => {
    if (title.trim() !== "") {
      setNotes((prevNotes) => [...prevNotes, { title, content: "" }]);
      setTitle("");
    }
  };

  const goToPage2WithNote = (note, index) => {
    navigation.navigate("Page2", { note, noteIndex: index });
  };

  const updatedNote = route.params?.updatedNote;
  const updateIndex = route.params?.noteIndex;

  if (updatedNote && updateIndex !== undefined) {
    notes[updateIndex] = updatedNote;
  }

  return (
    <View style={styles.container}>
      <Header1 />
      <InputFields1 title={title} setTitle={setTitle} />
      <AddNoteButton addBtnPressed={addBtnPressed} />
      <FlatList
        data={notes}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => goToPage2WithNote(item, index)}>
            <Text style={styles.listItem}>{item.title.substring(0, 20)}</Text>
            <View style={styles.separator} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const Page2 = ({ navigation, route }) => {
  const [editableTitle, setEditableTitle] = useState(route.params?.note?.title || "");
  const [editableContent, setEditableContent] = useState(route.params?.note?.content || "");
  const noteIndex = route.params?.noteIndex;

  React.useEffect(() => {
    navigation.setOptions({ title: editableTitle || "New Note" });
  }, [editableTitle, navigation]);

  const saveAndGoBack = () => {
    navigation.navigate("Page1", { updatedNote: { title: editableTitle, content: editableContent }, noteIndex });
  };

  return (
    <View style={styles.container}>
      <Header2 editableTitle={editableTitle} />
      <InputFields2
        editableTitle={editableTitle}
        setEditableTitle={setEditableTitle}
        editableContent={editableContent}
        setEditableContent={setEditableContent}
      />
      <Button title="Save" onPress={saveAndGoBack} />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Page1">
        <Stack.Screen name="Page1" component={Page1} options={{ title: 'Note Index' }} />
        <Stack.Screen name="Page2" component={Page2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  listItem: {
    padding: 10,
    paddingLeft: 0,
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
  },
});
