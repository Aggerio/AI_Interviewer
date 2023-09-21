# Intellihire - Your AI Interviewer

![product explaining image](https://github.com/Aggerio/AI_Interviewer/blob/trial/design.jpeg)


## Features
1. Efficiency: AI interview systems can quickly screen a large number of applicants, saving time and resources for HR teams.


3. Cost-Effective: Automating initial screenings and assessments can significantly lower recruitment costs.

4. 24/7 Availability: AI interview systems can operate around the clock, accommodating candidates from different time zones.

5. Scalability: These systems can handle a growing number of applicants without a proportional increase in human effort.

6. Data-Driven Insights: AI systems can analyze candidate responses and provide data-driven insights for better decision-making.

7. Reduction of Unconscious Bias: They help minimize bias based on gender, ethnicity, or other factors by evaluating candidates solely on their qualifications.

8. Improved Candidate Experience: Candidates appreciate the convenience and speed of AI interviews, leading to a positive impression of the hiring company.

9. Faster Hiring: Quick assessments help organizations hire talent faster, reducing time-to-fill positions.

10. Flexibility: AI interview systems can be customized to fit various job roles and industries.

12. Feedback and Analytics: They provide HR teams with valuable feedback on the effectiveness of interview questions and candidate performance.

13. **Remote Hiring:AI interviews enable companies to evaluate candidates from anywhere.

14. Adaptive Learning: Some systems can adapt their questions based on candidate responses, providing a more tailored assessment.

15. Future-Proofing: As AI technology advances, these systems can continue to improve and stay up-to-date with best practices in hiring.

16. Global Reach: They enable companies to tap into a global talent pool, expanding their search for the best candidates.

17. Reduced Human Error: Eliminating human error in the initial screening process leads to more accurate candidate evaluations.


# DEVELOPER INFO

fronted --> react

backend --> flask 

database --> firebase/google cloud bucket

SERVERS AND THEIR PORTS --> 
```
code_execution --> localhost:5000

video_server --> localhost:5001

speech_to_text --> localhost:8081

interview_response_server --> localhost:5002
```

CENTRAL GLOBAL FILE PATHS --> 

```
interview_response = 
/home/aggerio/code_playground/ai_interviewer/globals/interview_response

question_list =
/home/aggerio/code_playground/ai_interviewer/globals/question_list.json

variable required real time =
/home/aggerio/code_playground/ai_interviewer/globals/vrrt.json

the resume pdf of the candidate = 
/home/aggerio/code_playground/ai_interviewer/globals/resume.pdf
```

VARIABLES IN vrrt.json --> 
```
0) interview started
1) current stage
2) current question id from question_list.json
3) current confidence 
4) current_eye_position 
5) current head position 
6) current mouth position
7) current number of people in frame
8) phone present in frame
```



ROADMAP --> 
1) Realtime video and audio processing of the user
2) Setup a remote code sandbox to execute code
3) Feed chatgpt that code 

Step 1)
```
o) Get the webcam feed with audio from the user  --> DONE 
o) Learn how to send the camera feed to a server to be processed --> DONE
```

Step 2)
```
o) Setup the remote code execution environment --> Setup Judge0 setup of monaco --> DONE
is done --> will start implementing the backend for the judging environment --> DONE
o) Find relevant test cases + coding questions --> DONE
o)Setup test cases for the judge 0 run time --> DONE
```

Step 3)
```
o) Get the open ai api key and learn to use it --> DONE 
o) Integrate chatgpt into stage 1, stage 2 and stage 3 --> done in stage 1 and 2 incompletely
```

Optional)
```
o) Make a functionality to read the candidate's resume and quote from it --> DONE
o) Make the ai answer questions at the end --> similar prompt, copy from stage 1
```
