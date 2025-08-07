from app.api.v1.endpoints import (auth, comments, debug, grants, health,
                                  impact, media, ml_analytics, notion, okr_alignment,
                                  performance, projects, scraper_status,
                                  settings, sge_media, sge_media_health,
                                  social_media, tags, tasks, time_logs, users)
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(grants.router, prefix="/grants", tags=["grants"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(scraper_status.router, prefix="/scraper", tags=["scraper"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(impact.router, prefix="/impact", tags=["impact"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(time_logs.router, prefix="/time-logs", tags=["time-logs"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])

# Performance Monitoring
api_router.include_router(
    performance.router, prefix="/performance", tags=["performance"]
)

# ML Analytics
api_router.include_router(
    ml_analytics.router, prefix="/ml-analytics", tags=["ml-analytics"]
)

# OKR Alignment
api_router.include_router(
    okr_alignment.router, prefix="/okr-alignment", tags=["okr-alignment"]
)

# SGE Media Module
api_router.include_router(sge_media.router, prefix="/sge-media", tags=["sge-media"])
api_router.include_router(sge_media_health.router, tags=["sge-media-health"])
api_router.include_router(debug.router, prefix="/debug", tags=["debug"])

# Notion Integration
api_router.include_router(notion.router, prefix="/notion", tags=["notion"])

# Social Media Integration
api_router.include_router(
    social_media.router, prefix="/social-media", tags=["social-media"]
)
