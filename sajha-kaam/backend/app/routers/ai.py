"""Small AI helpers that sit inside existing screens (docs/AI_AND_DESIGN_RESEARCH.md, Part A).

None of these rank, score, select or reject people. Each one has a rules or template fallback, so the app
works the same with LLM_PROVIDER=none, just with less help.
"""

import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session, select

from app.auth import current_user, require_role
from app.db import get_session
from app.models import Card, Engagement, Message, PassportClaim, ScamReport, User
from app.schemas.api import ScamSignalOut
from app.services import explain as explain_svc
from app.services import scamshield, workstory
from app.services.llm import get_llm

router = APIRouter(prefix="/v1", tags=["ai"])
worker_only = require_role("worker")


class TextIn(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


class ExplainIn(BaseModel):
    text_en: str = Field(default="", max_length=600)
    text_ne: str = Field(default="", max_length=600)
    target: str = Field(pattern="^(ne|en)$")


@router.post("/ai/scam-check", response_model=list[ScamSignalOut])
def scam_check(body: TextIn, _: User = Depends(current_user)) -> list[ScamSignalOut]:
    return [ScamSignalOut(**s.model_dump()) for s in scamshield.check(body.text, get_llm())]


@router.post("/ai/explain", response_model=explain_svc.Explanation)
def explain(body: ExplainIn, _: User = Depends(current_user)) -> explain_svc.Explanation:
    if not (body.text_en.strip() or body.text_ne.strip()):
        raise HTTPException(422, "nothing to explain")
    return explain_svc.explain(body.text_en, body.text_ne, body.target, get_llm())


@router.get("/me/work-story", response_model=workstory.WorkStory)
def work_story(user: User = Depends(worker_only), session: Session = Depends(get_session)) -> workstory.WorkStory:
    claims = session.exec(select(PassportClaim).where(PassportClaim.user_id == user.id)).all()
    return workstory.build(list(claims), get_llm())


@router.post("/engagements/{engagement_id}/messages/{message_id}/report", response_model=dict)
def report_message(engagement_id: str, message_id: str, user: User = Depends(current_user),
                   session: Session = Depends(get_session)) -> dict:
    eng = session.get(Engagement, engagement_id)
    card = session.get(Card, eng.card_id) if eng else None
    msg = session.get(Message, message_id)
    if not eng or not card or user.id not in (card.client_id, eng.worker_id) or not msg or msg.engagement_id != eng.id:
        raise HTTPException(404, "not found")
    if msg.sender_id == user.id:
        raise HTTPException(409, "you can only report messages you received")
    existing = session.exec(select(ScamReport).where(ScamReport.message_id == msg.id, ScamReport.reported_by == user.id)).first()
    if existing:
        return {"report_id": existing.id, "status": existing.status}
    codes = [s.code for s in scamshield.check_rules(msg.text)]
    r = ScamReport(message_id=msg.id, engagement_id=eng.id, reported_by=user.id, signals_json=json.dumps(codes))
    session.add(r)
    session.commit()
    return {"report_id": r.id, "status": r.status}


@router.get("/admin/scam-reports", response_model=list[dict])
def scam_reports(_: User = Depends(require_role("admin")), session: Session = Depends(get_session)) -> list[dict]:
    rows = session.exec(select(ScamReport).where(ScamReport.status == "open").order_by(ScamReport.created_at)).all()
    out = []
    for r in rows:
        m = session.get(Message, r.message_id)
        out.append({"id": r.id, "engagement_id": r.engagement_id, "message": m.text if m else "",
                    "signals": json.loads(r.signals_json), "created_at": r.created_at.isoformat()})
    return out
