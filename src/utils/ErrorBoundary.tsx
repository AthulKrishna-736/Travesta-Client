import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;

    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error: ', error, errorInfo);
        this.setState({
            hasError: true,
            error,
            errorInfo,
        })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen text-center">
                    <div>
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <details>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo?.componentStack}
                        </details>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}