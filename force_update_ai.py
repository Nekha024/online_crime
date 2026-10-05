import os
import re

with open('backend/core/ai_utils.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace everything from "def safe_join(" or "penal_codes = " down to "return {"
start_idx = content.find('# Build a comprehensive analysis string')
end_idx = content.find('return {', start_idx)

if start_idx != -1 and end_idx != -1:
    new_parsing_logic = '''# Build a comprehensive analysis string for the database TextField
        def safe_join(field):
            val = data.get(field, [])
            if isinstance(val, list): return ", ".join(val) if val else 'Not enough information provided'
            return str(val) if val else 'Not enough information provided'
            
        def safe_join_entities(entities, field):
            val = entities.get(field, [])
            if isinstance(val, list): return ", ".join(val) if val else 'Not enough information provided'
            return str(val) if val else 'Not enough information provided'

        penal_codes = safe_join("suggested_penal_codes")
        
        steps_list = data.get("actionable_next_steps", [])
        if isinstance(steps_list, list):
            steps = "\\n".join([f"- {step}" for step in steps_list]) if steps_list else 'Not enough information provided'
        else:
            steps = str(steps_list) if steps_list else 'Not enough information provided'
            
        missing_list = data.get("missing_details_analysis", [])
        if isinstance(missing_list, list):
            missing_info = "\\n".join([f"- {m}" for m in missing_list]) if missing_list else 'No crucial information appears missing.'
        else:
            missing_info = str(missing_list) if missing_list else 'No crucial information appears missing.'

        entities = data.get("extracted_entities", {})
        
        analysis_str = f"?? **Information Gap Analysis:**\\n{missing_info}\\n\\n"
        analysis_str += f"?? **Suggested Legal Codes:**\\n{penal_codes}\\n\\n"
        analysis_str += f"?? **Actionable Next Steps:**\\n{steps}\\n\\n"
        analysis_str += f"?? **Extracted Entities:**\\n"
        analysis_str += f"- Suspects: {safe_join_entities(entities, 'suspect_details')}\\n"
        analysis_str += f"- Vehicles: {safe_join_entities(entities, 'vehicles')}\\n"
        analysis_str += f"- Weapons: {safe_join_entities(entities, 'weapons')}\\n"
        analysis_str += f"- Locations: {safe_join_entities(entities, 'locations')}"

        '''
    content = content[:start_idx] + new_parsing_logic + content[end_idx:]
    with open('backend/core/ai_utils.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Force update successful.")
else:
    print("Could not find start/end bounds.")
