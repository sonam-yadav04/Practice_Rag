
from groq import Groq
import os           
from dotenv import load_dotenv
import prepare
load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
    # base_url="https://api.groq.com/openai/v1",
)
# completion = client.completions.create(
#     messages=[
#         {"role": "system", "content": "You are a helpful assistant."}],
#     model="openai/gpt-oss-20b",
#     input="What is the capital of France?",
#     max_tokens=10,
# )
memory =[]
messages = []
def get_answer(query:str):
    
    global memory
    vectorstore = prepare.vectorstore
    results = vectorstore.similarity_search(query, k=2)
    context ="\n\n".join([doc.page_content for doc in results])
    # print("\nRetrieved Context:")
    completion = client.chat.completions.create(
      messages=[
         {
            "role": "system",
            "content": f"""
                
                   You are a helpful assistant.
                    Rules:
                    1. **Conversational messages** (greetings, thanks, apologies, small talk, or asking who you are):
                    Respond naturally and briefly as a friendly assistant, then ask "How can I help you with the document?"
                    2. For all other questions related to the provided context, use the provided context only .
                    3. If the answer is not present in the context, respond with suggest some question from the document you have,give the summary of document. and respond exactly:

                   "sorry, I am not a general-purpose assistant. I can only answer questions related to the document i trained for ."
                    
            
                Context:
                {context}
          
                """
         }],
    
      model="openai/gpt-oss-20b",
     max_tokens=500,
     )
    
    messages.extend(memory)    
    messages.append(
            {
          "role": "user",
            "content": query
     })
   
    # print(completion)
    # print("AI :", completion.choices[0].message.content)
    # print(completion.choices[0].text) 
    answer = completion.choices[0].message.content
    return   answer

    