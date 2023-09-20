import openai
import json
import resume
from dotenv import load_dotenv
import os

def stage1_chatgpt(interviewee_response = ''):

    load_dotenv()

    OPENAI_KEY = os.getenv("OPENAI_KEY")

    # with open('./.env','r') as f:
    #     data= f.read()
    #     data = data.split('=')
    #     OPENAI_KEY=data[1].replace('\n', '')

    openai.api_key=OPENAI_KEY

    #TODO get the relevant keywords from the resume of the candidate 
    # and feed it into chatgpt
    #Check if the interview has started or not
    f = ''
    with open('/home/aggerio/code_playground/ai_interviewer/globals/vrrt.json','r')as json_file:
        f = json.load(json_file)

    started = f['started']
    stage = f['current_stage']
    response = ''
    if(started == False):
        resume_text = resume.get_key_words()
        response = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo",
                messages = [
                    {
                        "role": "user",
                        "content": f"you are an interviewer named josh, you are \
                        starting an interview greet the interviewee with an \
                        appropriate greeting and pose a question from his \
                        resume which has the following key words {resume_text} \
                        pose a relevant question from his projects \
                        "
                        }
                    ]
                )
        f['started'] = True
        with open('/home/aggerio/code_playground/ai_interviewer/globals/vrrt.json','w') as json_file:
            json.dump(f,json_file,indent=4)
    else:
        # read from the previous transcript and understand what the
        # conversation is and what to reply
        transcript_upto_here = ''
        with open(f"/home/aggerio/code_playground/ai_interviewer/globals/stage{stage}.txt",'r') as file:
            transcript_upto_here = file.read()

        response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                    "role":"system",
                    "content":"you are an interviewer currently in conversation \
                    with an interviewee and you have to reply accordingly"
                    }, 
                    {
                        "role": "assistant",
                        "content": f"The conversation upto here was {transcript_upto_here}"
                    },
                    {
                        "role":"user",
                        "content":  "ask relevant question to the candidate or \
                        reply appropriately now to their questions now \n"
                    }
                    ],
                temperature=0,
                max_tokens=1000,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0.6,
                )

    content = response.choices[0].message.content
    print(f"received response from chatgpt: {content}")
    # print(content)
    return content


def stage2_chatgpt(interviewee_response = ''):


    load_dotenv()

    OPENAI_KEY = os.getenv("OPENAI_KEY")

    openai.api_key=OPENAI_KEY

def stage3_chatgpt(interviewee_response = ''):
    load_dotenv()

    OPENAI_KEY = os.getenv("OPENAI_KEY")


    openai.api_key=OPENAI_KEY

