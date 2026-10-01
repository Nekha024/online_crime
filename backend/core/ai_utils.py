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
Analyze the following crime report/complaint. 
Extract the following information and return ONLY a valid JSON object. Do not include markdown formatting or backticks around the JSON.
{{
    "severity": "One of: Low, Medium, High, Critical (e.g. active violence, kidnapping, murder are Critical. Stolen items are Low/Medium).",
    "summary": "A concise 2-sentence summary of the incident.",
    "suggested_penal_codes": ["List of relevant Indian penal codes (BNS/IPC) for this crime"],
    "actionable_next_steps": ["List of 3-4 immediate investigative steps for the police"],
    "extracted_entities": {{
        "suspect_details": ["List of suspect descriptions"],
        "vehicles": ["List of vehicle details/plates"],
        "weapons": ["List of weapons mentioned"],
        "locations": ["List of exact locations mentioned"]
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
        penal_codes = ", ".join(data.get("suggested_penal_codes", []))
        steps = "\n".join([f"- {step}" for step in data.get("actionable_next_steps", [])])
        entities = data.get("extracted_entities", {})
        
        analysis_str = f"⚖️ **Suggested Legal Codes:**\n{penal_codes if penal_codes else 'None identified'}\n\n"
        analysis_str += f"📋 **Actionable Next Steps:**\n{steps if steps else 'None'}\n\n"
        analysis_str += f"🔍 **Extracted Entities:**\n"
        analysis_str += f"- Suspects: {', '.join(entities.get('suspect_details', [])) or 'None'}\n"
        analysis_str += f"- Vehicles: {', '.join(entities.get('vehicles', [])) or 'None'}\n"
        analysis_str += f"- Weapons: {', '.join(entities.get('weapons', [])) or 'None'}\n"
        analysis_str += f"- Locations: {', '.join(entities.get('locations', [])) or 'None'}"

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
