import { app, database } from './firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';

const Stack = createNativeStackNavigator();

const Header1 = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => 
        Alert.alert('Info', '- Enter the name of your note in the input box and press "Add Note". \n- Press the name of the note to edit the content of the note.')}>
        <Image source={require('./tooltip_icon.png')} style={styles.tooltipIcon} />
      </TouchableOpacity>
      <Text style={styles.header}>Note Index</Text>
    </View>
  );
};

const Header2 = ({ editableTitle }) => {
  return <Text style={styles.header}>{editableTitle || 'New Note'}</Text>;
};

const InputFields1 = ({ title, setTitle, content, setContent }) => {
  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder="Note Title"
        onChangeText={(txt) => setTitle(txt)}
        value={title}
      />
      <TextInput
        style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Note Content"
        onChangeText={(txt) => setContent(txt)}
        value={content}
        multiline
      />
    </View>
  );
};

const InputFields2 = ({ editableTitle, setEditableTitle, editableContent, setEditableContent }) => {
  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder="Note Title"
        value={editableTitle}
        onChangeText={(text) => setEditableTitle(text)}
      />
      <TextInput
        style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Note Content"
        value={editableContent}
        onChangeText={(text) => setEditableContent(text)}
        multiline
      />
    </View>
  );
};

const AddNoteButton = ({ addBtnPressed }) => {
  return <Button title="Add Note" onPress={addBtnPressed} color="#FED95C" />;
};

const Page1 = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [values, loading, error] = useCollection(collection(database, 'notes'));
  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const buttonHandler = async () => {
    try {
      await addDoc(collection(database, "notes"), {
        title: title,  // save the title
        content: content,  // save the content
      });
    } catch (err) {
      console.log("fejl i buttonHandler: " + err);
    }
  };

  async function deleteDocument(id) {
    await deleteDoc(doc(database, "notes", id));
  }

  const addBtnPressed = async () => {
    if (title.trim() !== "") {
      setNotes((prevNotes) => [...prevNotes, { title, content }]);
      setTitle("");
      setContent("");  // reset content
      await buttonHandler();
    }
  };

  const goToPage2WithNote = (note) => {
    navigation.navigate("Page2", { note });
  };

  return (
    <ImageBackground source={require('./background.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Header1 />
        <InputFields1 title={title} setTitle={setTitle} content={content} setContent={setContent} />
        <AddNoteButton addBtnPressed={addBtnPressed} />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={[styles.noteContainer, { backgroundColor: 'rgba(254, 217, 92, 0.25)' }]}>
              <TouchableOpacity onPress={() => goToPage2WithNote(item)}>
                <Text style={styles.listItem}>{item.title.substring(0, 20)}</Text>
              </TouchableOpacity>
              <Button title="Delete" onPress={() => deleteDocument(item.id)} color="#FED95C" />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ImageBackground>
  );
};

const Page2 = ({ navigation, route }) => {
  const [editableTitle, setEditableTitle] = useState(route.params?.note?.title || "");
  const [editableContent, setEditableContent] = useState(route.params?.note?.content || "");

  useEffect(() => {
    navigation.setOptions({ title: editableTitle || "New Note" });
  }, [editableTitle, navigation]);

  const updateNoteInFirestore = async (id, updatedTitle, updatedContent) => {
    const noteRef = doc(database, "notes", id);

    try {
      await updateDoc(noteRef, {
        title: updatedTitle,
        content: updatedContent,
      });
    } catch (err) {
      console.log("Error updating document: ", err);
    }
  };

  const saveAndGoBack = () => {
    if (route.params?.note?.id) { // Only update if there's an ID, meaning it's an existing note
      updateNoteInFirestore(route.params.note.id, editableTitle, editableContent);
    }
    navigation.navigate("Page1");
  };

  return (
    <ImageBackground source={require('./background.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Header2 editableTitle={editableTitle} />
        <InputFields2
          editableTitle={editableTitle}
          setEditableTitle={setEditableTitle}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
        />
        <Button title="Save" onPress={saveAndGoBack} color="#FED95C" />
      </View>
    </ImageBackground>
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
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingTop: 50,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tooltipIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 3,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItem: {
    maxWidth: '80%',
  },
});
