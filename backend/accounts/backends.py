from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from accounts.hashers import CustomBcryptHasher

class NextAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            user = UserModel.objects.get(**{UserModel.USERNAME_FIELD: username})
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing difference
            UserModel().set_password(password)
            return None
        
        # Check custom bcrypt hash if it doesn't start with a django algorithm prefix
        if user.password and user.password.startswith('$2'):
            hasher = CustomBcryptHasher()
            if hasher.verify(password, user.password):
                return user
        else:
            if user.check_password(password):
                return user
        return None
