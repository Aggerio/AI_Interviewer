import urllib3
from urllib.parse import urlencode
import json
import time


# id: 76 c++
# id: 71 python 3.8.1

def get_languages():
    http = urllib3.PoolManager();
    url = "http://localhost:2358/languages"

    response = http.request('GET', url)
    if response.status == 200:
        print(response.data.decode('utf-8'))
    else:
        print(f"Error {response.status}")

def submit_submission(source_code,given_input, given_output, language_id = 71):
    http = urllib3.PoolManager()

    # Specify the URL you want to request.
    url = 'http://localhost:2358/submissions?base64_encoded=false&wait=false'

    # Define headers as a dictionary.
    headers = {
        'Content-Type': 'application/json',
    }

    # Define the data payload as a dictionary.
    data_payload = {
        "source_code": source_code,
        "language_id": language_id,
        "callback_url":"http://host.docker.internal:5000/judge0/",
        "stdin": given_input, 
        "number_of_runs":1,
        "expected_output": given_output,
    }

    # Convert the data payload to JSON format.
    json_payload = json.dumps(data_payload)

    # Send a POST request with headers and data.
    response = http.request('POST', url, headers=headers, body=json_payload)

    # Check the response status code.
    if response.status == 201:
        # If the status code is 200 (OK), you can access the content using response.data.
        x = response.data.decode('utf-8').split("\"")
        print(response.data.decode('utf-8'))

        # Do something with this token ig
        # print(x[3])
        return x[3]
    else:
        # If the status code is not 200, there was an error.
        print(f"Error: {response.status}")

def get_submission_data(token):

    http = urllib3.PoolManager()

    url = f'http://localhost:2358/submissions/{token}?base64_encoded=false&fields=*' 

    # #we know that we no program will execute longer than 10 seconds 
    # # so we enter a while true loop to keep checking if submission has finished

    initial_time = time.time();
    current_time = time.time();

    final_response = ''
    response_dict = {'final_response': '', 'message': '' }

    while (current_time - initial_time) <= 10:
        # check for the submission status id
        response = http.request('GET', url).data.decode('utf-8')
        response = json.loads(response)
        message = response['message']
        if(response['status_id'] == 1 or response['status_id'] == 2 ):
            print("Triggered 1")
            time.sleep(0.2)
        elif(response['status_id'] == 3):
            print("Triggered 2")
            final_response = 'Accepted'
            response_dict['final_response'] = final_response
            response_dict['message'] = message
            return json.dumps(response_dict)

        elif(response['status_id'] == 3):
            print("Triggered 3")
            response_dict['final_response'] = final_response
            response_dict['message'] = message
            return json.dumps(response_dict)
            final_response = 'Accepted'
            return final_response
        elif(response['status_id'] == 4):
            print("Triggered 4")
            final_response = 'Wrong Answer'
            response_dict['final_response'] = final_response
            response_dict['message'] = message
            return json.dumps(response_dict)
            
            return final_response

        elif(response['status_id'] == 5):
            print("Triggered 5")
            final_response = 'Time Limit Exceeded'
            response_dict['final_response'] = final_response
            response_dict['message'] = message
            return json.dumps(response_dict)
            return final_response

        elif(response['status_id'] == 6):
            print("Triggered 666666")
            final_response = 'Compilation Error'
            response_dict['final_response'] = final_response
            response_dict['message'] = message
            return json.dumps(response_dict)
            return final_response

        else:
            print("Triggered 7")
            final_response = 'Runtime Error'
            response_dict['final_response'] = final_response
            response_dict['message'] = message
            return json.dumps(response_dict)
            return final_response


        current_time = time.time()
    print("Reached here")

    # response = http.request('GET', url)
    # print(response.data.decode('utf-8'))




print(get_submission_data("f1bab00d-2179-4829-b8cd-104223243cf4"))
