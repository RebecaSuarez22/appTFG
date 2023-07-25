import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity, Modal, modalVisible, Pressable} from "react-native";
import logo from './assets/icono.png'
import styles from "./src/Styles";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import modificarAlumnos from './src/ModificarAlumnos';
import cursoVerHistorico from './src/CursoVerHistorico';
import cursoPasarLista from './src/CursoPasarLista';
import verHistorico from './src/VerHistorico';
import historicoFechas from './src/HistoricoFechas';
import cursoModificarDatos from "./src/CursoModificarDatos";
import editarAlumno from "./src/EditarAlumno";
import prueba_py from "./api/EscanearCurso";
import añadirAlumnos from "./src/AñadirAlumnos";
import historicoAlumno from "./src/HistoricoAlumno";
import nuevoAlumno from "./src/NuevoAlumno";
import imgX from './assets/x.png'
import pasarLista_py from "./api/PasarLista";
import escanearAlumno from "./api/escanearAlumno";
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db');

const HomeScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [curso, setCurso] = React.useState(null);

    
  return( 
        <><Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      } }    
      >      

      
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Image style={{ height: 20, width: 20 }}
              source={imgX} />
          </Pressable>

          <View style={{ alignItems: 'center', padding: 20, paddingTop: 1, paddingLeft: 30 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 25 }}>Añadir Curso</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Curso: </Text>

            <TextInput 
              style={styles.inputAñadir}
              onChangeText={(text) => setCurso(text)}
              onSubmitEditing={() => {alert(curso)}}
            />
          </View>

          <View style={{ alignItems: "center", padding: 20, marginLeft: 25, paddingTop: 40 }}>
            
            <TouchableOpacity onPress={() => { navigation.navigate('Escanear Curso', {curso: curso,});
                                               setModalVisible(!modalVisible);} 
              }>
              <View style={styles.botonRepetirEscaneo}>
                <Text style={{ fontSize: 18 }}>Escanear Curso</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    </Modal>
    
    <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.titulo}>App Reconocimiento Facial</Text>
          <Image style={styles.imageIcono}
            source={logo} />
        </View>

        <View style={styles.menu}>

          <TouchableOpacity onPress={() => navigation.navigate('Curso Pasar Lista')}>
          <View style={[styles.contenedorBoton, { backgroundColor: '#BFE7C3' }]}>
              <Text style={styles.contenedorBotonText}>Pasar Lista</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Curso Ver Historico')}>
          <View style={[styles.contenedorBoton, { backgroundColor: '#B7DCEB' }]}>
              <Text style={styles.contenedorBotonText}>Histórico</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={[styles.contenedorBoton, { backgroundColor: '#E2D1E0' }]}>
              <Text style={styles.contenedorBotonText}>Añadir Curso</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => navigation.navigate('Curso Modificar Datos')}>
          <View style={[styles.contenedorBoton, { backgroundColor: '#E7C9BF' }]}>
              <Text style={styles.contenedorBotonText}>Modificar Datos</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View></>
    
  );
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen 
          name="Inicio" 
          component={HomeScreen} 
          options={{ headerShown: false}}    
        />

        <Stack.Screen
          name="Curso Pasar Lista"
          component={cursoPasarLista}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
         name="Pasar Lista"
         component={pasarLista_py}
         options={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize:18,
            fontWeight: 'bold'
          },
          }}     
        />

        <Stack.Screen
          name="Curso Ver Historico"
          component={cursoVerHistorico}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Historico Fechas"
          component={historicoFechas}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
          
        />

        <Stack.Screen
          name="Ver Historico"
          component={verHistorico}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

    <Stack.Screen
          name="Historico Alumno"
          component={historicoAlumno}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Escanear Curso"
          component={prueba_py}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Escanear Alumno"
          component={escanearAlumno}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Añadir Alumnos"
          component={añadirAlumnos}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />


        <Stack.Screen
          name="Curso Modificar Datos"
          component={cursoModificarDatos}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Modificar Alumnos"
          component={modificarAlumnos}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Editar Alumno"
          component={editarAlumno}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />

        <Stack.Screen
          name="Nuevo Alumno"
          component={nuevoAlumno}
          options={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            },
          }} 
        />
        
       

      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App