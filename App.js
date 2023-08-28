import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";

const Stack = createNativeStackNavigator();

const Page1 = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);

  const addBtnPressed = () => {
    setNotes((prevNotes) => [...prevNotes, { title, content: "" }]);
    setTitle("");
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
      <TextInput
        style={styles.textInput}
        placeholder="Note Title"
        onChangeText={(txt) => setTitle(txt)}
        value={title}
      />
      <Button title="Add Note" onPress={addBtnPressed} />
      <FlatList
        data={notes}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => goToPage2WithNote(item, index)}>
            <Text style={styles.listItem}>{item.title.substring(0, 20)}</Text>
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

  // Update the header title to match the editableTitle
  React.useEffect(() => {
    navigation.setOptions({ title: editableTitle || "New Note" });
  }, [editableTitle, navigation]);

  const saveAndGoBack = () => {
    navigation.navigate("Page1", { updatedNote: { title: editableTitle, content: editableContent }, noteIndex });
  };

  return (
    <View style={styles.container}>
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
      <Button title="Save" onPress={saveAndGoBack} />
    </View>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Page1">
        <Stack.Screen name="Index" component={Page1} />
        <Stack.Screen name="Page2" component={Page2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    paddingTop: 50,
  },
  textInput: {
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  listItem: {
    padding: 10,
    paddingLeft: 0, // Align text to the left
    fontSize: 18,
  },
});
