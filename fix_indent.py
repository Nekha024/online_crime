import os

with open('backend/core/ai_utils.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('                prompt = f\"\"\"', '        prompt = f\"\"\"')

with open('backend/core/ai_utils.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Indentation fixed.")
