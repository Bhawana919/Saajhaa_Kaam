"""A tiny in-process cache for AI helper results, keyed by a hash of the input.

Saves money and slow-network round trips when the same message or checklist item is asked about twice.
Content is never logged; only the hash is a key. Bounded, oldest entries dropped first.
"""

import hashlib
from collections import OrderedDict

_MAX = 512
_store: "OrderedDict[str, dict]" = OrderedDict()


def key(kind: str, *parts: str) -> str:
    h = hashlib.sha256("\x1f".join((kind, *parts)).encode("utf-8")).hexdigest()
    return f"{kind}:{h}"


def get(k: str) -> dict | None:
    v = _store.get(k)
    if v is not None:
        _store.move_to_end(k)
    return v


def put(k: str, v: dict) -> None:
    _store[k] = v
    _store.move_to_end(k)
    while len(_store) > _MAX:
        _store.popitem(last=False)


def clear() -> None:
    _store.clear()
