import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0D1424] border border-rose-500/30 p-6 rounded-2xl text-center space-y-3 my-4">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="font-extrabold text-base text-white">
            {this.props.fallbackTitle || 'A module experienced an unexpected issue'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {this.state.error?.message || 'The component caught a runtime rendering exception. You can refresh or reload the widget.'}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
