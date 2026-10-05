import os
from groq import Groq
import json

def analyze_text_with_groq(text):
    """
    Calls the Groq API to analyze the complaint text.
    Returns a dictionary with 'severity', 'summary', and 'analysis'.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    
    if not api_key:
        return {
            "severity": "Unknown",
            "summary": "AI Analysis unavailable. GROQ_API_KEY is not configured.",
            "analysis": "Please set the GROQ_API_KEY environment variable to enable AI insights."
        }
    
    try:
        client = Groq(api_key=api_key)
        prompt = f"""
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
"""
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b", 
            temperature=0.1
        )
        content = response.choices[0].message.content.strip()
        
        # Clean up any potential markdown
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        data = json.loads(content)
        
        # Build a comprehensive analysis string for the database TextField
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
            steps = "\n".join([f"- {step}" for step in steps_list]) if steps_list else 'Not enough information provided'
        else:
            steps = str(steps_list) if steps_list else 'Not enough information provided'
            
        missing_list = data.get("missing_details_analysis", [])
        if isinstance(missing_list, list):
            missing_info = "\n".join([f"- {m}" for m in missing_list]) if missing_list else 'No crucial information appears missing.'
        else:
            missing_info = str(missing_list) if missing_list else 'No crucial information appears missing.'

        entities = data.get("extracted_entities", {})
        
        analysis_str = f"[MISSING] **Information Gap Analysis:**\n{missing_info}\n\n"
        analysis_str += f"?? **Suggested Legal Codes:**\n{penal_codes}\n\n"
        analysis_str += f"?? **Actionable Next Steps:**\n{steps}\n\n"
        analysis_str += f"?? **Extracted Entities:**\n"
        analysis_str += f"- Suspects: {safe_join_entities(entities, 'suspect_details')}\n"
        analysis_str += f"- Vehicles: {safe_join_entities(entities, 'vehicles')}\n"
        analysis_str += f"- Weapons: {safe_join_entities(entities, 'weapons')}\n"
        analysis_str += f"- Locations: {safe_join_entities(entities, 'locations')}"

        return {
            "severity": data.get("severity", "Medium"),
            "summary": data.get("summary", "No summary available."),
            "analysis": analysis_str
        }
    except Exception as e:
        print(f"Groq AI Error: {e}")
        return {
            "severity": "Unknown",
            "summary": "AI Analysis failed.",
            "analysis": f"Error: {str(e)}"
        }
