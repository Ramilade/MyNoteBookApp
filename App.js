import { app, database } from './firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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

const Header1 = () => (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() =>
            Alert.alert('Info', '- Enter the name of your note in the input box and press "Add Note". \n- Press the name of the note to edit the content of the note.')}>
            <Image source={require('./tooltip_icon.png')} style={styles.tooltipIcon} />
        </TouchableOpacity>
        <Text style={styles.header}>Note Index</Text>
    </View>
);

const Header2 = ({ editableTitle }) => <Text style={styles.header}>{editableTitle || 'New Note'}</Text>;

const InputFields1 = ({ title, setTitle, content, setContent }) => (
    <View>
        <TextInput style={styles.textInput} placeholder="Note Title" onChangeText={(txt) => setTitle(txt)} value={title} />
        <TextInput style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]} placeholder="Note Content" onChangeText={(txt) => setContent(txt)} value={content} multiline />
    </View>
);

const InputFields2 = ({ editableTitle, setEditableTitle, editableContent, setEditableContent }) => (
    <View>
        <TextInput style={styles.textInput} placeholder="Note Title" value={editableTitle} onChangeText={(text) => setEditableTitle(text)} />
        <TextInput style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]} placeholder="Note Content" value={editableContent} onChangeText={(text) => setEditableContent(text)} multiline />
    </View>
);

const AddNoteButton = ({ addBtnPressed }) => <Button title="Add Note" onPress={addBtnPressed} color="#FED95C" />;

const Page1 = ({ navigation, route }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [values, loading, error] = useCollection(collection(database, 'notes'));
    const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const addNoteToFirestore = async () => {
        try {
            await addDoc(collection(database, "notes"), { title, content });
        } catch (err) {
            console.error("Error in addNoteToFirestore: ", err);
        }
    };

    const deleteDocument = async (id) => {
        try {
            await deleteDoc(doc(database, "notes", id));
        } catch (err) {
            console.error("Error in deleteDocument: ", err);
        }
    };

    const addBtnPressed = async () => {
        if (title.trim() !== "") {
            setTitle("");
            setContent("");
            await addNoteToFirestore();
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
                                <Text style={styles.listItem}>{item.title}</Text>
                            </TouchableOpacity>
                            <View style={styles.smallerButton}>
                                <Button title="Delete" onPress={() => deleteDocument(item.id)} color="#FED95C" />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </ImageBackground>
    );
};

const Page2 = ({ navigation, route }) => {
    const note = route.params?.note;
    const [editableTitle, setEditableTitle] = useState(note?.title || "");
    const [editableContent, setEditableContent] = useState(note?.content || "");

    const updateNoteInFirestore = async () => {
        try {
            if (note && note.id) {
                await updateDoc(doc(database, "notes", note.id), {
                    title: editableTitle,
                    content: editableContent,
                });
            }
        } catch (err) {
            console.error("Error in updateNoteInFirestore: ", err);
        }
    };

    const saveAndGoBack = async () => {
        await updateNoteInFirestore();
        navigation.navigate("Page1");
    };

    useEffect(() => {
        navigation.setOptions({ title: editableTitle || "New Note" });
    }, [editableTitle, navigation]);

    return (
        <ImageBackground source={require('./background.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Header2 editableTitle={editableTitle} />
                <InputFields2 editableTitle={editableTitle} setEditableTitle={setEditableTitle} editableContent={editableContent} setEditableContent={setEditableContent} />
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
    backgroundImage: { flex: 1 },
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
        textAlign: 'center',
    },
    tooltipIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    textInput: {
        width: '100%',
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
    noteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 8,
        padding: 8,
    },
    smallerButton: {
        width: '80%',
    },
});
