'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PayloadViewerProps {
  payload: Record<string, unknown>;
  title?: string;
}

function JsonNode({ value, depth = 0 }: { value: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 1);

  if (value === null) return <span className="text-zinc-500">null</span>;
  if (typeof value === 'boolean') return <span className="text-violet-400">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-blue-400">{value}</span>;
  if (typeof value === 'string') return <span className="text-emerald-400">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-zinc-500">[]</span>;
    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-0.5 text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />}
          <span className="text-zinc-500">[</span>
          {collapsed && <span className="text-zinc-500 text-xs ml-0.5">{value.length} items</span>}
        </button>
        {!collapsed && (
          <span>
            {value.map((item, i) => (
              <div key={i} style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
                <JsonNode value={item} depth={depth + 1} />
                {i < value.length - 1 && <span className="text-zinc-600">,</span>}
              </div>
            ))}
            <span className="text-zinc-500">]</span>
          </span>
        )}
        {collapsed && <span className="text-zinc-500 ml-0.5">]</span>}
      </span>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-zinc-500">{'{}'}</span>;
    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-0.5 text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />}
          <span className="text-zinc-500">{'{'}</span>
          {collapsed && <span className="text-zinc-500 text-xs ml-0.5">{entries.length} keys</span>}
        </button>
        {!collapsed && (
          <span>
            {entries.map(([key, val], i) => (
              <div key={key} style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
                <span className="text-amber-300">"{key}"</span>
                <span className="text-zinc-500">: </span>
                <JsonNode value={val} depth={depth + 1} />
                {i < entries.length - 1 && <span className="text-zinc-600">,</span>}
              </div>
            ))}
            <span className="text-zinc-500">{'}'}</span>
          </span>
        )}
        {collapsed && <span className="text-zinc-500 ml-0.5">{'}'}</span>}
      </span>
    );
  }

  return <span>{String(value)}</span>;
}

export function PayloadViewer({ payload, title = 'Payload' }: PayloadViewerProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e1e] bg-[#111111]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-[#555555] ml-1 font-mono">{title}</span>
        </div>
        <button
          onClick={copy}
          className={cn(
            'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all',
            copied
              ? 'text-green-400 border-green-500/30 bg-green-500/10'
              : 'text-[#555555] border-[#222222] hover:text-white hover:border-[#333333]'
          )}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <JsonNode value={payload} depth={0} />
      </div>
    </div>
  );
}
