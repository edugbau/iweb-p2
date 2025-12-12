import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.core.config import settings

cloudinary.config( 
  cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
  api_key = settings.CLOUDINARY_API_KEY, 
  api_secret = settings.CLOUDINARY_API_SECRET 
)

async def upload_image(file: UploadFile) -> str:
    """
    Uploads an image to Cloudinary and returns the secure URL.
    :param file: The file object from FastAPI UploadFile.
    :return: secure_url string.
    """
    result = cloudinary.uploader.upload(file.file, folder="iweb-p2")
    return result.get("secure_url")
