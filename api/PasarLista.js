import React, { useState, useEffect } from 'react';
import { Button, View, Modal, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import styles from "../src/Styles";
import * as SQLite from 'expo-sqlite';

export default function EscanearCurso({ navigation, route }) {
  const [cameraRef, setCameraRef] = useState(null);
  const [isTrainingFinish, setIsTrainingFinish] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [asistencia, setAsistencia] = useState(null);
  const { curso } = route.params;

  const db = SQLite.openDatabase('db');

  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS historicoAlumno (id INTEGER PRIMARY KEY AUTOINCREMENT,  idAlumno INTEGER, fecha TEXT, asistencia TEXT);')
})    


  useEffect(() => {
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const agregarAsis = (alumnos) => {
    console.log("Agregando asistencia..")
    const fecha = new Date().toISOString().split('T')[0]; // Fecha actual

    db.transaction(tx => {
      Object.entries(alumnos).forEach(([nombre, asistencia]) => {
        var asis = ""
        if(asistencia == "1"){
          asis="si"
        }else{
          asis="no"
        }
        tx.executeSql(
          'SELECT id FROM alumnos2 WHERE nombre = ?',[nombre],  //Buscamos en la base de datos el id del alumno
          (_, { rows }) => {
            if (rows.length > 0) {                            //Si lo encuentra
              const idAlumno = rows.item(0).id;
              tx.executeSql(
                'SELECT * FROM historicoAlumno WHERE idAlumno = ? AND fecha = ?',[idAlumno, fecha],   //Buscamos si ya hay algun registro para ese id el mismo dia
                (_, { rows }) => {
                  if (rows.length > 0) {
                    // Si ya hay un registro para el alumno en esa fecha, actualizar la asistencia
                    tx.executeSql(
                      'UPDATE historicoAlumno SET asistencia = ? WHERE idAlumno = ? AND fecha = ?',  [asis, idAlumno, fecha]
                    );
                  } else {
                    // Si no hay un registro, agregar uno nuevo
                    tx.executeSql(
                      'INSERT INTO historicoAlumno (idAlumno, fecha, asistencia) VALUES (?, ?, ?)', [idAlumno, fecha, asis]
                    );
                  }
                }
              );
            }
          }
        );
      });
    });

  }

  


  const getCapturedPhoto = async () => {
    try {
      const response = await axios.get('http://192.168.1.137:5000/get_photo', {
        params: {
          curso: curso,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const uri = URL.createObjectURL(blob);

      setCapturedPhoto(uri);
      setMostrarImagen(true);
    } catch (error) {
      console.log('Error al obtener la imagen:', error);
    }
  };

  const handleCapture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      let localUri = photo.uri;
      let filename = localUri.split('/').pop();
  
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
  
      let formData = new FormData();
      formData.append('image', { uri: localUri, name: filename, type });
      formData.append('curso', curso);
      formData.append('nombre', nombre);
  
      axios.post('http://192.168.1.137:5000/pasarLista', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }).then(res => {
        console.log('Upload Successful');
        console.log(res.data)
        agregarAsis(res.data)
        setAsistencia(res.data); 
        getCapturedPhoto();
      }).catch(err => console.log('Upload Failed', err));
    }
  };
  
  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var today =  year+'-'+month+'-'+date 

  return (
    <>
      {mostrarImagen ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedPhoto }} style={{ flex: 1 }} />
          <TouchableOpacity style={styles.botonAsistencia} onPress={() => navigation.navigate('Ver Historico', { curso: curso, fecha: today })}>
            <Text style={styles.botonTexto}>Ver historico</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={ref => setCameraRef(ref)}>
            <View style={{ flex: 1, justifyContent: 'flex-end', margin: 20 }}>
              <Button
                title="Sacar Foto"
                onPress={handleCapture}
              />
            </View>
          </Camera>
        </View>
      )}
    </>
  );
}
