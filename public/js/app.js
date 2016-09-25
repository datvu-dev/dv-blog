// public/js/app-wrapper.js

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, IndexLink, Link, browserHistory} from 'react-router';
import Modal from './components/utilities/modal';
import Home from './components/home/home';
import ResumePage from './components/resume/resume-page';
import QualificationForm from './components/qualification/presentation/qualification-form';
import ProjectListPage from './components/project-list/container/project-list-page';
import ProjectFormPage from './components/project-form/container/project-form-page';
import ProjectViewPage from './components/project-view/container/project-view-page';

const App = React.createClass({
  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  },
  componentDidMount() {
    $.ajax({
      url: '/api/checkauthentication',
      dataType: 'json',
      cache: false,
      success: authenticated => {
        if (authenticated) {
          localStorage.setItem('user', 'datvu');
        }
        else {
          localStorage.removeItem('user');
        }

      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  },
  toggleNav() {
    let nav = $('#topnav');

    nav.toggleClass('open');
  },
  render() {
    let {location} = this.props;
    let isModal = (location.state && location.state.modal &&
      this.previousChildren);

    return (
      <div>
        <header>
          <ul className="topnav" id="topnav">
            <li><Link to="/"><img id="logo" src="/img/logo.png" /></Link></li>
            <li><Link to="/#" className="link">About me</Link></li>
            <li><Link to="/resume" className="link">Resume</Link></li>
            <li><Link to="/projects" className="link">Projects</Link></li>
            <li><Link to="/#" className="link">Contact</Link></li>
            <li className="icon">
              <a href="javascript:void(0)" className="bars" onClick={this.toggleNav}>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </a>
            </li>
          </ul>
        </header>
        <div id="content">
          {isModal ? this.previousChildren : this.props.children}
          {isModal && (
            <Modal isOpen={true} returnTo={location.state.returnTo}>
              {this.props.children}
            </Modal>
          )}
        </div>
        <footer>
        </footer>
      </div>
    );
  }
});

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="resume" url="/api/resume/" component={ResumePage} />
      <Route path="resume/qualification/add" url="/api/resume/qualification" component={QualificationForm} />
      <Route path="resume/qualification/edit/:id" url="/api/resume/qualification" component={QualificationForm} />
      <Route path="projects" url="/api/projects/" component={ProjectListPage} />
      <Route path="project/new" url="/api/projects/" component={ProjectFormPage} />
      <Route path="project/:id" url="/api/projects/" component={ProjectViewPage} />
      <Route path="project/:id/edit" url="/api/projects/" component={ProjectFormPage} />
    </Route>
  </Router>,
  document.getElementById('main')
);
