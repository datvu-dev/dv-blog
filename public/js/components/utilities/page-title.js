import React from 'react';

const PageTitle = React.createClass({
  render() {
    return (
      <div className="title">
        <h1>{this.props.text}</h1>
      </div>
   );
  }
});

export default PageTitle;
