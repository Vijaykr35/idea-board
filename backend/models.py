from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    tasks = relationship("Task", back_populates="board", cascade="all, delete-orphan", order_by="Task.position")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    text = Column(String, nullable=False)
    tag = Column(String, nullable=True)
    status = Column(String, default="todo", nullable=False)
    position = Column(Integer, default=0, nullable=False)

    board = relationship("Board", back_populates="tasks")
