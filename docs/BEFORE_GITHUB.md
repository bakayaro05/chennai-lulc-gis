# Before the first GitHub push

1. Confirm the archive count equals the upstream tracked-file count.
2. Inspect code for credentials, secret tokens, confidential data and personal identifiers.
3. Do not commit `.gitcookies`, `.git/` from Earth Engine, `.env`, large TIFFs or private data.
4. Start with a private GitHub repository; do not publish its historical upstream Git history.
5. Keep original archived files unchanged; populate `scripts/gee/` only after a source-level audit.
6. Add a per-script catalogue later including actual purpose, input assets, output assets and adopted/superseded status.
