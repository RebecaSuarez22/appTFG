import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { RNCamera } from 'react-native-camera';

const { width, height } = Dimensions.get('window');

const PasarLista = ({ navigation, route }) => {
  const { curso } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetected = ({ faces }) => {
    setFaces(faces);
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.front} onFacesDetected={handleFacesDetected}>
        <View style={styles.overlay}>
          {faces.map((face, index) => (
            <View
              key={index}
              style={[
                styles.faceBox,
                {
                  left: face.bounds.origin.x,
                  top: face.bounds.origin.y,
                  width: face.bounds.size.width,
                  height: face.bounds.size.height,
                },
              ]}
            >
              {/* Mostrar el nombre del alumno */}
              <Text style={styles.faceText}>{curso}</Text>
            </View>
          ))}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: 'white',
    fontSize: 16,
    padding: 4,
  },
});

export default PasarLista;