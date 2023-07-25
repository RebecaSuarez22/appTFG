import cv2
import os
import glob
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import json
import dlib



def training(curso):    
    getFaces(curso)
    # Rutas de las carpetas con las caras entrenadas
    directorio_base = os.path.join('videos', curso, 'training')

    # Parámetros del modelo
    altura, anchura = 100, 100
    numero_clases = len(os.listdir(directorio_base))
    lote_entrenamiento = 32
    epocas_entrenamiento = 10

    # Preprocesamiento de imágenes
    preprocesamiento = ImageDataGenerator(rescale=1./255, validation_split=0.2)

    # Cargar las imágenes de entrenamiento y validación
    generador_entrenamiento = preprocesamiento.flow_from_directory(
        directorio_base,
        target_size=(altura, anchura),
        batch_size=lote_entrenamiento,
        subset='training'
    )

    generador_validacion = preprocesamiento.flow_from_directory(
        directorio_base,
        target_size=(altura, anchura),
        batch_size=lote_entrenamiento,
        subset='validation'
    )

    mapeo_etiquetas_nombres = {}
    etiquetas = generador_entrenamiento.class_indices
    for etiqueta, indice in etiquetas.items():
        mapeo_etiquetas_nombres[indice] = etiqueta
    archivo_json = os.path.join('videos', curso, 'mapeo_nombres.json')
    with open(archivo_json, 'w') as f:
        json.dump(mapeo_etiquetas_nombres, f)

    # Cargar el modelo base pre-entrenado (VGG16)
    base_model = VGG16(include_top=False, weights='imagenet', input_shape=(altura, anchura, 3))

    # Agregar capas adicionales al modelo
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    predicciones = Dense(numero_clases, activation='softmax')(x)

    # Combinar el modelo base y las capas adicionales
    modelo = Model(inputs=base_model.input, outputs=predicciones)

    # Congelar las capas del modelo base para que no se entrenen durante el ajuste fino
    for capa in base_model.layers:
        capa.trainable = False

    # Compilaramos y entrenamos el modelo
    modelo.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    modelo.fit(generador_entrenamiento, validation_data=generador_validacion, epochs=epocas_entrenamiento)

    # Guardar el modelo entrenado
    model_name = "model.h5"
    directorio_base = os.path.join('videos', curso, model_name)
    modelo.save(directorio_base)
    



def getFaces(curso):
    path_videos_clase = os.path.join('videos', curso, 'escaneo')
    videos_clase = os.listdir(path_videos_clase)

    for nombre in videos_clase:
        print(nombre)
        directorio = os.path.join('videos', curso, 'escaneo', nombre)
        archivos_video = glob.glob(os.path.join(directorio, '*.mov'))
        ruta_video = archivos_video[0]
        directorio_salida = os.path.join('videos', curso, 'training', nombre)

        if not os.path.exists(directorio_salida):
            os.makedirs(directorio_salida)

        cap = cv2.VideoCapture(ruta_video)

        # Inicializar el detector de caras de dlib
        detector = dlib.get_frontal_face_detector()

        # Variables para contar los cuadros procesados y las imágenes faciales guardadas
        cuadros_procesados = 0
        imagenes_guardadas = 0

        # Procesar cada cuadro del video
        while cap.isOpened():
            # Leer el siguiente cuadro
            ret, cuadro = cap.read()
            if not ret:
                break

            # Convertir el cuadro a escala de grises
            gray = cv2.cvtColor(cuadro, cv2.COLOR_BGR2GRAY)

            # Detectar caras en el cuadro
            caras = detector(gray)

            # Extraer y guardar las imágenes faciales
            for cara in caras:
                # Extraer las coordenadas de la cara
                x, y, w, h = cara.left(), cara.top(), cara.width(), cara.height()

                # Extraer la región de la cara y guardarla redimensionada
                cara_extraida = cuadro[y:y + h, x:x + w]
                cara_redimensionada = cv2.resize(cara_extraida, (100, 100))
                nombre_archivo = os.path.join(directorio_salida, f'cara_{imagenes_guardadas}.jpg')
                cv2.imwrite(nombre_archivo, cara_redimensionada)

                # Incrementar el contador de imágenes guardadas
                imagenes_guardadas += 1

            # Incrementar el contador de cuadros procesados
            cuadros_procesados += 1

        cap.release()
        cv2.destroyAllWindows()

        print(f'Se procesaron {cuadros_procesados} cuadros y se guardaron {imagenes_guardadas} imágenes faciales.')



def pasarLista(curso, img):

    # Cargar el modelo entrenado
    modelo_path = os.path.join('videos', curso, 'model.h5')
    modelo = tf.keras.models.load_model(modelo_path)

    print(modelo)


    json_path = os.path.join('videos', curso, 'mapeo_nombres.json')
    # Cargar el archivo JSON con el mapeo de nombres
    with open(json_path, 'r') as f:
        mapeo_etiquetas_nombres = json.load(f)

    # Crear una lista de nombres con valores iniciales de 0
    nombres_encontrados = {nombre: 0 for nombre in mapeo_etiquetas_nombres.values()}

    # Cargar la imagen de la foto
    imagen = cv2.imread(img)

    # Convertir la imagen a escala de grises
    imagen_gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)

    # Detectar caras en la imagen
    algoritmo_deteccion = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    caras = algoritmo_deteccion.detectMultiScale(imagen_gris, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Recorrer las caras detectadas
    for (x, y, w, h) in caras:
        # Preprocesamiento de la imagen facial
        cara = imagen[y:y+h, x:x+w]
        cara_redimensionada = cv2.resize(cara, (100, 100))
        cara_escalada = cara_redimensionada / 255.0  # Normalizar los valores de píxeles entre 0 y 1

        # Realizar la predicción
        resultado = modelo.predict(tf.expand_dims(cara_escalada, axis=0))
        etiqueta_prediccion = np.argmax(resultado)

        nombre_prediccion = mapeo_etiquetas_nombres.get(str(etiqueta_prediccion), "Desconocido")
        # Actualizar el valor en la lista de nombres encontrados
        nombres_encontrados[nombre_prediccion] = 1

        # Dibujar el rectángulo y mostrar el nombre
        cv2.rectangle(imagen, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(imagen, nombre_prediccion, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    print("guardar imagen")
    

    cv2.imwrite(img, imagen)

    print(nombres_encontrados)

    return nombres_encontrados



if __name__ == '__main__':
    curso = '4B'
    training(curso)
    pasarLista(curso)