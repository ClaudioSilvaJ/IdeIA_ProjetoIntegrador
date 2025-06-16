from fastapi import Request, Cookie
import uuid
import hashlib
import base64
import hmac
from typing import Optional


class anon_garbage:
    def __init__(self, SECRET_KEY: str):
        self.SECRET_KEY = SECRET_KEY

    def generate_user_token(self, client_data):
        data = f"{client_data}"
        digest = hmac.new(
            self.SECRET_KEY.encode(),
            msg=data.encode(),
            digestmod=hashlib.sha256
        ).digest()
        token = base64.urlsafe_b64encode(digest).decode('utf-8').replace('=', '')
        return token

    def get_anonymous_id(self, request: Request, anon_token: Optional[str] = Cookie(None)):
        if(anon_token):
            if(len(anon_token) >= 32):
                return anon_token
        user_agent = request.headers.get("user.agent", "")
        accept_language = request.headers.get("accept.language", "")
        client_data = f"{user_agent}{accept_language}"
        fingerprint_hash = self.generate_user_token(client_data)
        random_seed = request.cookies.get("anon_seed", uuid.uuid4().hex[:8])
        anon_id = self.generate_user_token(f"{fingerprint_hash}:{random_seed}")
        return anon_id

