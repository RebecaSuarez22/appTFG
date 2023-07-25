import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity} from "react-native";
import { Camera } from 'expo-camera';
import { Dimensions } from 'react-native'
import styles from "./Styles"
import stop from "../assets/stop.png"
import * as FaceDetector from 'expo-face-detector';


function NuevoAlumno({navigation, route}) {
    const [hasPermission, setHasPermission] = useState(null);

    const {nombre} = route.params;
    const {curso} = route.params;
    

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var today =  year+'-'+month+'-'+date 

    const [x, setX] = React.useState(null);
    const [y, setY] = React.useState(null);
    const [h, setH] = React.useState(null);
    const [w, setW] = React.useState(null);

    const handleFacesDetected = ({ faces }) => {
      console.log(faces);
      const face = faces[0];

      if (face) {

        setX(face.bounds.origin.x)
        setY(face.bounds.origin.y)
        setH(face.bounds.size.height)
        setW(face.bounds.size.weight)

      }
    };
    
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    
    return (
          <Camera
              onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.Constants.Mode.accurate,
                detectLandmarks: FaceDetector.Constants.Landmarks.all,
                runClassifications: FaceDetector.Constants.Classifications.all,
                minDetectionInterval: 100,
                tracking: true
              }}      
          >          
                    

          <View style={{alignItems:"center", paddingTop:10}}>
            <Text style={{fontSize:26, fontWeight:'bold', paddingBottom: 20, color: 'white'}}>{nombre}</Text>
          </View>

          <View>
            <Text style = {{ borderColor: 'green',borderWidth: 4, width: w, height: h, marginTop: x, marginLeft: y}}></Text>
          </View>
          
              
             <View style={{height: Dimensions.get('window').height-200}}>
               <Text></Text>
             </View>
             <TouchableOpacity onPress={() => {navigation.navigate('Ver Historico', {curso: curso, fecha: today})}}>
               <View style={{alignItems:'center', justifyContent: 'flex-end', flex:1}}>
                 <Image style={{height:70, width:70}}
                   source={stop}          
                />
               </View>
             </TouchableOpacity>
             
         </Camera>
    );
    
  }

 
  
  
export default NuevoAlumno