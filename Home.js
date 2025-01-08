import React, { useState, useEffect } from "react";
import {
  StatusBar,
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { datasource } from "./Data.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  textStyle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 5,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  opacityStyle: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    overflow: "hidden",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: 5,
    overflow: "hidden",
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  movieRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  addButtonContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const Home = ({ navigation }) => {
  const [mydata, setMydata] = useState([]);

  const getData = async () => {
    let datastr = await AsyncStorage.getItem("movieData");
    if (datastr != null) {
      let jsondata = JSON.parse(datastr); // Convert the stored string to JSON
      setMydata(jsondata); // Set the data
    } else {
      setMydata(datasource); // Fallback to initial datasource
    }
  };

  // Fetch data from AsyncStorage when the component mounts
  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.opacityStyle}
        onPress={() => {
          navigation.navigate("Edit", {
            imdbId: item.imdbId,
            title: item.title,
            copies: item.copies,
            imageUrl: item.imageUrl,
          });
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.posterImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.titleStyle}>{item.title}</Text>
          <Text style={styles.textStyle}>IMDb ID: {item.imdbId}</Text>
          <Text style={styles.textStyle}>Copies Owned: {item.copies}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            let datastr = JSON.stringify(mydata);
            navigation.navigate("Add", { datastring: datastr });
          }}
        >
          <Text style={styles.addButtonText}>Add Movie</Text>
        </TouchableOpacity>
      </View>
      <SectionList
        sections={mydata}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title, bgcolor } }) => (
          <Text style={[styles.headerText, { backgroundColor: bgcolor }]}>{title}</Text>
        )}
        keyExtractor={(item, index) => item.imdbId + index}
      />
    </View>
  );
};

export default Home;
