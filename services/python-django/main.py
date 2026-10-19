"""The service's entrypoint: apply Django's migrations, then serve on the
address Encore assigns."""

import logging
import os

from django.core.management import call_command, execute_from_command_line
from encore.logs import ConsoleHandler


def listen_addr() -> str:
    """Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its
    own, this falls back to PORT and then to 8080."""
    return (
        os.environ.get("ENCORE_LISTEN_ADDR")
        or f"0.0.0.0:{os.environ.get('PORT', '8080')}"
    )


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    # Print `logging` records in Encore's log format, with the current trace ids.
    logging.basicConfig(level=logging.INFO, handlers=[ConsoleHandler()])

    import django

    django.setup()
    # Django owns the schema: bring the database up to date before serving.
    call_command("migrate", interactive=False)
    # Encore restarts the service on changes, so Django's reloader is off.
    execute_from_command_line(["manage.py", "runserver", listen_addr(), "--noreload"])


if __name__ == "__main__":
    main()
