# App TFG
Prototipo de app para el control de asistencia mediante reconocimiento facial

## Descripción
Esta aplicación es un prototipo para pasar lista mediante reconocimito facial en el ámbito escolar. Permite añadir un nuevo curso, escaneando las caras de los alumnos y alumnas. Tras haber añadido un curso, ya se puede pasar lista, para ello se ha de tomar una foto en donde se vean los rostros de los estudiantes. Automáticamente se manda la imagen al servidor se procesa y se devuelve la imágen con los rostros detectados, añadiendose la asistencia para ese día para cada alumno. La app tambien permite ver el historico de la asistencia del alumnado.

## Requisitos Previos
Antes de utilizar esta aplicación, asegúrate de tener instalado lo siguiente en tu sistema:

1. Node.js: Visita https://nodejs.org y sigue las instrucciones para descargar e instalar la versión más reciente de Node.js.
2. NPM: NPM se instala automáticamente con Node.js. Verifica la instalación ejecutando el siguiente comando en tu terminal:

```
npm --version

```
3. Expo CLI: Si no tienes Expo CLI instalado, puedes instalarlo globalmente ejecutando el siguiente comando en tu terminal:

```
npm install -g expo-cli

```

## Instalación y Uso
Pasos para instalar y ejecutar la aplicación en un dispositivo móvil:

1. Descarga este repositorio
   
3. Accede a la carpeta del proyecto:
```
cd nombre-del-repositorio

```
4. Instala todas las dependencias del proyecto ejecutando el siguiente comando:

```
npm install

```

5. Una vez completada la instalación, inicia el servidor de desarrollo con Expo ejecutando:

```
npm start

```

6. Inicia el servidor ejecutando el archivo que esta en api/api.py

6. Asegúrate de que tu dispositivo móvil y tu computadora estén conectados a la misma red Wi-Fi.

7. Desde tu dispositivo móvil, ve a la tienda de aplicaciones correspondiente y descarga la aplicación "Expo Client" si aún no la tienes instalada. Puedes encontrarla en App Store para dispositivos iOS o en Google Play Store para dispositivos Android.

8. Abre la aplicación "Expo Client" en tu dispositivo móvil y escanea el código QR que aparecerá en la terminal o en la ventana del navegador una vez que se inicie Expo. Esto permitirá que la aplicación se cargue en tu dispositivo.

9. ¡Listo! La aplicación debería cargarse en tu dispositivo móvil y estarás listo para utilizarla.

