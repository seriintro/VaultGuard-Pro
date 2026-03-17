"""
utils/image_utils.py
---------------------
Shared helper for decoding a base64 image into a temp file.
Using a context manager guarantees cleanup even on error.
"""

import base64
import os
import tempfile
from contextlib import contextmanager


@contextmanager
def base64_to_tempfile(b64_string: str, suffix: str = ".jpg"):
    """
    Decode a base64 string and write it to a temporary file.

    Usage:
        with base64_to_tempfile(data['image']) as path:
            result = some_service(path)

    The temp file is always deleted on exit.
    """
    try:
        image_data = base64.b64decode(b64_string)
    except Exception as e:
        raise ValueError(f"Invalid base64 image data: {e}")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        tmp.write(image_data)
        tmp.close()
        yield tmp.name
    finally:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)