import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const ImagePage = ({ route }) => {
  const { image } = route.params;
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    loadImage();
  }, []);

  const loadImage = async () => {
    try {
      const fileUri = image.uri;
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageDataUri = `data:image/jpeg;base64,${base64Data}`;
      setImageData(imageDataUri);
    } catch (error) {
      console.log('Error al cargar la imagen:', error);
    }
  };

  return (
    <View style={styles.container}>
      {imageData && (
        <Image source={{ uri: imageData }} style={styles.image} resizeMode="contain" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default ImagePage;


