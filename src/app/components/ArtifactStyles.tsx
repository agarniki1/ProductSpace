export function ArtifactStyles() {
  return (
    <style>{`
      .doc {
        font-family: var(--font-ui);
        font-size: 13.5px;
        color: var(--ink);
        line-height: 1.72;
        max-width: 760px;
      }

      .doc > *:first-child {
        margin-top: 0 !important;
      }

      .doc h2 {
        font-family: var(--font-display);
        font-size: 12px;
        font-weight: 700;
        color: var(--ink);
        margin: 28px 0 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        text-transform: uppercase;
        letter-spacing: .05em;
        line-height: 1.2;
      }

      .doc h2:first-child {
        margin-top: 0;
      }

      .art-section-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        background: rgba(91,120,239,.08);
        color: var(--ai);
        border-radius: 5px;
        font-size: 9.5px;
        font-weight: 700;
        flex-shrink: 0;
        font-family: var(--font-mono);
        border: 1px solid rgba(91,120,239,.10);
      }

      .doc p {
        margin: 0 0 12px;
        color: var(--ink-2);
      }

      .doc strong {
        color: var(--ink);
        font-weight: 600;
      }

      .doc ul,
      .doc ol {
        margin: 0 0 14px;
        padding-left: 18px;
      }

      .doc li {
        margin-bottom: 6px;
        color: var(--ink-2);
        padding-left: 2px;
      }

      .doc li::marker {
        color: rgba(20,24,34,.38);
      }

      .doc hr {
        border: none;
        height: 1px;
        margin: 18px 0;
        background: rgba(20,24,34,.07);
      }

      .doc blockquote {
        margin: 0 0 14px;
        padding: 2px 0 2px 14px;
        border-left: 2px solid rgba(20,24,34,.10);
        color: var(--ink-2);
      }

      .doc a {
        color: var(--ink);
        text-decoration: underline;
        text-decoration-color: rgba(20,24,34,.18);
        text-underline-offset: 2px;
      }

      .doc a:hover {
        text-decoration-color: rgba(20,24,34,.34);
      }

      .doc table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 12.5px;
        margin: 0 0 16px;
        border: 1px solid rgba(20,24,34,.08);
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255,255,255,.70);
      }

      .doc th {
        text-align: left;
        font-weight: 600;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: .06em;
        color: var(--ink-3);
        padding: 9px 12px;
        border-bottom: 1px solid rgba(20,24,34,.07);
        background: rgba(20,24,34,.025);
        vertical-align: bottom;
      }

      .doc td {
        padding: 10px 12px;
        border-bottom: 1px solid rgba(20,24,34,.06);
        vertical-align: top;
        color: var(--ink-2);
        background: transparent;
      }

      .doc tr:last-child td {
        border-bottom: none;
      }

      .doc tr:nth-child(even) td {
        background: rgba(20,24,34,.012);
      }

      .art-note {
        background: rgba(91,120,239,.055);
        color: var(--ink-2);
        border-radius: 12px;
        padding: 11px 13px;
        font-size: 12.5px;
        margin-top: 14px;
        line-height: 1.58;
        border: 1px solid rgba(91,120,239,.10);
      }

      .editable {
        border-radius: 6px;
        transition: background .12s ease, box-shadow .12s ease;
        outline: none;
        min-width: 40px;
      }

      .editable:hover {
        background: rgba(91,120,239,.07);
      }

      .editable:focus {
        background: rgba(91,120,239,.09);
        box-shadow: 0 0 0 2px rgba(91,120,239,.18);
      }

      .doc pre {
        background: rgba(247,248,252,.88);
        border-radius: 12px;
        padding: 14px 16px;
        overflow-x: auto;
        margin: 0 0 16px;
        border: 1px solid rgba(20,24,34,.07);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.62);
      }

      .doc code {
        font-family: var(--font-mono);
        font-size: 12.25px;
        line-height: 1.72;
        color: #2F3443;
      }

      .doc p code,
      .doc li code,
      .doc td code {
        display: inline-block;
        padding: 1px 5px;
        border-radius: 6px;
        background: rgba(20,24,34,.05);
        border: 1px solid rgba(20,24,34,.06);
        font-size: 11.75px;
        line-height: 1.45;
      }

      .doc .k { color: #5F59CF; font-weight: 600; }
      .doc .s { color: #1E8A61; }
      .doc .c { color: #8A8FA3; font-style: italic; }
      .doc .f { color: #2D67C8; }
    `}</style>
  );
}