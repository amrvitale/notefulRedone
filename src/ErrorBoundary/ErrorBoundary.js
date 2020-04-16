import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-element">
          <h2>Could not display this content. Something has gone terribly wrong!</h2>
          <h4>Please refresh the page</h4>
        </div>
      );
    }
    return this.props.children;
  }  
}