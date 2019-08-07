from flask import Flask, jsonify, request, send_file, render_template
import pandas as pd
import pyulog
from pyulog.ulog2csv import *
import json
from flask_compress import Compress

app = Flask(__name__)
Compress(app)



@app.route('/parse', methods=['POST'])
def parse():
    print('hi')
    print(request.files)
    ulog = ULog(request.files['file'])
    data = ulog.data_list

    jsons = "{"
    data = data
    names = []
    for d in range(len(data)):
        print(data[d].name)
        names.append(data[d].name)
        df = pd.DataFrame(data[d].data)
        
        js = df.to_json(orient="records")
        if (d != len(data)-1):
            jsons = jsons + "\"" + data[d].name + "\":" + js + "," 
        else:
            jsons = jsons + "\"" + data[d].name + "\":" + js 
    jsons = jsons + "}"
    response = app.response_class(
        response=json.dumps(jsons),
        status=200,
        mimetype='application/json'
    )
    return response
    #return render_template('index.html', result = result)
    #return result

@app.route('/')
def webpage():
    return render_template('index.html')
