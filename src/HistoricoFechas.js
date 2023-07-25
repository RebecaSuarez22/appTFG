import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button, Alert, TextInput, TouchableOpacity, ScrollView} from "react-native";
import styles from "./Styles"
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                'Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
  dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'es';


function HistoricoFechas  ({navigation, route}) {
  const {curso} = route.params;
        
  return( 
    <ScrollView style={styles.scrollView}>
    <View style = {styles.container}>
        <View style={styles.cursoContainer}>     


            <View style={{padding:10,alignItems:'center'}}>
                <Text style={{fontSize:26,fontWeight:'bold'}}>Curso {curso} </Text>
            </View>       

            <View style = {{height: 40}}></View>

            <Calendar
                onDayPress={(day) => {navigation.navigate('Ver Historico', {curso: curso, fecha: day.dateString});}}
                
            />
         
      </View>
    </View>
    </ScrollView>
  );
};



export default HistoricoFechas