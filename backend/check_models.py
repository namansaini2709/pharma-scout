import google.generativeai as genai
import os

# Use the key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY environment variable not set.")
else:
    genai.configure(api_key=api_key)
    print("Listing available models for your key:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
