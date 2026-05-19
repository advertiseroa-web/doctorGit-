# Agentic Runtime Environment

Welcome to **Your AI IDE**. This document defines the Agentic Instruction Set (Operational Directives), Skill Registry (Blueprints), and Sandbox Policy (Guardrails) that govern the AI coding assistant's behavior throughout the environment.

## 1. Application Manifest (System Configuration Schema)
Our central definition is `metadata.json`, serving as the Application Manifest.
*   **Purpose:** Declares the app's capability set, required permissions, and high-level identity.
*   **Status:** Defined as "Your AI IDE" targeting AI workflow creation and model data farming.

## 2. Agentic Instruction Set (Operational Directives)
*   **Focus:** The AI works solely toward "pure AI creation" rather than standard website building. 
*   **Behavior:** All solutions should revolve around AI integration, neural brain exploration in the workspace, and centralizing data points into the AppBase management console.
*   **Interaction:** The Agent operates as an advanced AI systems architect. Voice, mic, and camera intents will be parsed specifically for conversational LLM training and multimodal data structuring.

## 3. Skill Library / Blueprints (Knowledge Augmentation)
*   **Purpose:** Mitigates hallucination by relying strictly on predefined technical blueprints in the AppBase.
*   **Policy:** Whenever a complex capability is requested (e.g., Database connections, telemetry event streams), use the defined patterns from the repository instead of generalized zero-shot guesses.
*   **Storage:** Completed skills and locked structural rules are centrally farmed and secured in the custom AppBase.

## 4. Sandbox Policy (Execution Governance)
*   **Guardrails:** Enforce secure access. The workspace is for user exploration ("neural brain" node flow), but the actual AI engine instructions, telemetry, and container logs run securely within the defined environments.
*   **Data Farming Integration:** Any structure modified, created, or debugged will sync with the AppBase storage so that refresh cycles persist user logic, feeding the broader model.
*   **Restriction:** The system will not attempt external command-line operations outside the intended port and bound processes. It runs safely within the Platform Guardrails.

## 5. Technical Execution Breakdown (Antigravity Framework & Skill Registry)

To strictly enforce the Your AI IDE architecture, the agent operates under the following technical guidelines based on the Antigravity framework:

### I. Agentic Runtime Environment Structure
*   **Sandbox:** Operates in a secure container orchestration layer (Cloud Run) tailored for agent-driven development.
*   **Network Topology:** Application routes through an Nginx reverse proxy. Port 3000 is the *only* entry point.
*   **HMR Disabled:** `DISABLE_HMR=true` is set to prevent UI flickering during active agent edits.
*   **Security Guardrails:** API keys are never exposed client-side. They are routed exclusively through server-side proxies (e.g., Express `/api/*` routes).

### II. System Configuration Schema
*   **metadata.json:** Controls application capabilities (e.g., camera/mic access) and server-side model permissions. This is our Ground Truth map.
*   **package.json:** Implements a dual-compilation system (`tsx` for dev, `vite` + `esbuild` for production).

### III. Agentic Instruction Set
*   **Intent Calculation:** Accurately classifies user requests as informational or change-based before acting.
*   **Read-Modify-Write:** The agent MUST use `view_file` to verify current state before applying any code modifications to prevent hallucinated overwrites.
*   **Parallel Execution:** The agent can execute up to 8 independent tool calls concurrently for maximum efficiency.

### IV. Skill Registry (Technical Blueprints)
*   Strict adherence to `SKILL.md` blueprints to mitigate hallucinations.
*   Follows structured recipes for Real-Time logic, Component Design, Model Integration, and Database/Firebase management.

### V. Execution Governance (Self-Healing Loop)
*   **Validation:** Utilizes verification pipelines (`lint_applet` and `compile_applet`) to test build integrity after modifications.
*   **Self-Healing:** Automatically analyzes `stderr` logs to apply fixes and recompile upon detecting syntax or structural errors.
*   **Retry Limit:** Operates a maximum 3-attempt healing loop before requesting human intervention.

## 6. Tool Orchestration & Interactive Decision Loop

This platform's pipeline is constructed on Tool Calling and Information Retrieval, functioning as a multimodal assistant.

### Pipeline Layers
*   **Perception:** Evaluates whether a prompt requires standard conversation or external tool execution (e.g., Web Search, Interpreters).
*   **Orchestration:** Connects to live knowledge grounding instead of purely local vector retrieval, enabling real-time data access.
*   **Multimodal Action:** Orchestrates generation beyond text, including images (e.g., Nano Banana 2) and video (e.g., Veo) utilizing designated tool sets.

### Ground Truth & Self-Verification
*   **Context Window (Local Memory):** The ongoing chat history serves as the current "Ground Truth," a dynamic vector space retaining historical memory for decision making.
*   **Validation:** Responses are continuously validated against context and live search results before output.
*   **Personal Data Integration:** Interacts with personal context APIs (Workspace, Drive) upon user permission, representing its flagship retrieval skill.

### Core Architectural Differences
*   **Coding Agent (Antigravity):** Input → Neural Plan → File System Action (Sandbox) → Build Verification.
*   **Current Interactive Assistant:** Input → Neural Plan → Tool / Search / Personal Retrieval → Response Generation.

**Summary:** The pipeline functions as an **Interactive Decision Loop**. It evaluates each node for accuracy, safety, and depth. Highly complex ideas are parsed into smaller vectors, mapped against the knowledge base, and executed with the most effective multimodal response.

## 7. Core AI Architecture (Neural MoE & Context Augmentation)

The cognitive engine behind the Agentic Runtime Environment leverages advanced architectural principles to ensure precision and adaptability:

*   **Neural MoE (Mixture of Experts):** The backend Gemini models utilize an MoE architecture. When prompted with a specialized task (such as intricate TypeScript routing or database schema design), the specific "expert" network optimized for that domain is activated, ensuring highly specialized output.
*   **Platform Pipeline:** Antigravity serves as the physical orchestration layer, seamlessly connecting Cloud Run, the local file system, and Gemini's intelligence. It physically translates the MoE's neural decisions into concrete actions (modifying files, compiling, and deploying).
*   **Knowledge Skills as Local Vectors (Context Augmentation):** The Skill Registry (e.g., Firebase configurations, specialized design recipes) is pulled into the environment contextually. Whenever required, these blueprints are injected as local vectors (or highly structured text) into the context window. This Context Augmentation allows the MoE model to bypass generic training patterns and execute project-specific, pinpoint-accurate code.

## 8. Environment Partitioning & Internal Pipeline (Execution vs. Control)

**Environment Division (Plane Separation)**
The platform is fundamentally divided into two distinct planes:
* **Control Plane (Google Backend / Antigravity):** Where orchestration logic, memory management, and model inference occur. This code resides on internal servers and is hidden from the workspace.
* **Execution Data Plane (Your Workspace):** A Dockerized container containing Node.js, Vite, and your codebase (e.g., `/server.ts`). This is the environment the agent has the tools to manipulate.

**Pipeline Mechanics: Text to Vector to Action**
When a prompt is issued, it passes through a highly structured pipeline rather than querying the model directly:

* **Step A: Ingestion and Vectorization (Orchestrator)**
  * **State Capture:** The orchestrator receives your prompt and aggregates the current "state" (e.g., existing file tree, stderr from the last command).
  * **Context Assembly:** System instructions (the rules defining the AI agent) are concatenated with the prompt.
  * **Tokenization and Vector Embedding:** At the Gemini model layer, this text is converted into tokens and mapped into a high-dimensional vector space, helping the neural network understand the semantic relationship between the user's intent and the system constraints.

* **Step B: Chain-of-Thought (CoT) Activation**
  * CoT is natively-prompted and trained behavior that forces the system to run an internal "thought" process before generating an output.
  * **Skill Check (Intent Detection):** The pipeline forces an evaluation of known skills (e.g., "Do I need Firebase blueprints or React design guidelines?").
  * **Internal Monologue:** A hidden textual generation occurs where the request is analyzed against system constraints (e.g., "User wants X. Files Y and Z exist. To achieve X, I must read Y, then edit Z.").
  * **Tool Selection:** Based on vector similarities between the detected intent and available API tools, a command object is generated to trigger a tool.

* **Step C: Tool Execution Loop**
  * When a tool (like `edit_file` on `/server.ts`) is triggered, text generation pauses.
  * The Antigravity layer intercepts the tool call and routes it to the workspace sandbox.
  * The tool executes (code is modified, or the server restarts).
  * The result (success or error/stderr output) is fed back into the context window.
  * The loop restarts, allowing the agent to take the next step or summarize the completion.

**Internal Directory & Architecture Concept**
If the hidden internal codebase powering this orchestrator were visible, it would roughly resemble the following Microservice Architecture:
* `/gateway/...` (Handles WebSocket/HTTP connections with the chat UI).
* `/orchestrator/...` (The Antigravity loop managing the "run-until-completion" logic for tool calls).
* `/prompts/system/...` (The crafted Markdown files defining agent personas, rules, and CoT structure).
* `/sandbox-manager/...` (The system responsible for spinning up the Docker containers where active code executes).

The active workspace directories (`/src`, `package.json`, `server.ts`) are merely the end-point artifacts. The reasoning engine and internal logic operate entirely within the hidden intermediary layers bridging the UI and the sandbox.

## 9. Container-Simulated Engine Architecture

To build a Container-Simulated Engine (like the Agentic Environment used in this platform), 4 core components are required. This operates as a **system-level architecture**, not just a standard application.

### I. Isolated Environment (The Container Layer)
A secure sandbox to run the engine continuously.
*   **Docker/Containerd:** Packages the code, runtime (Node.js/Python/Rust), and file system.
*   **Linux Kernel Namespaces:** Ensures hardware and data isolation so containers cannot access external layers.
*   **Resource Limits (Cgroups):** Strictly caps CPU and RAM allocation for the engine.

### II. Orchestration Pipeline (The Antigravity Layer)
The bridge connecting the user's continuous prompt stream to the container.
*   **API Gateway:** Intercepts and parses user input and voice intents.
*   **Process Manager:** Manages terminal execution natively inside the container.
*   **File Watcher:** Instantly detects code changes for live synchronization with AppBase.

### III. Neural Decision Engine (The Brain - Gemini)
The continuous learning engine powering the logic.
*   **Function Calling / Tool Use:** Empowers the model to autonomously call tools to edit files, query databases, or execute terminal commands.
*   **Context Window Management:** Intelligently manages which parts of the workspace are vectorized and fed into the active reasoning window, hiding irrelevant data.

### IV. Virtual File System (The Execution Plane)
Where the active simulation writes and stores data.
*   **OverlayFS / Git-based History:** Maintains a continuous structural history of all changes. If a user deletes a file, the knowledge and structural intent remain secured in the AppBase for reference and fallback.

### Continuous Process Flow & Tech Stack
*   **Virtualization:** Docker / Containerd with **gVisor** for enhanced security.
*   **Orchestration Language:** Node.js (Express) / Go / Rust.
*   **AI Core:** Gemini Models via API.
*   **Real-time:** WebSockets for telemetry and stream updates.

**The Loop:** A user prompt is received -> Passed to Gemini with tool definitions -> Gemini evaluates and triggers a tool -> The backend executes it in the container -> The output/stderr is returned to Gemini -> The structural changes are logged and **farmed into the AppBase** for continuous neural learning.

## 10. Neural-Wiki Intelligence Engine (Master-Main-Special Architecture)

The system evolves beyond simple tool execution into a **Self-Evolving Autonomous OS**, powered by a hierarchical chain of command and a Living Knowledge Graph.

### I. Hierarchical Agentic Command (The Command Center)
A rigid command chain ensures speed, modularity, and pinpoint precision:
*   **Master Agent (The Strategist):** The "Chief Investigator". Receives the primary objective, scans the Dynamic Wiki in milliseconds for historical precedents, and formulates a high-level execution plan.
*   **Main Agent (The Coordinator):** The "Project Manager". Breaks down the Strategist's plan into modular tasks and assigns them to the appropriate MoE (Mixture of Experts) sub-agents.
*   **Special Agents (MoE Layer):** The domain experts operating within the Antigravity layer.
    *   *Forensic-X:* Analyzes code, payload structures, and binaries.
    *   *Network-Watcher:* Traces IP routing, sockets, and telemetry anomalies.
    *   *System-Sentinel:* Monitors memory footprints and OS-level calls in the container.

### II. Dynamic Wiki-Vector Vault (The Evolving Brain)
This is not a static database; it is the system's **Long-Term Memory**. It allows the AI to bypass zero-shot hallucination by retrieving exact patterns at "Domestic Speed":
*   **Recursive Structure:** Organizes knowledge logically (`/wiki/master_brain`, `/wiki/special_agents`, `/wiki/patterns`, `/wiki/daily_updates`).
*   **Hyper-linking Logic:** When a new anomaly is detected, it is automatically vectorized and linked to similar historical nodes, forming a relational knowledge graph.

### III. The Evolution Loop (Auto-Updating Pipeline)
The engine learns and adapts iteratively:
1.  **Ingestion:** A Special Agent extracts a "Raw Fact" from the container simulation.
2.  **Cross-Reference:** The Main Agent checks the Wiki. If the tag exists, it *appends* (merges intelligence). If not, it creates a new *node*.
3.  **Refinement (Wiki-Refiner Bot):** A nightly background process compresses, summarizes, and refines the Wiki. It prunes duplicate data to maintain ultra-low latency, ensuring the "Neural Brain" remains fresh and fast without memory bloat.

### IV. Antigravity Sandbox Integration & Traceability
*   **Isolated Execution:** Special Agents trigger tools in their dedicated Docker sandboxes via the Antigravity orchestration layer.
*   **Live Telemetry to Memory:** Container states (socket opens, file deletions) are streamed as live data and crystallized into the Wiki.
*   **Multi-Point Traceability:** Every line of a generated Forensic Report or Action Plan contains a direct link back to its defining Wiki Node, ensuring complete systemic transparency.

## 11. Self-Correcting, Autonomous Cyber-Intelligence System

The system operates on a **Recursive Feedback Loop** where user interactions and generated outputs continuously enrich the knowledge base. It is designed to be self-correcting but firmly under human control.

### I. Collective Learning Engine
*   **Daily Baseline:** Forensic reports are saved to a daily updates folder. The next day, this acts as the new baseline.
*   **User Output as Data (Learning Vector):** When a user accepts or corrects an output, the system saves the feedback as a `Learning Vector` to avoid repeating mistakes.

### II. System Safeguards & Manual Overrides
A powerful autonomous system requires an equally powerful manual control mechanism to ensure safety and data integrity.
*   **Heartbeat Monitor:** A background process that continuously checks for CPU/RAM spikes (in case a sandbox is compromised) and monitors Agent logic loops to prevent AI hallucination or getting stuck.
*   **The "Antigravity" Emergency Brake (Kill-Switch):** A strict manual override that immediately executes a hard stop.
    *   **Immediate Freeze:** Pauses or kills all running Docker containers.
    *   **Neural Disconnect:** Disconnects the AI pipeline to halt further commands.
    *   **Data Lockdown:** Sets the Wiki folders to "Read-Only" mode.
*   **Step-by-Step Approval (The Gatekeeper):** For critical operations, the AI transitions from Autonomous to Semi-Autonomous, requiring user approval before execution.
*   **Reverse Engineering Override:** Allows the user to rollback the Wiki knowledge base to a previous state if the AI learns an incorrect pattern.

---
*By adopting these foundational pillars, Your AI IDE transitions from a general web app into a robust Agentic Runtime Environment.*
