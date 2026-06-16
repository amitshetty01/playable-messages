"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { error: Error | null };

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-5xl">💫</span>
          <p className="text-lg font-bold text-white/80">Something flickered. Try again?</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white/80 backdrop-blur-md transition hover:bg-white/20"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
