import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, Image, Button, Alert, TextInput, TouchableOpacity} from "react-native";
import styles from "./Styles"
import borrar from "../assets/borrar.png"
import * as SQLite from 'expo-sqlite';

function CursoModificarAlumnos ({navigation}) {

    const db = SQLite.openDatabase('db');

    let [flatListItems, setFlatListItems] = useState([]);

    

    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY AUTOINCREMENT,  nombre TEXT);')
    })

    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos2 (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, curso TEXT;')
    })


    //Seleccionamos todos los alumnos
    useEffect(() => {
        db.transaction((tx) => {
         tx.executeSql(
            'SELECT * FROM cursos',
            [],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                  setFlatListItems(temp);
            }
          );
        });
    }, []);

    //Para cada curso = item
    let listItemView = (item) => {
        return (
            <View style={styles.cursoButtonContainer}>

            <TouchableOpacity  onPress={() => {navigation.navigate('Modificar Alumnos', {curso: item.nombre,});}}> 
                <View style={styles.cursoButton}>                    
                    <Text style={styles.contenedorBotonText}>{item.nombre}</Text>                    
                </View>
            </TouchableOpacity>
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
        <View style = {styles.container}>
            <View style={styles.cursoContainer}>

             
            <View style={{alignItems:"center",flexDirection: "row"}}>
                <View style={{width:175, paddingLeft:25}}>
                    <Image style={{height:50, width:50}}
                        source={borrar}          
                    />  
                </View>  
                <Text style={styles.titulo}>Curso</Text>
            </View>

            <FlatList
              data={flatListItems}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => listItemView(item)}
            />

        {/*
           <View style={styles.cursoButtonContainer}>

                <TouchableOpacity  onPress={() => navigation.navigate('Modificar Alumnos')}>
                    <View style={styles.cursoButton}>                    
                        <Text style={styles.contenedorBotonText}>1A</Text>                    
                    </View>
                </TouchableOpacity>

                <TouchableOpacity  onPress={() => navigation.navigate('Modificar Alumnos')}>
                    <View style={styles.cursoButton}>                    
                        <Text style={styles.contenedorBotonText}>1C</Text>                    
                    </View>
                </TouchableOpacity>
          </View>


          <View style={styles.cursoButtonContainer}>

          <TouchableOpacity  onPress={() => navigation.navigate('Modificar Alumnos')}>
                    <View style={styles.cursoButton}>                    
                        <Text style={styles.contenedorBotonText}>3C</Text>                    
                    </View>
                </TouchableOpacity>

                <TouchableOpacity  onPress={() => navigation.navigate('Modificar Alumnos')}>
                    <View style={styles.cursoButton}>                    
                        <Text style={styles.contenedorBotonText}>4A</Text>                    
                    </View>
                </TouchableOpacity>

          </View>

          */}
      </View>
    </View>
  );
};

export default CursoModificarAlumnos