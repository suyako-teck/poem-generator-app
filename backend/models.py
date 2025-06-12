from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    work = Column(String(100), nullable=False)
    traits = Column(Text, nullable=False)
    quotes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    poems = relationship("Poem", back_populates="character")

class Poem(Base):
    __tablename__ = "poems"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    source = Column(String(50), nullable=False)  # "image" または "character"
    character_id = Column(Integer, ForeignKey("characters.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    character = relationship("Character", back_populates="poems")
    ratings = relationship("Rating", back_populates="poem")

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    poem_id = Column(Integer, ForeignKey("poems.id"))
    rating = Column(String(20), nullable=False)  # "良い" または "悪い"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    poem = relationship("Poem", back_populates="ratings") 