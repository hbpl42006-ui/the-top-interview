import bcrypt
from django.contrib.auth.hashers import BasePasswordHasher
from django.utils.crypto import get_random_string

class CustomBcryptHasher(BasePasswordHasher):
    """
    Password hasher to authenticate NextAuth/bcryptjs hashes directly.
    """
    algorithm = "bcrypt"

    def verify(self, password, encoded):
        password = password.encode('utf-8')
        encoded = encoded.encode('utf-8')
        try:
            return bcrypt.checkpw(password, encoded)
        except ValueError:
            return False

    def encode(self, password, salt):
        password = password.encode('utf-8')
        # Generate a bcrypt hash using the provided salt or generating a new one implicitly
        hash = bcrypt.hashpw(password, bcrypt.gensalt(10))
        return hash.decode('utf-8')

    def safe_summary(self, encoded):
        return {
            'algorithm': self.algorithm,
            'hash': '*****',
        }

    def salt(self):
        return get_random_string(12)
