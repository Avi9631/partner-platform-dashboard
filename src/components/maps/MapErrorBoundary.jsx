/**
 * Map Error Boundary Component
 * Catches errors in map components and displays user-friendly fallback
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 border-2 border-destructive/50 bg-destructive/5">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Map Component Error</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || 'An error occurred while loading the map'}
              </p>
              {this.props.showDetails && (
                <details className="text-xs text-left bg-muted p-3 rounded mb-4">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details
                  </summary>
                  <pre className="overflow-auto">
                    {this.state.error?.stack || 'No stack trace available'}
                  </pre>
                </details>
              )}
            </div>
            <Button onClick={this.handleReset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
