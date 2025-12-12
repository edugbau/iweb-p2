"""
Servicio de subida de imágenes a Cloudinary.
"""

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from core.config import settings


class CloudinaryService:
    """
    Servicio para gestionar la subida de imágenes a Cloudinary.
    """
    
    def __init__(self):
        """
        Inicializa la configuración de Cloudinary con las credenciales.
        """
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret
        )
    
    async def upload_image(self, file: UploadFile, folder: str = "iweb-locations") -> str | None:
        """
        Sube una imagen a Cloudinary.
        :param file: Archivo de imagen a subir.
        :param folder: Carpeta destino en Cloudinary.
        :return: URL pública de la imagen o None si falla.
        """
        try:
            # Leer el contenido del archivo
            contents = await file.read()
            
            # Subir a Cloudinary
            result = cloudinary.uploader.upload(
                contents,
                folder=folder,
                resource_type="image",
                transformation=[
                    {"width": 800, "height": 600, "crop": "limit"},
                    {"quality": "auto:good"}
                ]
            )
            
            return result.get("secure_url")
        
        except Exception as e:
            print(f"❌ Error al subir imagen a Cloudinary: {e}")
            return None
    
    def delete_image(self, public_id: str) -> bool:
        """
        Elimina una imagen de Cloudinary.
        :param public_id: ID público de la imagen a eliminar.
        :return: True si se eliminó correctamente.
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            print(f"❌ Error al eliminar imagen de Cloudinary: {e}")
            return False


# Instancia global del servicio
cloudinary_service = CloudinaryService()
