import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity} from "react-native";
import { Camera } from 'expo-camera';
import { Dimensions } from 'react-native'
import styles from "./Styles"
import stop from "../assets/stop.png"
import alumnos from "../assets/alumnosImg.png"


function EscanearCurso({route, navigation}) {

    const {curso} = route.params;

       
    return (
      <View style={{backgroundColor: "black"}}>
            <View style={{alignItems:"center", paddingTop:10,backgroundColor: "black"}}>
                <Text style={{fontSize:26, fontWeight:'bold', paddingBottom: 20, color: 'white'}}>{curso}</Text>
            </View>

            <Image style={{height:Dimensions.get('window').height-320, width:Dimensions.get('window').width+830}}
                  source={alumnos}          
               />
            
            <View style={{height: 100}}></View>
            
                <TouchableOpacity onPress={() => navigation.navigate('Añadir Alumnos',  {
                                                curso: curso,
                                            })}>
                        <View style={{alignItems:'center', justifyContent: 'flex-end', flex:1}}>
                            <Image style={{height:70, width:70}}
                                source={stop}          
                            />
                        </View>
                </TouchableOpacity>

                

               <View style={{height: 100}}></View>
            
      </View>
    );
  }
  
  
export default EscanearCurso