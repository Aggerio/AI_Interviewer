from flask import Flask, request
from flask_cors import CORS
import json
import judge0

app = Flask(__name__)

cors = CORS(app)

@app.route('/run', methods=['POST'])
def handleRun():
    if request.method == 'POST':
        data = request.get_json()
        
        # print(data['srcCode'])
        srcCode = data['srcCode']
        language = data['language']
        #TODO do something with the source code

        tken = 0 
        # tken = judge0.submit_submission(srcCode, language)

        return json.dumps({'success':True, 'token': tken}), 200, {'ContentType':'application/json'}

@app.route('/get_question', methods= ['GET'])
def getQuestion():
    question_id = ''
    with open('/home/aggerio/code_playground/ai_interviewer/globals/vrrt.json ',
              'r') as f:
        question_id = f.read();
        question_id = json.dumps(question_id)
        question_id = question_id['question_id']

    final_question = ''
    with open('/home/aggerio/code_playground/ai_interviewer/globals/question_list.json', 'r') as f:
        question = json.dumps(f.read())
        final_question = question['question_id']

    return json.dumps({'question': final_question}), 200

@app.route('run_code', methods = ['POST'])
def runCode():
    if request.method == 'POST':
        data = request.get_json();
        srcCode = data['srcCode']
        input = data['input']
        output = data['output']

        token = judge0.submit_submission(srcCode, input, output)
        response_dict = {'token': token}
        return json.dumps(response_dict)

@app.route('get_output', methods = ['POST'])
def getOutput():
    if request.method == 'POST':
        data = request.get_json()
        token = data['token']
        response_json= judge0.get_submission_data(token)

        return response_json
       

if __name__ == '__main__':
    app.run(host= "0.0.0.0", port =5000, debug=True)

