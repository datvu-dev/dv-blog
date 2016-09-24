// public/js/features/resume/qualification/presentation/qualification-list.js

import React from 'react';
import QualificationItem from './qualification-item';

const QualificationList = React.createClass({
  render() {
    let qualificationItems = this.props.data.map(item => {
      return (
        <QualificationItem school={item.school} course={item.course}
        id={item._id} key={item._id} onDelete={this.props.onDelete} />
      );
    });

    return (
      <div>
        {qualificationItems}
      </div>
    );
  }
});

export default QualificationList;
