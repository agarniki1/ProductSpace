export function ArtifactStyles() {
  return (
    <style>{`
      .doc {
        font-family: var(--font-ui);
        font-size: 14px;
        color: var(--ink);
        line-height: 1.7;
      }
      .doc h2 {
        font-family: var(--font-display);
        font-size: 12.5px;
        font-weight: 700;
        color: var(--ink);
        margin: 22px 0 10px;
        display: flex;
        align-items: center;
        gap: 9px;
        letter-spacing: -.01em;
        text-transform: uppercase;
        letter-spacing: .04em;
      }
      .doc h2:first-child { margin-top: 0; }
      .art-section-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background: var(--ai-lt);
        color: var(--ai);
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
        flex-shrink: 0;
        font-family: var(--font-mono);
      }
      .doc p { margin: 0 0 12px; color: var(--ink-2); }
      .doc ul { margin: 0 0 12px; padding-left: 20px; }
      .doc li { margin-bottom: 6px; color: var(--ink-2); }
      .doc strong { color: var(--ink); }
      .doc table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 14px; }
      .doc th {
        text-align: left;
        font-weight: 600;
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: .06em;
        color: var(--ink-3);
        padding: 7px 12px;
        border-bottom: 1.5px solid var(--border-md);
        background: var(--bg-subtle);
      }
      .doc th:first-child { border-radius: var(--radius-sm) 0 0 0; }
      .doc th:last-child { border-radius: 0 var(--radius-sm) 0 0; }
      .doc td {
        padding: 9px 12px;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
        color: var(--ink-2);
      }
      .doc tr:last-child td { border-bottom: none; }
      .doc tr:hover td { background: var(--bg-subtle); }
      .art-note {
        background: var(--ai-lt);
        color: var(--ai-dk);
        border-radius: var(--radius-md);
        padding: 10px 14px;
        font-size: 12.5px;
        margin-top: 14px;
        line-height: 1.5;
        border-left: 3px solid var(--ai-md);
      }
      .editable {
        border-radius: 5px;
        transition: background .12s;
        outline: none;
        min-width: 40px;
      }
      .editable:hover { background: var(--ai-lt); }
      .editable:focus { background: var(--ai-lt); box-shadow: 0 0 0 2px var(--ai-md); }
      .doc pre {
        background: #16161D;
        border-radius: var(--radius-md);
        padding: 16px 18px;
        overflow-x: auto;
        margin: 0 0 14px;
        border: 1px solid rgba(255,255,255,.04);
      }
      .doc code {
        font-family: var(--font-mono);
        font-size: 12.5px;
        line-height: 1.75;
        color: #E2E2EE;
      }
      .doc .k { color: #C084FC; font-weight: 600; }
      .doc .s { color: #86EFAC; }
      .doc .c { color: #71717A; font-style: italic; }
      .doc .f { color: #93C5FD; }
    `}</style>
  );
}
