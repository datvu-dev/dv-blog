// public/js/features/project/project-list/container/project-list-page.js

import React from 'react';
import PageTitle from '../../utilities/page-title';
import AddLink from '../../utilities/add-link';
import ProjectList from '../presentation/project-list';

const ProjectListPage = React.createClass({
  loadProjects() {
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState({data: data});
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
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: []};
  },
  componentDidMount() {
    this.loadProjects();
  },
  render() {
    return (
      <div>
        <PageTitle text="Projects" />
        <AddLink path={'/project/new'} isModal={false} />
        <ProjectList data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

ProjectListPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default ProjectListPage;
