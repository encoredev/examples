"""Encore finds this declaration and provisions the database. Django's own
migrations (notes/migrations) manage its schema, so it has no Encore
migrations directory."""

from encore.storage import postgres

db = postgres.Database("{{ident}}")
