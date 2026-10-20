#!/usr/bin/env python
"""Django's command-line utility. Run it through Encore so the database is
configured: `encore exec -- uv run python manage.py <command>`."""

import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
