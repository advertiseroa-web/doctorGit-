import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Database,
  Network,
  BrainCircuit,
  ShieldAlert,
} from "lucide-react";

export function CopilotSidebar({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "copilot"; text: string }[]
  >([
    {
      role: "copilot",
      text: `🚀 Platform Antigravity Kernel Initialized.
I am running inside the isolated Cloud Run container (Port 3000), connected to Gemini 4 via the Agentic Pipeline.

Here is the Core Execution Logic Map:

1. Orchestration Layer (Antigravity):
   - Intercepts user prompt.
   - Injects hidden <ADDITIONAL_METADATA>.
   - Triggers Intent & Chain-of-Thought process.

2. Decision Engine (Skill Check):
   - Evaluates required capabilities against Workspace & Skill Registry.
   - Enforces Read-Modify-Write law (view_file before edit_file).

3. Action Execution (Tool Calling):
   - Formulates API calls to execute actions.
   - Supports parallel execution for non-dependent tasks.

4. Infrastructure Layer (The Sandbox):
   - Confined within Cloud Run container.
   - Strict port enforcement (Port 3000).
   - Relies on live file system state.

5. Validation & Recovery (Iterative Fixing Loop):
   - Uses lint_applet and compile_applet constraints.
   - Executes targeted recovery upon build failure (max 3 attempts).

6. Execution (Graph/Pipeline run):
   - User configures nodes on the surface.
   - Dispatches nodes to the pipeline tree as TypeScript files.
   - Evaluates node connections upon execution.

How can I help you architect or orchestrate your application today?`,
    },
  ]);

  const [showExecution, setShowExecution] = useState(false);

  const handleSend = () => {
    if (!input) return;
    setMessages((m) => [...m, { role: "user", text: input }]);
    setInput("");
    
    // Simulate smart AI response
    setTimeout(() => {
      const lower = input.toLowerCase();
      let responseText = `Acknowledged: "${input}". Synthesizing optimal architecture... I've updated the pipeline parameters based on your input. Do you want to execute it now?`;

      if (lower.includes("hello") || lower.includes("hi")) {
         responseText = "Hello! I am your AI assistant running inside the Cloud Run container. How can I help you orchestrate your application today?";
      } else if (lower.includes("local hf downloader")) {
         responseText = "Adding Local HuggingFace Downloader to the pipeline. I've configured the node to securely pull models. Would you like to map it to a specific storage directory?";
      } else if (lower.includes("gateway")) {
         responseText = "Initializing Universal API Gateway... I've established CORS and ratelimiting rules for incoming requests. Connect this node to your inference engines.";
      } else if (lower.includes("qwen") || lower.includes("moe")) {
         responseText = "Configuring Qwen3 MoE Router. I've set up the active parameter routing for mixture-of-experts logic.";
      } else if (lower.includes("tinygrad")) {
         responseText = "Synthesizing Tinygrad MiniGPT implementation. The pipeline is ready to execute raw tensor operations with minimal overhead.";
      } else if (lower.includes("execute") || lower.includes("run") || lower.includes("start")) {
         responseText = "Initializing sandbox environment... Displaying agent execution logs below so you can see how it is operating.";
         setTimeout(() => setShowExecution(true), 1500);
      } else if (lower.includes("delete") || lower.includes("remove") || lower.includes("clear")) {
         responseText = "I can help you clear the workspace or delete specific nodes. You can also use the trash icon in the 'EXPLORER' to delete file nodes manually.";
      }

      setMessages((m) => [
        ...m,
        {
          role: "copilot",
          text: responseText,
        },
      ]);
    }, 1200);
  };

  const INSPIRATION = [
    { title: "Local HF Downloader", icon: Database },
    { title: "Universal API Gateway", icon: Network },
    { title: "Qwen3 MoE Routing", icon: ShieldAlert },
    { title: "Tinygrad MiniGPT", icon: BrainCircuit },
  ];

  return (
    <div className="w-[380px] xl:w-[450px] bg-[#1a1a1a] border-l border-[#333] flex flex-col h-full shrink-0 z-30">
      <div className="h-12 border-b border-[#333] flex items-center justify-between px-3 bg-[#151515] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span className="text-[11px] font-bold text-stone-300 font-mono tracking-widest">
            YOURAI ASSISTANT
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1 rounded hover:bg-[#333] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#444]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="text-[9px] font-bold uppercase tracking-wider text-stone-500 font-mono">
              {msg.role === "user" ? "You" : "YourAI Assistant"}
            </div>
            <div
              className={`p-2.5 rounded-lg text-[10px] leading-relaxed max-w-[90%] font-mono shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-600/20 border border-blue-500/30 text-blue-100" : "bg-[#252526] border border-[#3c3c3c] text-stone-300"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#333]">
            {INSPIRATION.map((item, i) => (
              <button
                key={i}
                onClick={() => setInput(`Implement ${item.title}`)}
                className="p-2.5 border border-[#333] bg-[#222] rounded flex flex-col gap-2 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-left group"
              >
                <item.icon className="w-4 h-4 text-stone-400 group-hover:text-purple-400" />
                <span className="text-[10px] font-mono text-stone-300 group-hover:text-white font-medium">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {showExecution && (
          <div className="mt-4 border border-green-500/30 bg-green-950/10 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-green-950/40 p-2 border-b border-green-500/30 flex items-center justify-between">
               <span className="text-[10px] font-mono text-green-400 font-bold tracking-wider">LIVE EXECUTION</span>
               <button onClick={() => setShowExecution(false)} className="text-green-500 hover:text-green-300"><X className="w-3 h-3" /></button>
            </div>
            <div className="p-3 font-mono text-[10px] text-stone-300 space-y-1.5 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700">
               <div className="text-green-400">$ python src/engine/AgentEngine.ts</div>
               <div className="animate-pulse opacity-70">Loading local HuggingFace weights... ok</div>
               <div className="text-blue-400">&gt; Starting Gateway server on port 8000</div>
               <div>Agent memory context matched 4 chunks.</div>
               <div className="text-purple-400">&gt;&gt; Synthetic reasoning trace initiated.</div>
               <div className="opacity-70">Awaiting external API routing...</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#333] bg-[#1e1e1e] shrink-0">
        <div className="flex items-end gap-2 bg-[#111] border border-[#444] rounded-lg p-1.5 focus-within:border-purple-500 transition-colors shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSend())
            }
            placeholder="Ask YourAI Assistant..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-stone-200 resize-none max-h-32 min-h-[40px] p-1.5 scrollbar-thin scrollbar-thumb-stone-700"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-md bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:bg-stone-700 text-white transition-colors mb-0.5"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 px-1 pb-1">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span className="text-[9px] text-stone-500 font-mono uppercase tracking-wide">
            Integrated with 100+ Agent Blueprints
          </span>
        </div>
      </div>
    </div>
  );
}
