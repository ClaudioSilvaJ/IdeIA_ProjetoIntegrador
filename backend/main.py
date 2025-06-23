from fastapi import FastAPI, Request, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mongo import MongoDB
from message_model import MessageModel
from chatgpt import chatWithAI, chat_with_genai, chat_coleta
from datetime import datetime
import uuid
import hashlib
import os
from util import anon_garbage
from connection_manager import ConnectionManager

SECRET_KEY = os.urandom(32).hex()

origins = [
    "http://localhost:5173",
]

anon_garbage_instance = anon_garbage(SECRET_KEY)

mongo = MongoDB("mongodb://localhost:27037", "AnonDB")

app = FastAPI()

manager = ConnectionManager()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def remove_identifying_headers(request: Request, call_next):
    response = await call_next(request)
    if("server" in response.headers):
        del response.headers["server"]
    if("x-powered-by" in response.headers):
        del response.headers["x-powered-by"]
    response.headers["server"] = "server"
    return response

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/message", status_code=201)
async def create_message(
    message: MessageModel,
    request: Request,
    anon_id: str = Depends(anon_garbage_instance.get_anonymous_id),
):
    sanitized_message = message.message.strip()
    message_hash = hashlib.sha256(sanitized_message.encode()).hexdigest()
    message_ia = chat_coleta(sanitized_message)
    message_id = str(uuid.uuid4())
    message_data = {
        "message": sanitized_message,
        "message_ia": message_ia,
        "timestamp": datetime.now().isoformat(),
        "anon_id": anon_id,
        "message_hash": message_hash,
        "message_id": message_id,
    }
    mongo.insert_one("messages", message_data)

    await manager.broadcast({
        "message_id": message_id,
        "user_id": anon_id,
        "message_ia": message_ia,
        "message": sanitized_message,
        "timestamp": message_data["timestamp"],
    })

    response = JSONResponse(content={
        "message_id": message_id,
        "user_id": anon_id
    })
    response.set_cookie(
        key="anon_token",
        value=anon_id,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60*60*24*365
    )
    return response
    
@app.websocket("/ws/messages")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        messages = mongo.find("messages")
        sanatized_messages = []
        for msg in messages:
            if "_id" in msg:
                del msg["_id"]
            sanatized_messages.append({
                "message_id": msg["message_id"],
                "user_id": msg["anon_id"],
                "message": msg["message"],
                "message_ia": msg["message_ia"],
                "timestamp": msg["timestamp"],
            })
        await websocket.send_json({"messages": sanatized_messages})
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)



@app.get("/messages")
async def get_messages():
    messages = mongo.find("messages")
    sanitized_messages = []
    for msg in messages:
        if "_id" in msg:
            del msg["_id"]
        sanitized_messages.append({
            "message_id": msg["message_id"],
            "user_id": msg["anon_id"],
            "message_ia": msg["message_ia"],
            "message": msg["message"],
            "timestamp": msg["timestamp"],
        })
    return {"messages": sanitized_messages}


@app.post("/user/new-identity")
async def create_new_identity(request: Request):
    new_seed = uuid.uuid4().hex[:8]
    response = JSONResponse(content={"message": "New identity created"})
    response.delete_cookie("anon_token")
    response.set_cookie(
        key="anon_seed",
        value=new_seed,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60*60*24*365
    )
    return response
    