from PyPDF2 import PdfReader
import os


def get_key_words():
    resume_path = '/home/aggerio/code_playground/ai_interviewer/globals/resume.pdf'
    if(os.path.isfile(resume_path)):
        reader = PdfReader(resume_path)
        text = []
        for i in range(len(reader.pages)):
            page = reader.pages[i]
            txt = page.extract_text()
            text.append(txt)
        # print(text)
        return " ".join(text)
    else:
        return "resume not uploaded by candidate"

get_key_words()
        
