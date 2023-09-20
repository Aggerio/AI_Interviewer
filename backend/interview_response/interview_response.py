from flask import Flask, request
from flask_cors import CORS 
import json
import chatgpt


app = Flask(__name__)
CORS(app)

transcript_file = '/home/aggerio/code_playground/ai_interviewer/globals/interview_response.json'

@app.route('/response', methods = ['POST'])
def process_request():
    if(request.method == 'POST'):
        transcript = request.get_json()
        transcript = transcript['transcript']

        # print(f"received the following input from the interviewee : {transcript}")
        candidate_response = " ".join(transcript)
        print(f"candidate_response: {candidate_response}")

        #Check which stage we are in 
        stage = 0
        with open("/home/aggerio/code_playground/ai_interviewer/globals/vrrt.json",'r') as f:
            stage = json.load(f)
            stage = stage['current_stage']

        #get the current transcript and write to it 
        with open(f'/home/aggerio/code_playground/ai_interviewer/globals/stage{stage}.txt','a') as f:
            # data = f.read()
            new_data = f"user: {candidate_response}\n\n"  
            f.write(new_data)

        response_from_interviewer = ''

        #Process the response transcript 
        # feed it to Chatgpt 
        if(stage == 1):
            response_from_interviewer=chatgpt.stage1_chatgpt()
        elif(stage == 2):
            response_from_interviewer=chatgpt.stage2_chatgpt()
        else:
            response_from_interviewer=chatgpt.stage3_chatgpt()

        #TODO write the response to the interview file

        #set the global interview_response file
        # variables to their desired values
        f = ''
        with open('/home/aggerio/code_playground/ai_interviewer/globals/interview_response.json','r') as json_file:
            f = json.load(json_file)
            f['updated'] = True
            f['response'] = response_from_interviewer
            print("Writing:",f)
        with open('/home/aggerio/code_playground/ai_interviewer/globals/interview_response.json','w') as json_file:
            json.dump(f, json_file, indent=4)

        return json.dumps({'status': True})

@app.route('/updates', methods=['GET'])
def interview_response():
    if(request.method == 'GET'):

        # we also then set the updated to False after sending to avoid an
        # infinite loop
        response = ''
        new_response = ''
        with open("/home/aggerio/code_playground/ai_interviewer/globals/interview_response.json",'r') as json_file:
            response = json.load(json_file) 
            print(response)
            new_response = response 
            # new_response['updated'] = False
            # json.dump(new_response, json_file, indent=4)
        with open('/home/aggerio/code_playground/ai_interviewer/globals/interview_response.json','w') as json_file:
            json.dump(new_response, json_file, indent=4)

        print(response)

        # response_dict = {'update': True, 'response': 'Hello welcome to interview'}
        return json.dumps(response)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port = 5002, debug=True)


