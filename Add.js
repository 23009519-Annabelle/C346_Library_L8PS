import React, { useState } from "react";
import {
  StatusBar,
  View,
  Button,
  Text,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Add = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [ISBN, setISBN] = useState("");
  const [copies, setCopies] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const setData = async (value) => {
    AsyncStorage.setItem("movieData", value);
    navigation.navigate("Home"); // After saving, the app navigates back to the Home screen.
  };

  console.log("Copies:", copies);
  console.log("Image URL:", imageUrl);

  return (
    <View style={styles.container}>
      <StatusBar />
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.textBox}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter movie title"
      />
      <Text style={styles.label}>ISBN:</Text>
      <TextInput
        style={styles.textBox}
        onChangeText={(text) => setISBN(text)}
        placeholder="Enter ISBN"
      />
      <Text style={styles.label}>Number of Copies:</Text>
      <TextInput
        style={styles.textBox}
        onChangeText={(text) => setCopies(text)}
        placeholder="Enter number of copies"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Image URL:</Text>
      <TextInput
        style={styles.textBox}
        onChangeText={(text) => setImageUrl(text)}
        placeholder="Enter image URL"
      />
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.imagePlaceholder}>
          Image preview will appear here
        </Text>
      )}
      <Button
        title="Submit"
        onPress={() => {
          let mydata = JSON.parse(route.params.datastring);
          let newMovie = {
            title: title,
            ISBN: ISBN,
            copies: parseInt(copies),
            imageUrl: imageUrl,
          };
          // Add new movie to the first section's data array
          mydata[0].data.push(newMovie);

          // Convert updated data to string for AsyncStorage
          let stringdata = JSON.stringify(mydata);

          // Save data and navigate back to Home
          setData(stringdata);
        }}
        color="#4CAF50"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePlaceholder: {
    textAlign: "center",
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: 20,
  },
});

export default Add;
