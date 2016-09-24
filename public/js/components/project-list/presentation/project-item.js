// public/js/features/project/project-list/presentation/projects.js

import React from 'react';
import {Link} from 'react-router';
import EditLink from '../../utilities/edit-link';
import DeleteLink from '../../utilities/delete-link';
import confirmAction from  '../../utilities/confirm-dialog';

const ProjectItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    let {id, img} = this.props;

    return (
      <div className="box col-md-6 col-lg-4">
        <div className="box-img">
          <img src={`/uploads/projects/${id}/${img}`} alt="Card image cap" />
        </div>
        <div className="box-content">
          <h4 className="box-title">
            <Link to={`/project/${id}`}>{this.props.title}</Link>
          </h4>
          <p className="box-text">This is a longer card with supporting text
            below as a natural lead-in to additional content. This content is a
            little bit longer.</p>
          <EditLink path={`/project/${id}/edit`} isModal={false} />
          <DeleteLink onDelete={this.deleteItem} />
        </div>
      </div>
    )
  }
});

export default ProjectItem;
