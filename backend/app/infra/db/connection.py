from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.infra.config import settings


engine = create_engine(settings.DATABASE_URI)

@contextmanager
def get_db():
    with Session(engine) as session:
        yield session
