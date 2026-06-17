import React from "react";

import FallbackUI
from "./FallbackUI";

class ErrorBoundary
extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error,
    errorInfo
  ) {
    console.log(error);

    console.log(errorInfo);
  }

  render() {

    if (
      this.state.hasError
    ) {
      return (
        <FallbackUI />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;