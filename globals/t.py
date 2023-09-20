import json

dct = {
        'started': False,
        'current_stage': 1,
        'current_question_id': 0,
        'current_confidence': 0,
        'current_eye_position': 'center of the screen',
        'current_head_position': 'upright',
        'current_number_people_in_frame': 1,
        }

with open('vrrt.json', 'w') as json_file:
    json.dump(dct, json_file, indent = 4)
