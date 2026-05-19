import React, { useState, useMemo, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { rust } from '@codemirror/lang-rust';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { vim } from '@replit/codemirror-vim';

import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import { tokyoNightInit } from '@uiw/codemirror-theme-tokyo-night';
import { nordInit } from '@uiw/codemirror-theme-nord';
import { githubDarkInit } from '@uiw/codemirror-theme-github';
import { auraInit } from '@uiw/codemirror-theme-aura';
import { atomoneInit } from '@uiw/codemirror-theme-atomone';
import { copilotInit } from '@uiw/codemirror-theme-copilot';
import { xcodeDarkInit } from '@uiw/codemirror-theme-xcode';
import { Sparkles, Command, ChevronDown } from 'lucide-react';

const THEMES = [
  { id: 'vscode', label: 'VS Code' },
  { id: 'tokyo', label: 'Tokyo Night' },
  { id: 'nord', label: 'Nord' },
  { id: 'github', label: 'GitHub' },
  { id: 'aura', label: 'Aura' },
  { id: 'atomone', label: 'Atom One' },
  { id: 'copilot', label: 'Copilot' },
  { id: 'xcode', label: 'Xcode' },
];

export function CodeMirrorBridge({ filename, initialCode, onChangeCode }: { filename: string, initialCode: string, onChangeCode?: (val: string) => void }) {
  const [value, setValue] = useState(initialCode);
  const [themeName, setThemeName] = useState('copilot');
  const [vimMode, setVimMode] = useState(false);
  const [showAiDiff, setShowAiDiff] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialCode);
  }, [filename, initialCode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const determineLanguageExtension = (name: string) => {
    if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.jsx')) {
      return javascript({ jsx: true, typescript: name.includes('ts') });
    }
    if (name.endsWith('.rs')) return rust();
    if (name.endsWith('.py')) return python();
    if (name.endsWith('.html')) return html();
    if (name.endsWith('.css')) return css();
    if (name.endsWith('.json')) return json();
    if (name.endsWith('.md')) return markdown();
    return javascript({ jsx: true });
  }

  const activeTheme = useMemo(() => {
    switch(themeName) {
      case 'tokyo': return tokyoNightInit();
      case 'nord': return nordInit();
      case 'github': return githubDarkInit();
      case 'aura': return auraInit();
      case 'atomone': return atomoneInit();
      case 'copilot': return copilotInit();
      case 'xcode': return xcodeDarkInit();
      case 'vscode':
      default: return vscodeDarkInit();
    }
  }, [themeName]);

  const extensions: any[] = [determineLanguageExtension(filename)];
  if (vimMode) extensions.push(vim());

  const handleAiAutocomplete = () => {
    // Mock inline AI autocomplete logic
    setShowAiDiff(true);
    setTimeout(() => {
      setValue(prev => prev + '\n\n  // AI suggested code:\n  console.log("Synthesized by AI Canvas Kernel");');
      setShowAiDiff(false);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col relative w-full">
      <div className="bg-[#181818] border-b border-[#2d2d2d] py-1.5 px-4 shadow-sm flex items-center justify-between shrink-0">
        <span className="text-xs font-mono text-[#8b8b8b] flex items-center gap-2">
          {filename} {vimMode && <span className="px-1.5 py-0.5 bg-green-900/40 text-green-400 rounded text-[10px] uppercase font-bold">Vim</span>}
        </span>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAiAutocomplete}
            className="text-[10px] flex items-center gap-1 font-mono uppercase bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors"
          >
            {showAiDiff ? <span className="animate-pulse">Reasoning...</span> : <><Sparkles className="w-3 h-3" /> Inline Assist</>}
          </button>
          <div className="flex items-center gap-2 border-l border-[#333] pl-3 relative" ref={themeMenuRef}>
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1 text-[10px] text-stone-400 font-mono outline-none cursor-pointer hover:text-stone-200"
            >
              {THEMES.find(t => t.id === themeName)?.label || 'Theme'} <ChevronDown className="w-3 h-3" />
            </button>
            
            {showThemeMenu && (
              <div className="absolute top-full right-8 mt-2 w-32 bg-[#252526] border border-[#3c3c3c] rounded-md shadow-xl z-50 py-1">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => { setThemeName(theme.id); setShowThemeMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[10px] font-mono hover:bg-[#333] ${themeName === theme.id ? 'text-blue-400 bg-[#2a2d3e]' : 'text-stone-300'}`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={() => setVimMode(!vimMode)}
              className={`p-1 rounded ${vimMode ? 'bg-[#333] text-stone-200' : 'text-stone-500 hover:text-stone-300'}`}
              title="Toggle Vim Mode"
            >
              <Command className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#1e1e1e] relative">
        {showAiDiff && (
           <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse z-10" />
        )}
        <CodeMirror
          value={value}
          height="100%"
          theme={activeTheme}
          extensions={extensions}
          onChange={(val) => {
            setValue(val);
            onChangeCode?.(val);
          }}
          className="text-sm border-none outline-none font-mono h-full flex-1"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
}
