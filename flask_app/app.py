from flask import Flask, request, jsonify
import pandas as pd
from mrs import generate_recommendations
import flask_cors

app = Flask(__name__)
flask_cors.CORS(app)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    return response

@app.route('/recommend', methods=['GET'])
def get_recommendations():
    song_name = request.args.get('song_name')
    curr_user_id = request.args.get('curr_user_id')
    if song_name == None:
        recc_data = generate_recommendations(curr_user_id, song_name=None)
        return recc_data.to_json(orient='records')
    elif len(song_name) > 0:
        recc_data = generate_recommendations(curr_user_id, song_name)
        return recc_data.to_json(orient='records')
    else:
        if(curr_user_id == ''):
            return jsonify({'error': 'curr_user_id parameter is missing'})
        return jsonify({'error': 'song_name parameter is missing'})

if __name__ == '__main__':
    app.run(debug=True)
