import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, FlatList, TextInput, TouchableOpacity} from "react-native";
import styles from "./Styles"
import * as SQLite from 'expo-sqlite';


function CursoVerLista ({navigation}) {
  
    const db = SQLite.openDatabase('db');

    let [flatListItems, setFlatListItems] = useState([]);

    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY AUTOINCREMENT,  nombre TEXT);')
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

            <TouchableOpacity  onPress={() => {navigation.navigate('Historico Fechas', {curso: item.nombre,});}}> 
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
             
            <View style={{alignItems:"center"}}>
                <Text style={styles.titulo}>Curso</Text>
            </View>

            <FlatList
              data={flatListItems}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => listItemView(item)}
            />

    
      </View>
    </View>
  );
};

export default CursoVerLista