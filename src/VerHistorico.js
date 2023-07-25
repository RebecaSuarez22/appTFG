import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image, Button, Alert, TextInput, TouchableOpacity, ScrollView} from "react-native";
import styles from "./Styles"
import chica1 from "../assets/caraChica1.png"
import chica2 from "../assets/caraChica2.png"
import chico1 from "../assets/caraChico1.png"
import chico2 from "../assets/caraChico2.png"
import si from "../assets/si.png"
import no from "../assets/no.png"
import justificada from "../assets/justificada.png"
import * as SQLite from 'expo-sqlite';
import { render } from "react-dom";
import a1 from "../assets/alumnos/a1.png"

var date = 0;

function VerHistorico ({route, navigation}) {
    const {curso} = route.params;
    const {fecha} = route.params;
    date = fecha;
    let [flatListItems, setFlatListItems] = useState([]);
    let [historico, setHistorico] = useState([]);

    const db = SQLite.openDatabase('db');

    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM historicoAlumno WHERE rowid NOT IN (SELECT MIN(rowid) FROM historicoAlumno GROUP BY idAlumno, fecha)',
        [],
        () => {
          console.log('Se eliminaron los registros duplicados de la tabla historicoAlumno');
        },
        error => {
          console.error('Error al eliminar los registros duplicados de la tabla historicoAlumno:', error);
        }
      );
    });
    

    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM historicoAlumno',
          [],
          (tx, result) => {
            // Manipula los datos obtenidos
            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              console.log(item)
              // Aquí puedes hacer lo que necesites con los datos, como mostrarlos en la interfaz de usuario
            }
          },
          error => {
            console.error(error);
          }
        );
      });

    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS historicoAlumno (id INTEGER PRIMARY KEY AUTOINCREMENT,  idAlumno INTEGER, fecha TEXT, asistencia TEXT);')
    })    

    //Seleccionamos todos los alumnos
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

      useEffect(() => {
        db.transaction((tx) => {
         tx.executeSql(
            'SELECT * FROM historicoAlumno where fecha = ?', [date],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                  setHistorico(temp);
            }
          );
        });
      }, []);
      


let [asistencia, setAsistencia] = useState([]);




//Para cada alumno = item
let listItemView = (item) => { 
  const newItem = {
    ...item,
    asistencia: ""
  };
    historico.forEach(element => {
        if (element.idAlumno == item.id){

            switch(element.asistencia){
                
                case "si":
                    newItem.asistencia = (require("../assets/si.png"))
                    break;
                
                case "no":
                    newItem.asistencia =(require("../assets/no.png"))
                    break;
                
                case "justificada":
                    newItem.asistencia =(require("../assets/justificada.png"))
                    break;
                
                default:
                    newItem.asistencia = (require("../assets/si.png"))
                    break;
            }  

        }
    });

    console.log("newitem",newItem)
    
    return (
        <TouchableOpacity  onPress={() => { navigation.navigate('Historico Alumno', {id: item.id})}}>
            <ScrollView style={styles.scrollView}>
                <View style = {styles.container}>
                    <View style={styles.cursoContainer}>                     
                    
                        <View style={styles.listaAlumno}>                            
                            <Image style={{height:50, width:50,}}
                                source={chica1}          
                            />
                            <Text style={styles.textoAlumnos}>{item.nombre}</Text>   
                            <Image style={{height:50, width:50}}
                                source={newItem.asistencia}          
                            />               
                        </View>  

                
                    </View>
                </View>
            </ScrollView>
    </TouchableOpacity>
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
    <View style = {styles.container}>
      <View style={styles.cursoContainer}>  
            <View style={{padding:20, alignItems:'center'}}>
                <Text style={{fontSize:24, fontWeight:'bold'}}>{'Fecha: ' + fecha}</Text>
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



export default VerHistorico;