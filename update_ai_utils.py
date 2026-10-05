import os

with open('backend/core/ai_utils.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_prompt = '''        prompt = f\"\"\"
Analyze the following crime report/complaint. You must analyze EVERY field thoroughly. 
If there is not enough information in the text to accurately fill a specific field, you MUST explicitly state "Not enough information provided in the complaint" for that field.
Extract the following information and return ONLY a valid JSON object. Do not include markdown formatting or backticks around the JSON.
{{
    "severity": "One of: Low, Medium, High, Critical.",
    "summary": "A concise summary of the incident.",
    "missing_details_analysis": ["List the specific crucial details that are missing from this complaint which the police would need to proceed."],
    "suggested_penal_codes": ["List of relevant Indian penal codes (BNS/IPC) for this crime" or ["Not enough info"]],
    "actionable_next_steps": ["List of 3-4 immediate investigative steps for the police" or ["Not enough info"]],
    "extracted_entities": {{
        "suspect_details": ["List of suspect descriptions" or ["Not enough info"]],
        "vehicles": ["List of vehicle details/plates" or ["Not enough info"]],
        "weapons": ["List of weapons mentioned" or ["Not enough info"]],
        "locations": ["List of exact locations mentioned" or ["Not enough info"]]
    }}
}}

Report Text:
{text}
\"\"\"'''

import re

# Replace the old prompt assignment with the new one
pattern = re.compile(r'prompt\s*=\s*f"""[\s\S]*?Report Text:\n\{text\}\n"""', re.MULTILINE)
content = pattern.sub(new_prompt.replace('f"\"\"', 'f"""').replace('\"\"\"', '"""'), content)

# Now update the parsing to include missing info
old_parsing = '''        # Build a comprehensive analysis string for the database TextField
        penal_codes = ", ".join(data.get("suggested_penal_codes", []))
        steps = "\\n".join([f"- {step}" for step in data.get("actionable_next_steps", [])])
        entities = data.get("extracted_entities", {})'''

new_parsing = '''        # Build a comprehensive analysis string for the database TextField
        
        def safe_join(field):
            val = data.get(field, [])
            if isinstance(val, list): return ", ".join(val) if val else 'Not enough information provided'
            return str(val)
            
        def safe_join_entities(entities, field):
            val = entities.get(field, [])
            if isinstance(val, list): return ", ".join(val) if val else 'Not enough information provided'
            return str(val)

        penal_codes = safe_join("suggested_penal_codes")
        
        steps_list = data.get("actionable_next_steps", [])
        if isinstance(steps_list, list):
            steps = "\\n".join([f"- {step}" for step in steps_list]) if steps_list else 'Not enough information provided'
        else:
            steps = str(steps_list)
            
        missing_list = data.get("missing_details_analysis", [])
        if isinstance(missing_list, list):
            missing_info = "\\n".join([f"- {m}" for m in missing_list]) if missing_list else 'No crucial information appears missing.'
        else:
            missing_info = str(missing_list)

        entities = data.get("extracted_entities", {})'''

content = content.replace(old_parsing, new_parsing)

old_format = '''        analysis_str = f"s-,? **Suggested Legal Codes:**\\n{penal_codes if penal_codes else 'None identified'}\\n\\n"
        analysis_str += f"dY"< **Actionable Next Steps:**\\n{steps if steps else 'None'}\\n\\n"
        analysis_str += f"dY"? **Extracted Entities:**\\n"
        analysis_str += f"- Suspects: {', '.join(entities.get('suspect_details', [])) or 'None'}\\n"
        analysis_str += f"- Vehicles: {', '.join(entities.get('vehicles', [])) or 'None'}\\n"
        analysis_str += f"- Weapons: {', '.join(entities.get('weapons', [])) or 'None'}\\n"
        analysis_str += f"- Locations: {', '.join(entities.get('locations', [])) or 'None'}"'''

new_format = '''        analysis_str = f"?? **Information Gap Analysis:**\\n{missing_info}\\n\\n"
        analysis_str += f"?? **Suggested Legal Codes:**\\n{penal_codes}\\n\\n"
        analysis_str += f"?? **Actionable Next Steps:**\\n{steps}\\n\\n"
        analysis_str += f"?? **Extracted Entities:**\\n"
        analysis_str += f"- Suspects: {safe_join_entities(entities, 'suspect_details')}\\n"
        analysis_str += f"- Vehicles: {safe_join_entities(entities, 'vehicles')}\\n"
        analysis_str += f"- Weapons: {safe_join_entities(entities, 'weapons')}\\n"
        analysis_str += f"- Locations: {safe_join_entities(entities, 'locations')}"'''

content = content.replace(old_format, new_format)

with open('backend/core/ai_utils.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ai_utils.py")
