from flask import Flask, jsonify, request, send_file, render_template, Response, stream_with_context
import pandas as pd
import pyulog
from pyulog.ulog2csv import *
import json
from flask_compress import Compress
import io

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
        if (d != len(data) - 1):
            jsons = jsons + "\"" + data[d].name + "\":" + js + "," 
        else:
            jsons = jsons + "\"" + data[d].name + "\":" + js 
    jsons = jsons + "}"

    mem = io.BytesIO()
    jsons = json.dumps(jsons)
    mem.write(jsons.encode('utf-8'))
    mem.seek(0)
    
    return send_file(
        mem,
        as_attachment=True,
        attachment_filename='data.json',
        mimetype='application/json'
    )
   
    
#method in testing    
@app.route('/chunks', methods=['POST'])
def chunks():
  print(request.files)
  ulog = ULog(request.files['file'])
  data = ulog.data_list
  
  def parseData():
    for d in range(len(data)):
        #data[d].name
        jsons = ""
        df = pd.DataFrame(data[d].data)
        js = df.to_json(orient="records")
        jsons = jsons + "\"" + data[d].name + "\":" + js + ',' 
        jsons = jsons.encode()
        print(type(jsons))
        yield jsons
        
  return Response(stream_with_context(parseData()))


@app.route('/')
def webpage():
    return render_template('index.html')