import React, { useState, useEffect } from 'react';
import { Button, View, Modal, Text, TextInput, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import styles from "../src/Styles";
import * as SQLite from 'expo-sqlite';

//ESCANEAR CLASE

export default function EscanearCurso({navigation, route}) {
    const [cameraRef, setCameraRef] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [isTrainingFinish, setIsTrainingFinish] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [modalVisible, setModalVisible] = useState(true);
    const [readyRecord, setReadyRecord] = useState(false);
    const [modalSeguirEscaneando, setModalSeguirEscaneando] = useState(false);
    const [error, setError] = useState(false);
    const [nombre, setNombre] = React.useState(null);
    const {curso} = route.params;

    const db = SQLite.openDatabase('db');

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos2 (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, curso TEXT);')
    })

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY AUTOINCREMENT,  nombre TEXT);')
  })
    

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);



    const addAlumnos = (alumnos, curso) => {
        console.log("añadiendo alumnos a la base de datos")
        alumnos.forEach(element => {
            console.log("Nombre", element)
            console.log("Curso", curso)
            db.transaction(tx => {
              tx.executeSql('INSERT INTO alumnos2 (nombre, curso) values (?,?)', [element, curso],
                (_, resultSet) => {
                  console.log('Insert successful');
                },
                (_, error) => {
                  console.log('Insert failed', error);
                }
              );
            });
        })
    }

    const newCurso = (cursoTxt) => {
        db.transaction(tx => {
          tx.executeSql('INSERT INTO cursos (nombre) values (?)', [cursoTxt],
          (_, resultSet) => {
            console.log('Insert successful');
          },
          (_, error) => {
            console.log('Insert failed', error);
          })
        })
      }

    const handleRecord = async () => {

        if (cameraRef) {
            if (isRecording) {
                console.log("Parar de grabar")
                cameraRef.stopRecording();
                setIsRecording(false);
                setReadyRecord(false)
                
            } else {
                setIsRecording(true);
                console.log("Empezar a grabar")
                let video = await cameraRef.recordAsync();
                let localUri = video.uri;
                let filename = localUri.split('/').pop();

                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `video/${match[1]}` : `video`;

                let formData = new FormData();
                formData.append('video', { uri: localUri, name: filename, type });
                formData.append('curso', curso); 
                formData.append('nombre', nombre); 

                axios.post('http://192.168.1.137:5000/add', formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                }).then(res => {
                    console.log('Upload Successful');
                    setModalSeguirEscaneando(true);
                  }).catch(err => {
                    console.log('Upload Failed', err);
                    setError(true);
                  });
            }
        }

    };

    const getNames = async (curso) => {

        console.log("Obteniendo nombres..")
        try {
          const response = await axios.post('http://192.168.1.137:5000/get_names', { curso });
          const data = response.data;
          addAlumnos(data, curso)
        } catch (error) {
          console.error(error);
        }
      }


    const realizarEntrenamiento = async () => {

        let formData = new FormData();
        formData.append('curso', curso); 
        setModalSeguirEscaneando(false);
        setIsTraining(true)
        console.log('Empezando entrenamiento...');

        axios.post('http://192.168.1.137:5000/training', formData, {
            headers: {
               'content-type': 'multipart/form-data',
            },
            }).then(res => {
                console.log(res)          
                newCurso(curso)
                setIsTraining(false)
                setIsTrainingFinish(true)
                getNames(curso)
                
              }).catch(err => {
                setIsTraining(false);
                setError(true);
                console.log('Upload Faileddd', err);
                
              });        
    }     

   

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return(
        <>

        {readyRecord && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText2}>Alumno: {nombre}</Text>
        </View>
      )}

        {isRecording && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Escaneando...</Text>
        </View>
      )}

        {isTraining && (
                <View style={styles.messageContainer}>
                <Text style={styles.messageText}>Entrenando...</Text>
                </View>
            )}

           

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        } }    
        >      
  
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
  
            <View style={{ alignItems: 'center', padding: 20, paddingTop: 1, paddingLeft: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 25 }}>Añadir Alumno</Text>
            </View>
  
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Nombre: </Text>
  
              <TextInput 
                style={styles.inputAñadir}
                onChangeText={(text) => setNombre(text)}
                onSubmitEditing={() => {alert(curso)}}
              />
            </View>
  
            <View style={{ alignItems: "center", padding: 20, marginLeft: 25, paddingTop: 40 }}>
              
              <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); setReadyRecord(true);  } 
                }>
                <View style={styles.botonRepetirEscaneo}>
                  <Text style={{ fontSize: 18 }}>Escanear alumno</Text>
                </View>
              </TouchableOpacity>
  
            </View>
  
          </View>
  
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSeguirEscaneando}
        onRequestClose={() => {
          setModalSeguirEscaneando(!modalSeguirEscaneando);
        } }    
        >      
  
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
  
            <View style={{ alignItems: 'center', padding: 20, paddingTop: 1, paddingLeft: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 25 }}>¿Desea seguir escaneando?</Text>
            </View>
  
  
            <View style={{ alignItems: "center", padding: 20, marginLeft: 25, paddingTop: 20 }}>
              
              <TouchableOpacity onPress={() => { setModalSeguirEscaneando(false);  setModalVisible(true);  } 
                }>
                <View style={styles.botonRepetirEscaneo}>
                  <Text style={{ fontSize: 18 }}>Escanear otro alumno</Text>
                </View>
              </TouchableOpacity>

              <View style={{ width: 20, height: 30 }}></View>

              <TouchableOpacity onPress={() => { setModalSeguirEscaneando(false); realizarEntrenamiento(); } 
                }>
                  
                <View style={styles.botonRepetirEscaneo}>
                  <Text style={{ fontSize: 18}}>Realizar entrenamiento</Text>
                </View>
              </TouchableOpacity>
  
            </View>
  
          </View>
  
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTraining}
        onRequestClose={() => {
          setIsTraining(!isTraining);
        } }    
        >        
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
  
            <View style={{ alignItems: 'center', padding: 20, paddingTop: 1, paddingLeft: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 25, paddingTop: 30 }}>Realizando entrenamiento...</Text>
            </View>
   
          </View>
  
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTrainingFinish}
        onRequestClose={() => {
            setIsTrainingFinish(!isTrainingFinish);
        } }    
        >        
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
  
            <View style={{ alignItems: 'center', padding: 20, paddingTop: 1, paddingLeft: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 25 }}>Se ha terminado el entrenamiento</Text>
            </View>

            <TouchableOpacity onPress={() => { navigation.navigate('Inicio') } 
                }>
                <View style={styles.botonRepetirEscaneo}>
                  <Text style={{ fontSize: 18 }}>Inicio</Text>
                </View>
              </TouchableOpacity>
   
          </View>
  
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={error}
        onRequestClose={() => {
            setIsTrainingFinish(!error);
        } }    
        >        
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
  
            <View style={{ alignItems: 'center', padding: 20, paddingTop: 1, paddingLeft: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 25 }}>Error al intentar realizar el entrenamiento</Text>
            </View>

            <TouchableOpacity onPress={() => { navigation.navigate('Inicio') } 
                }>
                <View style={styles.botonRepetirEscaneo}>
                  <Text style={{ fontSize: 18 }}>Inicio</Text>
                </View>
              </TouchableOpacity>
   
          </View>
  
        </View>
      </Modal>

        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={ref => setCameraRef(ref)}>
                <View style={{ flex: 1, justifyContent: 'flex-end', margin: 20 }}>
                {!modalVisible && (
                    <Button
                        title={isRecording ? "Stop Recording" : "Start Recording"}
                        onPress={handleRecord}
                    />
                    )}
                </View>
            </Camera>
        </View></>
    );
}
