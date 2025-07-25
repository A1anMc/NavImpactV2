from logging.config import fileConfig
import os
from dotenv import load_dotenv

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.engine import URL, create_engine

from alembic import context

# Import all models here for Alembic to discover
from app.db.base import Base
from app.core.config import settings

# Load environment variables
load_dotenv(".env")

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

def get_url():
    """
    Get database URL, prioritizing alembic config over environment settings.
    This allows command-line overrides like -x db_url=...
    """
    # First, try to get the URL from the -x command-line argument
    cmd_line_url = context.get_x_argument(as_dictionary=True).get('db_url')
    if cmd_line_url:
        print(f"Using database URL from command line (-x): {cmd_line_url}")
        return cmd_line_url

    # Second, try the sqlalchemy.url from the .ini file
    ini_url = config.get_main_option("sqlalchemy.url")
    if ini_url:
        print(f"Using database URL from alembic.ini: {ini_url}")
        return ini_url
    
    # Finally, fall back to the application settings
    print(f"Using database URL from environment settings: {settings.DATABASE_URL}")
    return settings.DATABASE_URL

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"}
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    url = get_url()
    
    # Configure engine based on database type
    if url.startswith("sqlite"):
        # SQLite configuration
        connectable = create_engine(
            url,
            pool_pre_ping=True,
            connect_args={"check_same_thread": False}
        )
    else:
        # PostgreSQL configuration (Supabase/Render)
        connectable = create_engine(
            url,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            pool_recycle=3600,
            connect_args={
                "application_name": "navimpact-migrations",
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5
            }
        )

    with connectable.connect() as connection:
        # Configure context based on database type
        if url.startswith("sqlite"):
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
                compare_server_default=True,
                render_as_batch=True  # SQLite needs batch mode for ALTER operations
            )
        else:
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
                compare_server_default=True,
                # PostgreSQL-specific settings
                include_schemas=True,
                include_name=True,
                render_as_batch=False  # PostgreSQL doesn't need batch mode
            )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
