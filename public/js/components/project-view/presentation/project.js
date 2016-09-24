// public/js/features/project/project-view/presentation/project.js

import React from 'react';
import EditLink from '../../utilities/edit-link';
import DeleteLink from '../../utilities/delete-link';
import confirmAction from  '../../utilities/confirm-dialog';

const Project = React.createClass({
  deleteProject() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.data._id);
    });
  },
  render() {
    let {_id, title, picture, description, technologies} = this.props.data;
    let picSrc = `/uploads/projects/${_id}/${picture}`;
    let tagItems;

    if (technologies) {
      let count = 0;
      tagItems = technologies.map(item => {
        return (
          <span key={item._id} className="tag">{item.text}</span>
        );
      });
    }

    return (
      <div>
        <h1>{title}</h1>
        <EditLink path={`/project/${_id}/edit`} isModal={false} />
        <DeleteLink onDelete={this.deleteProject} />
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});

export default Project;
