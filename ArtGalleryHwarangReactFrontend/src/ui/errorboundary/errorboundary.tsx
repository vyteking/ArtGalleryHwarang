import React from 'react';
import { useLang } from '../../locale/localetextgetter';
import './errorboundary.css';

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
}

class ErrorBoundaryCore extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        if (import.meta.env.DEV) {
            console.error(error, info);
        }
    }

    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

export function PageErrorFallback() {
    const lang = useLang('systemerror');
    return (
        <div className="page-error-fallback">
            <p className="page-error-fallback__text">{lang?.error ?? 'An error occurred.'}</p>
        </div>
    );
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
    return (
        <ErrorBoundaryCore fallback={fallback}>
            {children}
        </ErrorBoundaryCore>
    );
}
