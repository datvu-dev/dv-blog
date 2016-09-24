// public/js/features/resume/skill/presentation/skill-item.js

import React from 'react';
import DeleteLink from '../../utilities/delete-link';
import confirmAction from  '../../utilities/confirm-dialog';

const SkillItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this skill?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    return (
      <span className="tag">
        {this.props.skill}
        <DeleteLink onDelete={this.deleteItem} linkText="X" linkClass="tag-remove" />
      </span>
    );
  }
});

export default SkillItem;
