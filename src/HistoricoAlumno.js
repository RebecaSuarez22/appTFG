import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Image, Button, Alert, TextInput, TouchableOpacity, ScrollView, Icon, Modal, Pressable} from "react-native";
import styles from "./Styles"
import borrar from "../assets/borrar.png"
import * as SQLite from 'expo-sqlite';
import imgX from "../assets/x.png"
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import si from "../assets/si.png"
import no from "../assets/no.png"
import justificada from "../assets/justificada.png"

LocaleConfig.locales['es'] = {
    monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
    dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'es';


const db = SQLite.openDatabase('db');
db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS historicoAlumno (idAlumno INTEGER, fecha TEXT, asistencia TEXT);')
})    

function newItem (idAlumno,fecha,asistencia){  

    db.transaction(tx => {
      tx.executeSql('REPLACE INTO historicoAlumno (idAlumno, fecha, asistencia) values (?,?,?)', [idAlumno, fecha, asistencia])
    })    

    db.transaction(tx => {
        tx.executeSql('UPDATE historicoAlumno SET idAlumno = ?, fecha = ?, asistencia = ? WHERE idAlumno = ? AND fecha = ?', [idAlumno, fecha, asistencia,idAlumno, fecha,])
      })    
}




function EditarAlumno ({navigation, route}) {    

    let [userNombre, setUserNombre] = useState('');
    let [userCurso, setUserCurso] = useState(''); 
    let [userImg, setUserImg] = useState(''); 
    let [historicoA, setHistoricoA] = useState([]);

    const listaNo = []
    var listaSi = []
    var listaJustificada = []

    let noA = {};
    let siA = {};
    let justificadaA = {};
    let fechasA = {};

    const [pressDay, setPressDay] = React.useState(null);

    const {id} = route.params;

    const [modalEditarAsistencia, setModalEditarAsistencia] = useState(false); 
    
    
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
                        res.clase,
                        res.imagen
                    );
                }else{
                updateAllStates('', '', '');
                }
            }
        );
    });

    useEffect(() => {
        db.transaction((tx) => {
         tx.executeSql(
            'SELECT * FROM historicoAlumno WHERE idAlumno = ?', [id],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                  setHistoricoA(temp);
            }
          );
        });
      }, []);

    // console.log(historicoA);
    // console.log(" ");

    historicoA.forEach(element => {

        switch(element.asistencia){
            case "si":
                listaSi.push(element.fecha)
                break;
            
            case "no":
                listaNo.push(element.fecha)
                break;
            
            case "justificada":
                listaJustificada.push(element.fecha)
                break;
                
        }   

        
    });

    listaNo.forEach((day) => {        
          noA[day] = {
              selected: true,
              selectedColor: 'tomato'
          };
    });

    listaSi.forEach((day) => {        
        siA[day] = {
            selected: true,
            selectedColor: 'limegreen'
        };
     });

    listaJustificada.forEach((day) => {        
        justificadaA[day] = {
            selected: true,
            selectedColor: 'gold'
        };
    });


    fechasA = Object.assign(noA, siA);
    fechasA = Object.assign(fechasA, justificadaA);   


    


    return( 
        <ScrollView> 

            {/*Modal para editar asistencia*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditarAsistencia}
                onRequestClose={() => {
                    setModalEditarAsistencia(!modalEditarAsistencia);
                }}
            >

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable  onPress={() => setModalEditarAsistencia(!modalEditarAsistencia)}>
                        <Image style={{height:20, width:20}}
                            source={imgX}          
                        />
                    </Pressable >

                    <View style={{alignItems:'center',padding:20,paddingTop:1,paddingLeft:30}}>
                        <Text style={{fontSize:24,fontWeight:'bold',paddingLeft:25}}>Editar Asistencia</Text>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginLeft:25}}>
                        <Pressable  onPress={() => {setModalEditarAsistencia(!modalEditarAsistencia); newItem (id,pressDay,"si")}}>
                            <View style={{ padding:15}}>
                                <Image style={{height:65, width:65}}
                                    source={si}          
                                />
                            </View>
                        </Pressable >

                        <Pressable  onPress={() => {setModalEditarAsistencia(!modalEditarAsistencia); newItem (id,pressDay,"no")}}>
                        <View style={{ padding:15}}>
                                <Image style={{height:65, width:65}}
                                    source={no}          
                                />
                            </View>
                        </Pressable >

                        <Pressable  onPress={() => {setModalEditarAsistencia(!modalEditarAsistencia); newItem (id,pressDay,"justificada")}}>
                            <View style={{ padding:15}}>
                                <Image style={{height:65, width:65}}
                                    source={justificada}          
                                />
                            </View>
                        </Pressable >
                    </View>
                   
                      
              
                </View>

            </View>
            </Modal>

            

        <View style = {styles.container}>
            <View style={styles.cursoContainer}>
                
            <View style={{alignItems:"center"}}>
                <Text style={styles.titulo}>{userNombre}</Text>
            </View>

            {/* Imagen alumno */}
            <View style={{alignItems:"center", marginTop:10,marginBottom:20}}>
                <Image style={{height:150, width:150, borderRadius: 70}}
                    source={userImg}          
                /> 
            </View>

            

            <Calendar
                onDayPress={(day) => { setModalEditarAsistencia(true); setPressDay(day.dateString) }}   
                markedDates={fechasA}
            />

    
            </View>
        </View>
        </ScrollView>
      );
    };
    

export default EditarAlumno