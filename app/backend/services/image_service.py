import cloudinary
import cloudinary.uploader
from core.config import settings


class ImageService:
    """
    Servicio para gestionar imágenes con Cloudinary.
    Permite subir una o múltiples imágenes.
    """
    
    def __init__(self):
        """Inicializa la configuración de Cloudinary."""
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )

    def upload_image(self, file_content: bytes) -> str | None:
        """
        Sube una imagen a Cloudinary.
        
        :param file_content: Contenido binario del archivo.
        :return: URL segura de la imagen o None si falla.
        """
        try:
            response = cloudinary.uploader.upload(
                file_content,
                folder="reviews"
            )
            return response.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return None

    def upload_multiple_images(self, files_content: list[bytes]) -> list[str]:
        """
        Sube múltiples imágenes a Cloudinary.
        
        :param files_content: Lista de contenidos binarios de archivos.
        :return: Lista de URLs de las imágenes subidas exitosamente.
        """
        urls = []
        for content in files_content:
            url = self.upload_image(content)
            if url:
                urls.append(url)
        return urls

    def delete_image(self, public_id: str) -> bool:
        """
        Elimina una imagen de Cloudinary por su public_id.
        
        :param public_id: ID público de la imagen en Cloudinary.
        :return: True si se eliminó correctamente, False en caso contrario.
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            print(f"Cloudinary delete error: {e}")
            return False

