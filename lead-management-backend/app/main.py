from fastapi import FastAPI
from app.db.database import Base, engine, test_connection
from app.core.security import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from app.models.signin import User
from app.routers import telecaller_router, lead_router, auth_router, leadcall_router, reminder_router, dashboard_router, export_leads_router, admin_telecaller_router, reports_router

app = FastAPI(title="Lead Management Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    test_connection()
    Base.metadata.create_all(bind=engine)

app.include_router(telecaller_router.router)
app.include_router(lead_router.router)
app.include_router(auth_router.router)
app.include_router(leadcall_router.router)
app.include_router(reminder_router.router)
app.include_router(dashboard_router.router)
app.include_router(export_leads_router.router)
app.include_router(admin_telecaller_router.router)
app.include_router(reports_router.router)

@app.get("/")
def root():
    return {"message": "Hello from the restructured backend!"}
