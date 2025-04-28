import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Uncaught error: ', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen text-center">
                    <div>
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-600">Please refresh the page or try again later.</p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}