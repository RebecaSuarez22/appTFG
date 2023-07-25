import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity} from "react-native";
import { Dimensions } from 'react-native'

const styles = StyleSheet.create({


  //Home
    container: { 
      flex: 1, 
      backgroundColor: '#E8EAED'
    },

    wrapper: {
      paddingTop: 70,
      alignItems: 'center'
    },

    titulo:{
      fontSize:24,
      fontWeight:'bold',
      paddingBottom: 20
    },
  
    imageIcono: {
      height:200, 
      width:200,
      marginTop: 40,
    },

    menu: {
      padding: 50,  
      fontWeight: 'bold'
    },

    contenedorBoton: {
      marginTop: 15,
      backgroundColor: "#FFFFFF",
      padding: 12,
      borderRadius: 25,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      alignItems: "center",
    },
    

    contenedorBotonText: {
      color: "black",
      fontSize:24,
      fontWeight: 'bold'
    },


  //Pasar Lista

    buttonCamera: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },

  
  //Curso    

    cursoContainer: {
      paddingTop: 20
    },

    cursoButtonContainer:{
      padding: 20,
      paddingTop: 10, 
      flexDirection: "row",
      justifyContent: 'space-between'
    },    

    cursoButton: {
      backgroundColor: "#C4C4C4",         
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,  
      height: 88, 
      width:180, 
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 25, 
    },

  
  //Ver Historial

  tituloFecha:{
    fontSize:22,
    fontWeight:'bold',
  },

  textoAlumnos:{
    fontSize:22, 
    fontWeight:'bold',
    marginLeft:20, 
    width:240,
    marginRight:10
  },
    
  listaContainer:{
    paddingTop: 15,
  },

  listaAlumno: {
    height: 70,
    width: Dimensions.get('window').width,
    backgroundColor: "#C4C4C4",
    flexDirection: 'row',
    alignItems: "center",
    paddingLeft: 25    
  },

  //Modificar alumnos

    listaFechas: {
      height: 70,
      width: Dimensions.get('window').width,
      backgroundColor: "#C4C4C4",
      flexDirection: 'row',
      alignItems: "center",
      paddingLeft: 25,
      flexDirection: "row"
    },

    editarInput:{
      flexDirection: "row", 
      marginTop:20,
      marginLeft:20,
      alignItems: "center",
    },

    tituloEditar:{
      fontSize:22,
      fontWeight:'bold',
      width:100,
      
    },

    input: {
      height: 30,
      marginLeft: 20,
      fontSize:23,
      backgroundColor:'white',
      padding:20,
      
      height: 30,
      marginLeft: 5,
      fontSize:20,
      padding:15,
      borderWidth: 1,
    }, 

    editarBotones:{
      flexDirection: "row", 
      marginTop:20,
      alignItems: "center",
      justifyContent: "center",
    },

    contenedorBotonGuardar: {
      marginTop: 25,
      backgroundColor: "#73D0F4",
      borderRadius: 35,   
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,  
      alignItems: "center", 
      padding:15,
      paddingRight:40,
      paddingLeft:40
    },

    textoModificar:{
      fontSize:22, 
      fontWeight:'bold',
      marginLeft:20, 
      width:230
    },

    botonRepetirEscaneo:{
      backgroundColor: "#F4D873",
      borderRadius: 35,   
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,  
      alignItems: "center", 
      padding:10,
      paddingRight:40,
      paddingLeft:40

    },

    botonBorrarAlumno:{
      backgroundColor: "#FA8072",
      borderRadius: 35,   
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,  
      alignItems: "center", 
      padding:10,
      paddingRight:40,
      paddingLeft:40

    },

    botonAsistenciaAlumno:{
      backgroundColor: "#73D0F4",
      borderRadius: 35,   
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,  
      alignItems: "center", 
      padding:10,
      paddingRight:40,
      paddingLeft:40

    },

    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },

    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      paddingTop:10,
      paddingLeft:10,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },

    inputAñadir: {
      height: 30,
      marginLeft: 5,
      fontSize:20,
      padding:5,
      borderWidth: 1,
      width:150
    }, 

    contenedorBotonAñadir: {
      backgroundColor: "#73D0F4",
      borderRadius: 35,   
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.6,  
      alignItems: "center", 
      padding:10,
      paddingRight:40,
      paddingLeft:40
    },

    añadirNombres: {
      height: 70,
      width: Dimensions.get('window').width,
      flexDirection: 'row',
      alignItems: "center",
      paddingLeft: 25    
    },

    inputAñadirNombres:{
      height: 40,
      marginLeft: 30,
      fontSize:20,
      padding:10,
      borderWidth: 1,
      width:260,
      backgroundColor: 'white'

    },

    messageContainer2: {
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'transparent',
    },
    messageText2: {
      color: 'black',
      fontSize: 18,
    },

    botonAsistencia: {
      backgroundColor: '#007AFF',
      borderRadius: 5,
      padding: 10,
      margin: 20,
      alignItems: 'center',
    },
    botonTexto: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    

  })

export default styles