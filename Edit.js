import React, { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { datasource } from "./Data.js"; // Assuming datasource is your initial data

const Edit = ({ navigation, route }) => {
  const { ISBN, title, copies, imageUrl } = route.params;

  const [newTitle, setNewTitle] = useState(title);
  const [newISBN, setNewISBN] = useState(ISBN);
  const [newCopies, setNewCopies] = useState(copies.toString());
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem("movieData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleSave = async () => {
    if (!newTitle || !newISBN || !newCopies || !newImageUrl) {
      Alert.alert(
        "Validation Error",
        "All fields are required. Please fill in all the details."
      );
      return;
    }

    try {
      const datastr = await AsyncStorage.getItem("movieData");
      const data = datastr ? JSON.parse(datastr) : datasource;

      // Find and update the movie based on the original ISBN
      const updatedData = data[0].data.map((movie) => {
        if (movie.ISBN === ISBN) {
          return {
            ...movie,
            title: newTitle,
            ISBN: newISBN,
            copies: parseInt(newCopies),
            imageUrl: newImageUrl,
          };
        }
        return movie;
      });

      // Save the updated data back to AsyncStorage
      data[0].data = updatedData;
      await saveData(data);

      // Navigate back to the home screen
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Are you sure?", "This action cannot be undone.", [
      {
        text: "Yes",
        onPress: async () => {
          try {
            const datastr = await AsyncStorage.getItem("movieData");
            const data = datastr ? JSON.parse(datastr) : datasource;

            // Use original ISBN to delete the movie
            data[0].data = data[0].data.filter((movie) => movie.ISBN !== ISBN);
            await saveData(data);

            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          } catch (error) {
            console.error("Error deleting data: ", error);
          }
        },
      },
      { text: "No" },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <Text style={styles.label}>Edit Title:</Text>
      <TextInput
        style={styles.textBox}
        value={newTitle}
        onChangeText={setNewTitle}
        placeholder="Enter new title"
      />
      <Text style={styles.label}>Edit ISBN:</Text>
      <TextInput
        style={styles.textBox}
        value={newISBN}
        onChangeText={setNewISBN}
        placeholder="Enter new ISBN"
      />
      <Text style={styles.label}>Edit Number of Copies:</Text>
      <TextInput
        style={styles.textBox}
        value={newCopies}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) {
            // Allow only digits
            setNewCopies(text);
          }
        }}
        placeholder="Enter new number of copies"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Edit Image URL:</Text>
      <TextInput
        style={styles.textBox}
        value={newImageUrl}
        onChangeText={setNewImageUrl}
        placeholder="Enter new image URL"
      />
      <Image source={{ uri: newImageUrl }} style={styles.imagePreview} />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Save" onPress={handleSave} />
        </View>
        <View style={styles.button}>
          <Button title="Delete" color="red" onPress={handleDelete} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
  textBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  imagePreview: { width: 150, height: 225, marginBottom: 20, borderRadius: 5 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default Edit;
