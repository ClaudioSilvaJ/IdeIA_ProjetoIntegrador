import ollama

def chatWithAI(prompt: str) -> str:
    try:
        response = ollama.chat(
            model="llama3.1",
            messages=[{"role": "user", "content": prompt}],
            stream=False
        )
        return response['message']
    except Exception as e:
        print(f"Error during chat with AI: {e}")
        return "An error occurred while communicating with the AI."
    