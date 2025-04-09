import React from "react";
import { Alert, Accordion, Card, Button } from "react-bootstrap";
import { IntlContext } from "../contexts/IntlContextProvider";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorLabel: null,
      errorDetails: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(errorLabel, errorDetails) {
    this.setState({
      errorLabel: errorLabel,
      errorDetails: errorDetails,
    });
  }

  render() {
    if (this.state.hasError) {
      const { lang } = this.context;
      return (
        <div style={{ padding: "20px" }}>
          <Alert variant="danger">
            <Alert.Heading>
              {lang["error.default_message"] || "Something went wrong."}
            </Alert.Heading>
            <p>{this.state.errorLabel && this.state.errorLabel.toString()}</p>
          </Alert>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion as={Button} variant="link" eventKey="0">
                  {lang["error.view_details"] || "View Error Details"}
                </Accordion>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {this.state.errorDetails &&
                      this.state.errorDetails.componentStack}
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

ErrorBoundary.contextType = IntlContext;

export default ErrorBoundary;
