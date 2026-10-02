import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { Storage } from '../utils/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    Storage.resetAllData();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-4 font-sans selection:bg-[#D32F2F]">
          <div className="max-w-md w-full bg-[#171717] border border-neutral-800 rounded-2xl p-6 text-center shadow-2xl space-y-5">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-[#D32F2F] rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Exam Command Center</h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The application encountered an unexpected initialization error. Your data can be restored or reloaded safely below.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-left">
                <p className="text-[11px] font-mono text-red-400 break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Corrupted Cache & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
