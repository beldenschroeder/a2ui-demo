from a2ui_agent_server.catalog import catalog_id, catalog_summary, load_manifest


def test_loads_shared_manifest():
    manifest = load_manifest()
    assert manifest["catalogId"].startswith("https://")
    assert set(manifest["components"]).issuperset({"Button", "Card", "Text", "TextInput"})


def test_catalog_id_matches_manifest():
    assert catalog_id() == load_manifest()["catalogId"]


def test_summary_lists_every_component():
    summary = catalog_summary()
    for name in load_manifest()["components"]:
        assert f"**{name}**" in summary
