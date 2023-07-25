import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity} from "react-native";
import logo from './assets/icono.png'
import styles from "./src/Styles";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import modificarAlumnos from './src/ModificarAlumnos';
import pasarLista from './src/PasarLista';
import cursoVerLista from './src/CursoVerLista';
import cursoPasarLista from './src/CursoPasarLista';
import verLista from './src/VerLista';
import cursoModificarAlumnos from "./src/CursoModificarAlumnos";
import editarAlumno from "./src/EditarAlumno";
import añadirAlumno from "./src/AñadirAlumno";
import { UserInterfaceIdiom } from "expo-constants";


const HomeScreen = ({navigation}) => {
  return( 
    <View style = {styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>App Reconocimiento Facial</Text>
          <Image style={styles.imageIcono}
            source={logo}          
          />
      </View>   

      <View style={styles.menu}>

        <TouchableOpacity  onPress={() => navigation.navigate('Curso Pasar Lista')}>
            <View style={styles.contenedorBoton}> 
              <Text style={styles.contenedorBotonText}>Pasar Lista</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => navigation.navigate('Curso Ver Lista')}>
            <View style={styles.contenedorBoton}> 
              <Text style={styles.contenedorBotonText}>Ver Lista</Text>
            </View>
        </TouchableOpacity>

        
        <TouchableOpacity  onPress={() => navigation.navigate('Curso Modificar Alumnos')}>
            <View style={styles.contenedorBoton}> 
              <Text style={styles.contenedorBotonText}>Modificar Alumnos</Text>
            </View>
        </TouchableOpacity>

       </View> 
    </View>
  );
};

export default HomeScreenj