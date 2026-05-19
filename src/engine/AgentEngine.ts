export type LogLevel = 'info' | 'warning' | 'critical' | 'action' | 'success';

export interface LogEntry {
  id: string;
  source: 'Master' | 'Forensic-X' | 'Network-Watcher' | 'Antigravity';
  message: string;
  timestamp: string;
  type: LogLevel;
}

export interface WikiNode {
  id: string;
  tag: string;
  data: string;
  timestamp: string;
}

type EventCallback = (...args: any[]) => void;

class SimpleEventEmitter {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  removeListener(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(...args));
  }
}

export class NeuralForensicOS extends SimpleEventEmitter {
  private isEmergencyStop = false;
  private isNeuralPaused = false;
  private isShieldActive = false;
  private wikiNodes: Map<string, WikiNode> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private executionQueue: string[] = [];

  constructor() {
    super();
  }

  public boot() {
    this.emitLog('Antigravity', 'Booting Neural OS...', 'info');
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isEmergencyStop || this.isNeuralPaused) return;
      
      const cpuUsage = Math.random() * 100;
      if (cpuUsage > 92) {
        this.emitLog('Master', 'WARNING: Unusual Activity Detected! High CPU.', 'warning');
        if (cpuUsage > 98) {
          this.triggerEmergencyBrake('High Resource Usage Exceeded Critical Threshold');
        }
      }
      this.emit('heartbeat', { cpu: cpuUsage.toFixed(1), status: 'Stable' });
    }, 5000);
  }

  public triggerEmergencyBrake(reason: string) {
    if (this.isEmergencyStop) return;
    this.isEmergencyStop = true;
    this.emitLog('Antigravity', `EMERGENCY BRAKE ACTIVATED: ${reason}`, 'critical');
    this.emitLog('Antigravity', 'All Sandboxes Terminated. System Locked.', 'critical');
    
    this.addWikiNode('#SystemLockdown', JSON.stringify({ reason, time: Date.now() }));
    this.emit('statusUpdate', { locked: true });
    
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
  }

  public toggleNeuralFlow(pause: boolean) {
    this.isNeuralPaused = pause;
    if (pause) {
      this.emitLog('Master', 'Neural flow paused by operator.', 'warning');
    } else {
      this.emitLog('Master', 'Neural flow resumed.', 'success');
    }
  }

  public toggleShieldMode(active: boolean) {
    this.isShieldActive = active;
    if (active) {
      this.emitLog('Antigravity', 'SHIELD MODE ACTIVE: Wiki is now Read-Only.', 'warning');
    } else {
      this.emitLog('Antigravity', 'SHIELD MODE DEACTIVATED: Wiki updates enabled.', 'success');
    }
  }

  public rewindWiki() {
    if (this.isShieldActive) {
       this.emitLog('Master', 'Cannot rewind Wiki while Shield Mode is active.', 'warning');
       return;
    }
    this.wikiNodes.clear();
    this.emitLog('Master', 'Wiki Rewound. Last knowledge session purged.', 'action');
    this.emit('wikiUpdate', Array.from(this.wikiNodes.values()));
  }

  private emitLog(source: LogEntry['source'], message: string, type: LogEntry['type']) {
    const log: LogEntry = {
      id: Math.random().toString(36).substring(7),
      source,
      message,
      timestamp: new Date().toISOString(),
      type
    };
    this.emit('log', log);
  }

  private addWikiNode(tag: string, data: string) {
    if (this.isShieldActive) {
      this.emitLog('Master', `Wiki update blocked by Shield Mode for tag: ${tag}`, 'warning');
      return;
    }

    const node: WikiNode = {
      id: Math.random().toString(36).substring(7),
      tag,
      data,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8)
    };
    this.wikiNodes.set(tag, node);
    this.emit('wikiUpdate', Array.from(this.wikiNodes.values()));
  }

  public async runForensic(payload: string) {
    if (this.isEmergencyStop) {
      this.emitLog('Master', 'Ignored: System is locked.', 'warning');
      return;
    }
    if (this.isNeuralPaused) {
      this.emitLog('Master', 'Ignored: Neural flow is paused.', 'warning');
      return;
    }

    this.emitLog('Master', `Objective Received: Analyze payload (${payload})`, 'info');
    
    // Simulate Special Agent checking
    setTimeout(() => {
      if (this.isEmergencyStop) return;
      this.emitLog('Master', 'Scanning Dynamic Wiki for precedent patterns...', 'action');
      
      setTimeout(() => {
        if (this.isEmergencyStop) return;
        if (this.wikiNodes.has('#PayloadX99')) {
             this.emitLog('Master', 'Result: Match found. Fast-tracking execution.', 'success');
        } else {
             this.emitLog('Master', 'Result: No exact match. Activating Special Agents.', 'warning');
        }
        
        // Simulate Sandbox execution
        setTimeout(() => {
          if (this.isEmergencyStop) return;
          this.emitLog('Antigravity', 'Allocating isolated Docker sandbox for forensic execution...', 'info');
          
          setTimeout(() => {
             if (this.isEmergencyStop) return;
             this.emitLog('Forensic-X', 'CRITICAL: Unauthorized read access to /etc/passwd detected in payload.', 'critical');
             this.addWikiNode('#FileAccess_EtcPasswd', 'Suspicious system call in payload');
             
             this.emitLog('Antigravity', 'Terminating container layer and rolling back state', 'success');
             this.emitLog('Master', 'SIMULATION COMPLETE. New knowledge nodes crystallized in AppBase vault.', 'success');
          }, 1500);
          
        }, 1000);
        
      }, 1000);
      
    }, 500);
  }
}

// Export a singleton instance for the app
export const globalEngine = new NeuralForensicOS();
