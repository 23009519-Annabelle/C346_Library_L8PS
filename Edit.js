import React, { useState } from "react";
import { StatusBar, View, Text, TextInput, Button, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { datasource } from "./Data.js";

const Edit = ({ navigation, route }) => {
  const { imdbId, title, copies, imageUrl } = route.params;

  const [newTitle, setNewTitle] = useState(title);
  const [newImdbId, setNewImdbId] = useState(imdbId);
  const [newCopies, setNewCopies] = useState(copies.toString());
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);

  const saveData = async (data) => {
    await AsyncStorage.setItem("movieData", JSON.stringify(data));
  };

  const handleSave = async () => {
    if (!newTitle || !newImdbId || !newCopies || !newImageUrl) {
      Alert.alert("Validation Error", "All fields are required. Please fill in all the details.");
      return;
    }

    const datastr = await AsyncStorage.getItem("movieData");
    const data = datastr ? JSON.parse(datastr) : datasource;

    const updatedData = data[0].data.map((movie) =>
      movie.imdbId === newImdbId
        ? { ...movie, title: newTitle, copies: parseInt(newCopies), imageUrl: newImageUrl }
        : movie
    );
    data[0].data = updatedData;
    await saveData(data);
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const handleDelete = async () => {
    Alert.alert("Are you sure?", "This action cannot be undone.", [
      {
        text: "Yes",
        onPress: async () => {
          const datastr = await AsyncStorage.getItem("movieData");
          const data = datastr ? JSON.parse(datastr) : datasource;

          data[0].data = data[0].data.filter((movie) => movie.imdbId !== newImdbId);
          await saveData(data);
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
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
      <Text style={styles.label}>Edit IMDb ID:</Text>
      <TextInput
        style={styles.textBox}
        value={newImdbId}
        onChangeText={setNewImdbId}
        placeholder="Enter new IMDb ID"
      />
      <Text style={styles.label}>Edit Number of Copies:</Text>
      <TextInput
        style={styles.textBox}
        value={newCopies}
        onChangeText={setNewCopies}
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
  textBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#fff", marginBottom: 20 },
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
