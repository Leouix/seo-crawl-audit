# Handoff: after report stabilization and local trends

Versions through `0.15.0` are published. Local two-run comparison is available
in the local UI and CLI, large standalone comparison reports use a compact
payload, and bounded multi-run trends work across saved runs in the UI, CLI,
and MCP.

These features remain local-first and exact-site. They do not request site
pages, alter SnapshotV2 or fingerprints, or overwrite the latest scan report.
The GitHub Action `v0` tag remains unchanged pending separate approval.

The 0.14.0 synthetic 50k comparison baseline was about 171 MiB HTML,
890 MiB sampled peak heap, and 1759 MiB sampled RSS. Preserve EN/UK, exports,
filtering, print, package contracts and browser security while reducing size.
For trends, at most two snapshots are read at a time and the browser payload
stays compact. CLI dogfood on existing one-run and three-run histories passed
on October 3, 2026; the three-run history correctly flags the 100-to-1,000-page
coverage change. A separate synthetic two-run × 50,000-page check on Node
24.8.0/macOS took 3.8 seconds with 606 MiB sampled peak heap and 874 MiB
sampled peak RSS. Sampling can miss brief peaks. Remaining verification:
manually inspect the final browser UI against that multi-run history, refresh
README screenshots if the UI has materially changed. The multi-run × 50,000-page
stress benchmark is deferred by maintainer choice; neither the existing
100-run × 1,000-page benchmark nor the two-run × 50,000-page check proves
100-run × 50,000-page performance. Exact-site selection is covered by a local
UI API regression test; final browser visual QA remains pending.
