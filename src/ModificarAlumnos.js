import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image, TextInput, Alert, ScrollView, Modal, TouchableOpacity, Pressable} from "react-native";
import styles from "./Styles"
import editar from "../assets/editar.png"
import añadir from "../assets/añadir.png"
import borrar from "../assets/borrar.png"
import imgX from "../assets/x.png"
import * as SQLite from 'expo-sqlite';
import chica1 from "../assets/caraChica1.png"



function borrarCurso(nombre){
  const db = SQLite.openDatabase('db');

  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS historicoAlumno (id INTEGER PRIMARY KEY AUTOINCREMENT,  idAlumno INTEGER, fecha TEXT, asistencia TEXT);')
  })  
 

  db.transaction(tx => {
    tx.executeSql('DELETE FROM alumnos2 WHERE curso = ? ', [nombre],
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

      tx.executeSql('DELETE FROM cursos WHERE nombre = ? ', [nombre],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = this.state.data.filter(data => {
              if (data.id === id)
                return false
              else
                return true
            })
            this.setState({ data: newList })
          }
        })

        tx.executeSql('DELETE FROM historicoAlumno WHERE curso = ? ', [nombre],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
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
   
}

function ModificarAlumnos ({navigation, route}) {

    const [modalAñadirAlumno, setModalAñadirAlumno] = useState(false);

    const [modalBorrarCurso, setModalBorrarCurso] = useState(false);

    let [flatListItems, setFlatListItems] = useState([]);

    const [inputNombre, inputSetNombre] = React.useState(null);

    const {curso} = route.params;

    const db = SQLite.openDatabase('db');
    


    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos2 (id INTEGER PRIMARY KEY AUTOINCREMENT,  nombre TEXT, curso TEXT);')
  })


    //Seleccion de todos los alumnos
    useEffect(() => {
      db.transaction((tx) => {
       tx.executeSql(
          'SELECT * FROM alumnos2 WHERE curso = ?', [curso],
          (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setFlatListItems(temp);
          }
        );
      });
    }, []);

    //Para cada alumno = item
    let listItemView = (item) => {
      return (
      <View style={styles.listaContainer}>                    
          <View style={styles.listaAlumno}>
                  

              {/* Nombre del alumno */}
              <Text style={styles.textoModificar}>{item.nombre}</Text>

              {/* Boton editar alumno */}
              <TouchableOpacity  onPress={() => {navigation.navigate('Editar Alumno', {id: item.id,});}}>          
                <Image style={{height:50, width:50, marginLeft:20}}
                  source={editar}          
                />  
              </TouchableOpacity> 
                                  
          </View>  
      </View> 
    );
  };

  // Separador alumnos
  let listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.2,
          width: '100%',
          backgroundColor: '#808080'
        }}
      />
    );
  };

  return(     
    <ScrollView>

        {/* Modal para añadir un nuevo alumno */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAñadirAlumno}
          onRequestClose={() => {
            setModalAñadirAlumno(!modalAñadirAlumno);
          }}
        >
            
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable  onPress={() => setModalAñadirAlumno(!modalAñadirAlumno)}>
                <Image style={{height:20, width:20}}
                  source={imgX}          
                />
              </Pressable >

              <View style={{alignItems:'center',padding:20,paddingTop:1,paddingLeft:30}}>
                <Text style={{fontSize:24,fontWeight:'bold',paddingLeft:25}}>Añadir Alumno</Text>
              </View>

              <View style = {{flexDirection: "row",justifyContent: "center"}}>
                <Text style = {{fontWeight:'bold',fontSize:24}}>Nombre: </Text>  
                    <TextInput
                        style={styles.inputAñadir}  
                        onChangeText={(text) => inputSetNombre(text)}  
                    />   
              </View>

              <View style = {{alignItems: "center",  padding:20,marginLeft:25}}>
                    {/* <TouchableOpacity onPress={() => {newItem (inputNombre,curso); setModalAñadirAlumno(!modalAñadirAlumno)}}> */}
                    <TouchableOpacity onPress={() => {navigation.navigate('Escanear Alumno',{nombre: inputNombre, curso: curso}), setModalAñadirAlumno(false)}}>
                        <View style={styles.botonRepetirEscaneo}> 
                            <Text style={{fontSize:18}}>Escanear Alumno</Text>
                        </View>
                    </TouchableOpacity>                   
                </View>    
              
            </View>

          </View>
        </Modal>

        {/*Modal para confirmar borrar curso*/}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalBorrarCurso}
                onRequestClose={() => {
                    setModalBorrarCurso(!modalBorrarCurso);
                }}
            >

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable  onPress={() => setModalBorrarCurso(!modalBorrarCurso)}>
                        <Image style={{height:20, width:20}}
                            source={imgX}          
                        />
                    </Pressable >

                    <View style={{alignItems:'center',padding:20,paddingTop:1,paddingLeft:30}}>
                        <Text style={{fontSize:24,fontWeight:'bold',paddingLeft:25}}>¿Desea borrar el curso {curso}?</Text>
                    </View>


                    <View style = {{alignItems: "center",  padding:15,marginLeft:25}}>
                        <TouchableOpacity onPress={() => { borrarCurso(curso); navigation.navigate('Inicio')}}>
                            <View style={styles.botonBorrarAlumno}> 
                                <Text style={{fontSize:18}}>Borrar</Text>
                            </View>
                        </TouchableOpacity>                   
                    </View>    
              
                </View>

            </View>
            </Modal>


      {/* Contenedor */}
      <View style = {styles.container}>
        <View style={styles.cursoContainer}>  

          <View style={{alignItems:"center",flexDirection: "row"}}>

              {/* Imagen borrar */}
              <TouchableOpacity onPress={() => setModalBorrarCurso(true)}>
                  <Image style={{height:50, width:50,marginLeft:20}}
                    source={borrar}          
                  />  
              </TouchableOpacity> 

              <Text style={{fontSize:24, fontWeight:'bold', width:150, marginLeft:80, marginRight:50,paddingLeft:10}}>Curso {curso}</Text>

              <TouchableOpacity  onPress={() => setModalAñadirAlumno(true)}>
                <View style={{width:175}}>
                  <Image style={{height:50, width:50}}
                    source={añadir}          
                  />
                </View>
              </TouchableOpacity> 
            </View>  

            <FlatList
              data={flatListItems}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => listItemView(item)}
            />
            

        </View>
      </View>

    </ScrollView>
    
    
  );
};

export default ModificarAlumnos