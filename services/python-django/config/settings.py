"""Django settings, with the database and secret key supplied by Encore."""

from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from encore import secrets
from encore.env import app_meta
from notes.resources import db
from psycopg.conninfo import conninfo_to_dict

BASE_DIR = Path(__file__).resolve().parent.parent

# Debug pages only on your machine.
LOCAL = app_meta().environment.cloud == "local"
DEBUG = LOCAL

# Set it with `encore secret set --service {{name}} DjangoSecretKey`; locally a
# fixed development key stands in until you do.
secret_key = secrets.Secret[str]("DjangoSecretKey")
try:
    SECRET_KEY = secret_key.value
except KeyError:
    if not LOCAL:
        raise ImproperlyConfigured("set the DjangoSecretKey secret") from None
    SECRET_KEY = "django-insecure-local-development-only"

# Requests reach the service through Encore's gateway, which decides which
# hosts are served and passes on the host and scheme the client used, as the
# admin's CSRF checks need.
ALLOWED_HOSTS = ["*"]
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
if LOCAL:
    # `encore run` forwards requests to the service with `Host: 127.0.0.1`,
    # so the admin's CSRF check is told the gateway's address. Add yours if
    # you run on another port (`encore run --port`).
    CSRF_TRUSTED_ORIGINS = ["http://localhost:4000", "http://127.0.0.1:4000"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "notes.apps.NotesConfig",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]
WSGI_APPLICATION = "config.wsgi.application"

# Encore provisions the database and gives its connection string; Django's
# standard PostgreSQL backend connects with psycopg. Parsing it with psycopg
# keeps its escaping and options.
connection = conninfo_to_dict(db.connection_string)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": connection.pop("dbname"),
        "USER": connection.pop("user", ""),
        "PASSWORD": connection.pop("password", ""),
        "HOST": connection.pop("host", ""),
        "PORT": connection.pop("port", ""),
        "OPTIONS": connection,
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
# Under the service's prefix, so the admin's styles route through the gateway.
STATIC_URL = "/{{name}}/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
