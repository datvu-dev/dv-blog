// public/js/features/resume/skill/presentation/skill-list.js

import React from 'react';
import SkillItem from './skill-item';

const SkillList = React.createClass({
  render() {
    let skillItems = this.props.data.map(item => {
      return (
        <SkillItem skill={item.skill} id={item._id} key={item._id}
          onDelete={this.props.onDelete} />
      );
    });

    return (
      <div>
        {skillItems}
      </div>
    );
  }
});

export default SkillList;
