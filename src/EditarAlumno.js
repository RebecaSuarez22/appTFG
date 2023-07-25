import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image, Button, Alert, TextInput, TouchableOpacity, ScrollView, Icon, Modal, Pressable} from "react-native";
import styles from "./Styles"
import borrar from "../assets/borrar.png"
import * as SQLite from 'expo-sqlite';
import imgX from "../assets/x.png"
import chica1 from "../assets/caraChica1.png"


function editarDatos(nombre, curso,id){
    const db = SQLite.openDatabase('db');

    db.transaction(tx => {
      tx.executeSql('UPDATE alumnos2 SET nombre = ?, curso = ? WHERE id = ? ', [nombre,curso,id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = this.state.data.filter(data => {
              if (data.id === id)
                return false
              else6
                return true
            })
            this.setState({ data: newList })
          }
        })
    })

}

function EditarAlumno ({navigation, route}) {    

    let [userNombre, setUserNombre] = useState('');
    let [userCurso, setUserCurso] = useState(''); 
    let [userImg, setUserImg] = useState(''); 

    const [inputNombre, inputSetNombre] = React.useState(null);
    const [inputCurso, inputSetCurso] = React.useState(null);

    const {id} = route.params;

    const [modalBorrarAlumno, setModalBorrarAlumno] = useState(false);

    

    const db = SQLite.openDatabase('db');

    function borrarAlumno(id){
        db.transaction(tx => {
            tx.executeSql('DELETE FROM alumnos2 WHERE id = ? ', [id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  console.log(resultSet)
                  let newList = this.state.data.filter(data => {
                    if (data.id === id)
                      return false
                    else
                      return true
                  })
                  this.setState({ data: newList })
                }
              })        
         })
         
         tx.executeSql('DELETE FROM historicoAlumno WHERE idAlumno = ? ', [id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  console.log(resultSet)
                  let newList = this.state.data.filter(data => {
                    if (data.id === id)
                      return false
                    else
                      return true
                  })
                  this.setState({ data: newList })
                }
            })      
         
    } ;

    //Metodo para obtener los datos del alumnos
    let updateAllStates = (nombre, curso, img) => {
        setUserNombre(nombre);
        setUserCurso(curso);
        setUserImg(img);
      };

    db.transaction((tx) => {
        tx.executeSql(
           'SELECT * FROM alumnos2 WHERE id=?',[id],
            (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                    let res = results.rows.item(0);
                    updateAllStates(
                        res.nombre,
                        res.curso
                    );
                }else{
               // alert('No user found');
                updateAllStates('', '', '');
                }
            }
        );
    });


    return( 
        <ScrollView> 
            {/*Modal para confirmar borrar alumno*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalBorrarAlumno}
                onRequestClose={() => {
                    setModalBorrarAlumno(!modalBorrarAlumno);
                }}
            >

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable  onPress={() => setModalBorrarAlumno(!modalBorrarAlumno)}>
                        <Image style={{height:20, width:20}}
                            source={imgX}          
                        />
                    </Pressable >

                    <View style={{alignItems:'center',padding:20,paddingTop:1,paddingLeft:30}}>
                        <Text style={{fontSize:24,fontWeight:'bold',paddingLeft:25}}>¿Desea borrar al alumno {userNombre}?</Text>
                    </View>


                    <View style = {{alignItems: "center",  padding:15,marginLeft:25}}>
                        <TouchableOpacity onPress={() => { borrarAlumno(id); navigation.navigate('Modificar Alumnos', {curso : inputCurso}); }}>
                            <View style={styles.botonBorrarAlumno}> 
                                <Text style={{fontSize:18}}>Borrar</Text>
                            </View>
                        </TouchableOpacity>                   
                    </View>    
              
                </View>

            </View>
            </Modal>

            

        <View style = {styles.container}>
            <View style={styles.cursoContainer}>
                
            <View style={{alignItems:"center",flexDirection: "row"}}>
                <View style={{width:135, paddingLeft:25}}>

                    {/* Boton borrar alumno*/}
                    <TouchableOpacity onPress={() => setModalBorrarAlumno(true)}>
                        <Image style={{height:50, width:50}}
                            source={borrar}          
                        />  
                    </TouchableOpacity>
                </View> 
                <Text style={styles.titulo}>{userNombre}</Text>

            </View>

            {/* Imagen alumno */}
            <View style={{alignItems:"center", marginTop:10,marginBottom:20}}>
                <Image style={{height:150, width:150}}
                    source={chica1}          
                /> 
            </View>

            {/* Boton repetir escaneo */}
            <View style = {{alignItems: "center",  paddingBottom:20}}>
                <TouchableOpacity>
                    <View style={styles.botonRepetirEscaneo}> 
                        <Text style={{fontSize:18,fontWeight: 'bold'}}>Repetir Escaneo</Text>
                    </View>
                </TouchableOpacity>
               
            </View>

            {/* Datos alumno */}
            <View style = {styles.editarInput}>
                <Text style = {styles.tituloEditar}>Nombre: </Text>  
                <TextInput
                    style={styles.input}  
                    onChangeText={(text) => inputSetNombre(text)} 
                    placeholder={userNombre}
                />              
            </View>
            <View style = {styles.editarInput}>
                <Text style = {styles.tituloEditar}>Curso: </Text>  
                <TextInput
                    style={styles.input}     
                    onChangeText={(text) => inputSetCurso(text)}    
                    placeholder={userCurso}
                    
                />              
            </View>
                

            <View style = {{width: 420,height:80}}>
            </View>

               
            {/* Boton guardar */}
            <View style = {styles.editarBotones}>
                <TouchableOpacity onPress={() => { editarDatos(inputNombre, inputCurso, id); navigation.navigate('Modificar Alumnos',{curso: inputCurso,})}}>
                    <View style={styles.contenedorBotonGuardar}> 
                        <Text style={{fontSize:20,fontWeight: 'bold'}}>Guardar</Text>
                    </View>
                </TouchableOpacity>      
            </View>
               
    
            </View>
        </View>
        </ScrollView>
      );
    };
export default EditarAlumno