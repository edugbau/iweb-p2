import cloudinary
import cloudinary.uploader
from core.config import settings

class ImageService:
    def __init__(self):
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )

    def upload_image(self, file_content) -> str | None:
        """
        Sube una imagen a Cloudinary.
        :param file_content: Contenido binario del archivo.
        :return: URL segura de la imagen o None.
        """
        try:
            response = cloudinary.uploader.upload(file_content)
            return response.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return None

