"""The service's entrypoint: apply Django's migrations, then serve on the
address Encore assigns."""

import logging
import os

import encore
from encore.logs import ConsoleHandler


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    # Print `logging` records in Encore's log format, with the current trace ids.
    logging.basicConfig(level=logging.INFO, handlers=[ConsoleHandler()])

    # Importing the ASGI application sets Django up.
    from config.asgi import application
    from django.conf import settings
    from django.core.management import call_command

    # Django owns the schema: bring the database up to date before serving.
    call_command("migrate", interactive=False)

    app = application
    if settings.DEBUG:
        # Serve the admin's static files, as `runserver` does when debugging.
        from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler

        app = ASGIStaticFilesHandler(application)

    # Serve the project where Encore assigns the service, on Encore's HTTP
    # server: each request is traced, and the service shuts down gracefully
    # with Encore. Django runs the views, which are synchronous, on a thread.
    encore.run(app)


if __name__ == "__main__":
    main()
