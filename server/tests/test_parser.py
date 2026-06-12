from a2ui_agent_server.parser import extract_messages


SAMPLE = """Here is the UI:
<a2ui-json>
[
  {"version": "v0.9", "createSurface": {"surfaceId": "demo", "catalogId": "..."}},
  {"version": "v0.9", "updateComponents": {"surfaceId": "demo", "components": []}}
]
</a2ui-json>
"""


def test_extract_messages_returns_two_messages():
    messages = extract_messages(SAMPLE)
    assert len(messages) == 2
    assert messages[0]["createSurface"]["surfaceId"] == "demo"


def test_extract_messages_returns_empty_on_missing_block():
    assert extract_messages("no block here") == []


def test_extract_messages_handles_malformed_json():
    assert extract_messages("<a2ui-json>[not json]</a2ui-json>") == []
