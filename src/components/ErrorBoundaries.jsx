import React from "react";
import { Alert, Accordion, Card, Button } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px" }}>
          <Alert variant="danger">
            <Alert.Heading>Something went wrong.</Alert.Heading>
            <p>{this.state.error && this.state.error.toString()}</p>
          </Alert>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  View Error Details
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {this.state.errorInfo &&
                      this.state.errorInfo.componentStack}
                  </pre>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
