from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
from training import * 

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'videos'

@app.route('/add', methods=['POST'])
def upload_file():
    print("START")
    if 'video' not in request.files:
        print("No video part in the request")
        return 'No video part in the request', 400

    curso = request.form.get('curso', '') 
    nombre = request.form.get('nombre', '') 
    file = request.files['video']

    if file.filename == '':
        return 'No selected file', 400

    filename = secure_filename(file.filename)
    print(filename)
    course_folder = os.path.join(app.config['UPLOAD_FOLDER'], curso,'escaneo', nombre)
    
    if not os.path.exists(course_folder):
        os.makedirs(course_folder)

    file.save(os.path.join(course_folder, filename))   


    return 'Video successfully saved', 200

@app.route('/pasarLista', methods=['POST'])
def pasarLista_api():
    print("START")
    if 'image' not in request.files:
        print("No image part in the request")
        return 'No image part in the request', 400

    curso = request.form.get('curso', '')
    file = request.files['image']

    if file.filename == '':
        return 'No selected file', 400

    filename = 'pasarLista.jpeg'
    course_folder = os.path.join(app.config['UPLOAD_FOLDER'], curso)
    
    if not os.path.exists(course_folder):
        os.makedirs(course_folder)

    path = os.path.join(course_folder, filename)
    file.save(path)
    print(path)
    print('Image successfully saved')
    asistencia = pasarLista(curso, path)
    return asistencia, 200

@app.route('/get_photo', methods=['GET'])
def get_photo():

    curso = request.args.get('curso', '')

    path = "../videos/" + str(curso) + "/pasarLista.jpeg"
    
    
    
    return send_file(path, mimetype='image/jpeg')


@app.route('/training', methods=['POST'])
def training_curso():
    print("Empezando entrenamiento...")
    curso = request.form.get('curso', '') 
    training(curso) 
    return 'Trainig successfully', 200


@app.route('/get_names', methods=['POST'])
def get_named():
    data = request.json
    curso = data.get('curso', '') 
    print("CURSO")
    print(curso)
    path_videos_clase = os.path.join('videos', curso, 'escaneo')

    videos_clase = os.listdir(path_videos_clase)
    print(videos_clase)

    return jsonify(videos_clase)


if __name__ == '__main__':
    if not os.path.exists('videos'):
        os.makedirs('videos')
    app.run(host='0.0.0.0', port=5000)
