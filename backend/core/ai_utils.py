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
    "analysis": "A clear string containing a bulleted list of key extracted entities (e.g., Suspects, Weapons, Vehicle Numbers, Locations)."
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
        return {
            "severity": data.get("severity", "Medium"),
            "summary": data.get("summary", "No summary available."),
            "analysis": data.get("analysis", "No details extracted.")
        }
    except Exception as e:
        print(f"Groq AI Error: {e}")
        return {
            "severity": "Unknown",
            "summary": "AI Analysis failed.",
            "analysis": f"Error: {str(e)}"
        }
