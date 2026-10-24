import rag
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from fastapi.middleware.cors import  CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class ChatRequest(BaseModel):
    message : str
 
@app.post("/chat")
async def chat(request: ChatRequest):
  
    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail = "message can not be empty"
          
        )
    answer = rag.get_answer(request.message)
    print("question:",request.message)
    print("answer:",answer)
    return {"question":request.message, "res": answer}
    
        
    
    
    