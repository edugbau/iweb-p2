from fastapi_sso.sso.google import GoogleSSO
from app.core.config import settings

# Initialize Google SSO instance
google_sso = GoogleSSO(
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    redirect_uri="http://localhost:8000/api/v1/auth/callback",
    allow_insecure_http=True  # ONLY FOR LOCAL DEV
)
