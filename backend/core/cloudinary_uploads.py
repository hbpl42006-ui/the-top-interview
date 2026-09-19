from pathlib import Path

import cloudinary
import cloudinary.uploader
from django.core.exceptions import ValidationError

IMAGE_MAX_BYTES = 5 * 1024 * 1024
VIDEO_MAX_BYTES = 15 * 1024 * 1024
IMAGE_TYPES = {"image/jpeg": {".jpg", ".jpeg"}, "image/png": {".png"}, "image/webp": {".webp"}}


def upload_image_asset(uploaded_file, folder):
    content_type = (uploaded_file.content_type or "").lower()
    suffix = Path(uploaded_file.name or "").suffix.lower()
    if content_type in IMAGE_TYPES:
        if suffix not in IMAGE_TYPES[content_type]:
            raise ValidationError("The uploaded file extension does not match its image type.")
        if uploaded_file.size > IMAGE_MAX_BYTES:
            raise ValidationError("Images must be 5 MB or smaller.")
        resource_type = "image"
    elif content_type == "video/mp4" and suffix == ".mp4":
        if uploaded_file.size > VIDEO_MAX_BYTES:
            raise ValidationError("MP4 videos must be 15 MB or smaller.")
        resource_type = "video"
    else:
        raise ValidationError("Upload a JPG, JPEG, PNG, WEBP image or MP4 video.")

    if not cloudinary.config().cloud_name:
        raise ValidationError("Cloudinary uploads are not configured on this server.")
    try:
        uploaded_file.seek(0)
        result = cloudinary.uploader.upload(uploaded_file, folder=f"the-top-interview/{folder}", resource_type=resource_type)
    except Exception as exc:
        raise ValidationError("The creative could not be uploaded. Please try again.") from exc
    secure_url = result.get("secure_url") if result else None
    if not secure_url or not secure_url.startswith("https://"):
        raise ValidationError("Cloudinary did not return a secure creative URL.")
    return secure_url


def upload_advertisement_creative(uploaded_file):
    return upload_image_asset(uploaded_file, "advertisements")
