"""Work Story: a short, bilingual profile line drafted ONLY from the worker's own signed Passport records.

Claim-grounded: the model sees counts and skill names, never names, clients or free text. Every number and
skill in the output must come from those facts; anything else (or any boast like "best"/"expert") throws the
draft away and the template is used. It never compares the worker to anyone else.
"""

import logging
import re
from collections import Counter

from pydantic import BaseModel

from app.services import aicache
from app.services.i18n import normalise_digits, to_devanagari_digits
from app.services.skills import skills

log = logging.getLogger("sajha.workstory")

CONFIRMED = "client_confirmed_delivery"
BOASTS = re.compile(r"\b(best|top|expert|leading|world[- ]class|guarantee|award|certified|rank|better than)\b|सर्वश्रेष्ठ|उत्कृष्ट|विशेषज्ञ|नम्बर\s*१", re.I)


class WorkStory(BaseModel):
    available: bool
    source: str  # ai | template | none
    story_en: str = ""
    story_ne: str = ""
    claim_ids: list[str] = []


class Facts(BaseModel):
    jobs: int
    on_time: int
    skills: list[dict]  # {id, en, ne, jobs}


def facts(claims: list) -> Facts:
    confirmed = [c for c in claims if c.type == CONFIRMED and c.signature_b64]
    names = {s["id"]: s for s in skills()}
    by_skill = Counter(c.skill for c in confirmed)
    return Facts(
        jobs=len(confirmed),
        on_time=sum(1 for c in confirmed if c.on_time),
        skills=[{"id": k, "en": names.get(k, {}).get("en", k), "ne": names.get(k, {}).get("ne", k), "jobs": n}
                for k, n in by_skill.most_common()],
    )


def template(f: Facts) -> tuple[str, str]:
    skills_en = ", ".join(s["en"].lower() for s in f.skills)
    skills_ne = ", ".join(s["ne"] for s in f.skills)
    job_en = "paid job" if f.jobs == 1 else "paid jobs"
    en = (f"Completed {f.jobs} {job_en} on Sajha Kaam ({skills_en}), {f.on_time} delivered on time. "
          "Each one was confirmed by the client against a written checklist.")
    ne = (f"साझा काममा {to_devanagari_digits(f.jobs)} वटा भुक्तानी भएको काम पूरा ({skills_ne}), "
          f"{to_devanagari_digits(f.on_time)} वटा समयमै बुझाइयो। हरेक काम ग्राहकले लिखित चेकलिस्ट अनुसार पुष्टि गरेका छन्।")
    return en, ne


AI_SYSTEM = """Write a 1-2 sentence work summary a young Nepali freelancer can paste on a CV or LinkedIn, using ONLY \
the facts in the JSON. Use exactly the numbers given and only the skills listed; do not add employers, clients, \
tools, results, adjectives like "best", "expert" or "top", or comparisons with other people. Plain, modest, specific. \
Return ONLY JSON {"story_en": str, "story_ne": str}; story_ne is natural simple Nepali in Devanagari (not Hindi)."""

AI_SCHEMA = {
    "type": "object",
    "properties": {"story_en": {"type": "string"}, "story_ne": {"type": "string"}},
    "required": ["story_en", "story_ne"],
    "additionalProperties": False,
}


def grounded(text: str, f: Facts) -> bool:
    """Every number in the text is one of the facts; no boasts; a sane length."""
    if not text or len(text) > 400 or BOASTS.search(text):
        return False
    allowed = {f.jobs, f.on_time, *(s["jobs"] for s in f.skills)}
    numbers = {int(n) for n in re.findall(r"\d+", normalise_digits(text))}
    return numbers <= allowed


def build(claims: list, llm=None) -> WorkStory:
    f = facts(claims)
    ids = [c.id for c in claims if c.type == CONFIRMED and c.signature_b64]
    if f.jobs == 0:
        return WorkStory(available=False, source="none")
    if llm is not None:
        k = aicache.key("story", f.model_dump_json())
        data = aicache.get(k)
        if data is None:
            try:
                data = llm.json(AI_SYSTEM, f.model_dump_json(), AI_SCHEMA)
                aicache.put(k, data)
            except Exception as e:  # any failure: the template below is always correct
                log.warning("work story AI failed: %s", type(e).__name__)
                data = None
        if data and grounded(str(data.get("story_en", "")), f) and grounded(str(data.get("story_ne", "")), f):
            return WorkStory(available=True, source="ai", story_en=data["story_en"], story_ne=data["story_ne"], claim_ids=ids)
    en, ne = template(f)
    return WorkStory(available=True, source="template", story_en=en, story_ne=ne, claim_ids=ids)
