import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity, ScrollView} from "react-native";
import styles from "./Styles"

import * as SQLite from 'expo-sqlite';



function AñadirAlumnos ({route, navigation}) {

    const {curso} = route.params;

    const items = [ {name: "", img: require("../assets/alumnos/a1.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a2.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a3.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a4.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a5.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a6.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a7.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a8.png"), faceID: ""}, 
                    {name: "", img: require("../assets/alumnos/a9.png"), faceID: ""}];

    const db = SQLite.openDatabase('db');
    var x = ""

    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS alumnosconimagen (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, clase TEXT, imagen TEXT);')
    })

    function newItem (items,curso){  

        items.forEach(element => {
            if(element.name != ""){
                db.transaction(tx => {
                    tx.executeSql('INSERT INTO alumnosconimagen (nombre, clase, imagen) values (?,?,?)', [element.name, curso, element.img])})  

            }
        }); 
                 
        
    }
    

    return( 
        <><ScrollView style={styles.scrollView}>
          <View style={styles.container}>
              <View style={styles.cursoContainer}>

                  <View style={{ padding: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Añadir Alumnos</Text>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a1.png")} />
                          <TextInput 
                          style={styles.inputAñadirNombres}    
                            onChangeText={(text) => items[0].name = text}                    
                          />  
                          
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a2.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                        onChangeText={(text) => items[1].name = text}   
                          />  
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                             source={require("../assets/alumnos/a3.png")} />
                          <TextInput 
                            style={styles.inputAñadirNombres} 
                            onChangeText={(text) => items[2].name = text}   
                          />  
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a4.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                           onChangeText={(text) => items[3].name = text}  
                          /> 
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a5.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                           onChangeText={(text) => items[4].name = text}  
                          /> 
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a6.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                           onChangeText={(text) => items[5].name = text}  
                          />  
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a7.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                           onChangeText={(text) => items[6].name = text}  
                          /> 
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a8.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                           onChangeText={(text) => items[7].name = text}   
                          />  
                      </View>
                  </View>

                  <View style={styles.listaContainer}>
                      <View style={styles.añadirNombres}>
                          <Image style={{ height: 50, width: 50, }}
                              source={require("../assets/alumnos/a9.png")} />
                          <TextInput 
                           style={styles.inputAñadirNombres} 
                           onChangeText={(text) => items[8].name = text}  
                          />  
                      </View>
                  </View>
              </View>
          </View>

      </ScrollView>
      
      <View style={{ height: 90, backgroundColor: '#E8EAED' }}>
            <View style = {styles.editarBotones}>
            
                <TouchableOpacity onPress={() => {newItem(items,curso); navigation.navigate('Inicio');}}> 
                
                    <View style={styles.contenedorBotonAñadir}> 
                        
                        <Text style={{fontSize:20,fontWeight: 'bold'}}>Añadir</Text>
                    </View>
                </TouchableOpacity>
                   
            </View>
      </View></>
  );
};


export default AñadirAlumnos