from fastapi import APIRouter, HTTPException, Request
from starlette.responses import RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings
from app.core.security import create_access_token
import secrets

router = APIRouter()

# Store state for CSRF protection (in production, use Redis)
_oauth_states = {}

@router.get("/login", summary="Login with Google", response_model=None)
async def login():
    """
    Redirects the user to Google for authentication.
    """
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = True
    
    redirect_uri = "http://localhost:8000/api/v1/auth/callback"
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"redirect_uri={redirect_uri}&"
        f"state={state}"
    )
    
    return RedirectResponse(url=google_auth_url)

@router.get("/callback", summary="Login callback", response_model=None)
async def login_callback(code: str, state: str):
    """
    Processes the login callback from Google.
    Exchanges code for token and redirects to frontend.
    """
    # Verify state (CSRF protection)
    if state not in _oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    del _oauth_states[state]
    
    # Exchange code for token
    import httpx
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": "http://localhost:8000/api/v1/auth/callback",
        "grant_type": "authorization_code",
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code for token")
        
        token_data = response.json()
        id_token_str = token_data.get("id_token")
        
        if not id_token_str:
            raise HTTPException(status_code=400, detail="No ID token received")
        
        # Verify the ID token
        try:
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=10  # Allow 10 seconds of clock skew
            )
            
            email = idinfo.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="No email in token")
            
            # Create JWT
            jwt_token = create_access_token(subject=email)
            
            # Redirect to frontend with token
            frontend_url = "http://localhost:5173/auth/callback"
            return RedirectResponse(url=f"{frontend_url}?token={jwt_token}")
            
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Token verification failed: {str(e)}")
