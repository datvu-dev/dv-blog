// public/js/features/project/project-view/container/project-view-page.js

import React from 'react';
import Project from '../presentation/project';

const ProjectViewPage = React.createClass({
  loadProject() {
    let {id} = this.props.params;

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState({data: data[0]});
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  handleDelete(id) {
    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: data => {
        this.context.router.push('/projects');
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: {}};
  },
  componentWillMount() {
    this.loadProject();
  },
  render() {
    return (
      <div>
        <Project data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default ProjectViewPage;
