/** App-style icon tile: a brand logo (Simple Icons path) or a monogram. */
export function ToolTile({ tool, size = 64, className = '', ...rest }) {
  return (
    <span
      className={`grid place-items-center rounded-[1.1rem] border border-white/10 bg-gradient-to-b from-[#1f1f23] to-[#0d0d0f] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_-10px_rgba(0,0,0,0.8)] ${className}`}
      style={{ width: size, height: size }}
      title={tool.label}
      {...rest}
    >
      {tool.path ? (
        <svg viewBox="0 0 24 24" width={size * 0.46} height={size * 0.46} aria-hidden="true">
          <path d={tool.path} fill={tool.color} />
        </svg>
      ) : (
        <span className="text-[0.95rem] font-semibold text-lavender" aria-hidden="true">{tool.mono}</span>
      )}
      <span className="sr-only">{tool.label}</span>
    </span>
  );
}
