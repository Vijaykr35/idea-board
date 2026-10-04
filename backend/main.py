import re
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
import httpx

import models
from database import engine, get_db, SessionLocal

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Idea Board API")

# Enable CORS for http://localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class TaskBase(BaseModel):
    text: str
    tag: Optional[str] = None
    status: Optional[str] = "todo"
    position: Optional[int] = 0

class TaskCreate(BaseModel):
    text: str
    tag: Optional[str] = None

class TaskUpdate(BaseModel):
    text: Optional[str] = None
    tag: Optional[str] = None
    status: Optional[str] = None
    position: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    board_id: int
    model_config = ConfigDict(from_attributes=True)

class BoardBase(BaseModel):
    title: str

class BoardCreate(BaseModel):
    title: str

class BoardUpdate(BaseModel):
    title: str

class BoardResponse(BoardBase):
    id: int
    tasks: List[TaskResponse] = []
    model_config = ConfigDict(from_attributes=True)

class ImportRequest(BaseModel):
    text: str

class GenerateRequest(BaseModel):
    topic: str
    level: Optional[str] = "beginner"
    time_per_day: Optional[str] = "1 hour/day"
    model: Optional[str] = "qwen2.5:3b"




def parse_task_line(line: str) -> Optional[tuple[str, Optional[str]]]:
    cleaned = line.strip()
    if not cleaned:
        return None
    
    # Strip leading bullets, numbers, dashes, asterisks
    cleaned = re.sub(r'^[\*\-\d\.\s\)\:\>\+]+', '', cleaned).strip()
    if not cleaned:
        return None
    
    # Strip markdown bold formatting **
    cleaned = cleaned.replace("**", "").strip()
    if not cleaned:
        return None

    # Check for "Phase: task" pattern
    if ":" in cleaned:
        parts = cleaned.split(":", 1)
        # If phase is concise (e.g. less than 30 chars), treat as tag
        if len(parts[0].strip()) < 30 and parts[1].strip():
            return parts[1].strip(), parts[0].strip()
    
    return cleaned, None


def seed_db():
    db = SessionLocal()
    try:
        count = db.query(models.Board).count()
        if count == 0:
            board = models.Board(title="Learn AI")
            db.add(board)
            db.commit()
            db.refresh(board)
            
            sample_tasks = [
                ("Setup Python environment & virtualenv", "Basics", "done", 0),
                ("Learn Fundamentals of Machine Learning & Neural Networks", "Theory", "doing", 1),
                ("Explore Prompt Engineering Techniques", "Prompting", "todo", 2),
                ("Understand LLM Architectures (Transformers)", "Theory", "todo", 3),
                ("Run local models using Ollama", "Local AI", "todo", 4),
                ("Build REST API with FastAPI and Python", "Backend", "done", 5),
                ("Integrate FastAPI with Ollama HTTP endpoints", "Backend", "todo", 6),
                ("Build Kanban UI with React & HTML5 Drag and Drop", "Frontend", "todo", 7),
                ("Connect React Frontend to FastAPI Backend", "Integration", "todo", 8),
                ("Deploy and test full-stack AI application", "DevOps", "todo", 9)
            ]
            
            for text, tag, status_val, pos in sample_tasks:
                task = models.Task(
                    board_id=board.id,
                    text=text,
                    tag=tag,
                    status=status_val,
                    position=pos
                )
                db.add(task)
            db.commit()
    finally:
        db.close()

seed_db()

# Endpoints
@app.get("/boards", response_model=List[BoardResponse])
def list_boards(db: Session = Depends(get_db)):
    boards = db.query(models.Board).all()
    return boards

@app.post("/boards", response_model=BoardResponse)
def create_board(board_in: BoardCreate, db: Session = Depends(get_db)):
    board = models.Board(title=board_in.title)
    db.add(board)
    db.commit()
    db.refresh(board)
    return board

@app.patch("/boards/{board_id}", response_model=BoardResponse)
def rename_board(board_id: int, board_in: BoardUpdate, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    board.title = board_in.title
    db.commit()
    db.refresh(board)
    return board

@app.delete("/boards/{board_id}")
def delete_board(board_id: int, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(board)
    db.commit()
    return {"detail": "Board deleted successfully"}

@app.post("/boards/{board_id}/tasks", response_model=TaskResponse)
def add_task(board_id: int, task_in: TaskCreate, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    max_pos = db.query(models.Task).filter(models.Task.board_id == board_id).count()
    task = models.Task(
        board_id=board_id,
        text=task_in.text,
        tag=task_in.tag,
        status="todo",
        position=max_pos
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_in: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task_in.text is not None:
        task.text = task_in.text
    if task_in.tag is not None:
        task.tag = task_in.tag
    if task_in.status is not None:
        task.status = task_in.status
    if task_in.position is not None:
        task.position = task_in.position
        
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}

@app.post("/boards/{board_id}/import", response_model=List[TaskResponse])
def import_tasks(board_id: int, payload: ImportRequest, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    lines = payload.text.splitlines()
    created_tasks = []
    current_pos = db.query(models.Task).filter(models.Task.board_id == board_id).count()

    for line in lines:
        parsed = parse_task_line(line)
        if parsed:
            text, tag = parsed
            task = models.Task(
                board_id=board_id,
                text=text,
                tag=tag,
                status="todo",
                position=current_pos
            )
            db.add(task)
            created_tasks.append(task)
            current_pos += 1

    db.commit()
    for t in created_tasks:
        db.refresh(t)

    return created_tasks

@app.post("/boards/{board_id}/generate", response_model=List[TaskResponse])
async def generate_tasks(board_id: int, payload: GenerateRequest, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    level = payload.level or "beginner"
    time_per_day = payload.time_per_day or "1 hour/day"
    prompt = f"""You are a task-breakdown assistant. You turn a goal into a small, ordered list of concrete tasks that one person can finish alone.

Goal: {payload.topic}
Experience level: {level}
Time available: {time_per_day}

Rules:
- Output 8 to 12 tasks, grouped into 3 or 4 phases.
- Each task starts with a verb and does ONE thing. Never combine two actions.
- Each task takes 15 to 60 minutes. Put the time in brackets at the end, like (30 min).
- Each task has a clear finish line, so the person knows when it's done.
- Be specific. Name actual things to read, build, try or write. Never write "learn more about X" or "research X".
- Order tasks so each one builds on the one before it.
- Make the last phase a small, real project or output that proves the skill.
- No intro, no closing text, no explanations, no markdown headings.

Output format, one task per line, exactly like this:
1. Phase name: Task (time)

Example for the goal "learn vectors for AI":
1. Math: Write what a vector is and draw one in 2D with its direction and length (20 min)
2. Math: Add, subtract and scale 3 vectors by hand (30 min)
3. Math: Calculate the dot product of 3 pairs of vectors by hand (30 min)
4. Code: Compute dot product and cosine similarity in NumPy for 5 vector pairs (45 min)
5. Embeddings: Generate embeddings for 10 sentences using an embedding model (30 min)
6. Embeddings: Compute cosine similarity between all pairs and check that similar sentences score higher (30 min)
7. Project: Embed 20 of your own notes and build a search that returns the top 3 matches (60 min)

Now break down the goal above. Output only the numbered list."""

    model_name = "qwen2.5:3b"



    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            res = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": model_name, "prompt": prompt, "stream": False}
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Ollama server unreachable at http://localhost:11434. Exception: {str(exc)}"
            )

    if res.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Ollama returned error status {res.status_code}: {res.text}"
        )

    data = res.json()
    response_text = data.get("response", "")

    lines = response_text.splitlines()
    created_tasks = []
    current_pos = db.query(models.Task).filter(models.Task.board_id == board_id).count()

    for line in lines:
        raw_line = line.strip()
        if not raw_line:
            continue
        # Keep only lines starting with a number or bullet
        if re.match(r'^([\d]+[\.\)]|[\*\-\+])', raw_line):
            parsed = parse_task_line(raw_line)
            if parsed:
                text, tag = parsed
                task = models.Task(
                    board_id=board_id,
                    text=text,
                    tag=tag,
                    status="todo",
                    position=current_pos
                )
                db.add(task)
                created_tasks.append(task)
                current_pos += 1

    # If board has no title or default title empty, update board title to topic if empty
    if not board.title or board.title.strip() == "":
        board.title = payload.topic

    db.commit()
    for t in created_tasks:
        db.refresh(t)

    return created_tasks
