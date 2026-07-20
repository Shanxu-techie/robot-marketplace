# Force Multiplier

Community and professional-development artifacts produced alongside Robot Marketplace development. This is a parallel track — professional development caused by the project, not a milestone of it. See `progress.md` for project status.

## Completed

### Discord

1. Original post — Drizzle `$1` placeholder bug: root cause and manual fix
2. Follow-up reply — upstream issue links (`drizzle-orm#2506`, `#3349`, `#4790`, `drizzle-kit-mirror#461`) and version context

### LinkedIn

3. Lazy `getDb()` initialization — ~84 impressions
4. Drizzle `$1` placeholder bug — ~211 impressions, plus a follow-up comment linking the same upstream issues as the Discord post
5. Docker non-root `EACCES` / `--chown` fix
6. `NOT NULL` migration attempted on a populated table
7. Zod `.parse()` vs `.safeParse()` in a route

### Stack Overflow

8. Answer to an existing community question — "Node.js docker container build failing - npm ERR! code EACCES" (asked by another user, 2022) — on Docker non-root `EACCES`, citing Docker's official `COPY --chown` reference.
   - Current status: answer score -1; an automated "needs more detail" community prompt is attached, which likely predates the edit that added the Docker-docs citation. The underlying question has since been closed by moderators as off-topic — unrelated to the answer's technical content.

## Open

None currently.

## Notes

- **Docker EACCES item — shipped differently than planned, both legitimately:** Originally committed as a self-authored Stack Overflow question + answer. What actually shipped was a LinkedIn post (item 5) and an answer to an existing Stack Overflow question asked by someone else (item 8) — neither matches the original plan exactly, and both are real contributions. Answering an existing question from someone who was actually stuck is arguably the stronger form of the two.
- **Correction:** Item 3 (lazy `getDb()` initialization) was previously mislabeled in `progress.md` as "CI lockfile synchronization lesson." No such post exists; corrected here to the actual topic.