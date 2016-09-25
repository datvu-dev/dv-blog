// public/js/pages/resume.js

import React from 'react';
import PageTitle from '../utilities/page-title';
import Qualifications from '../qualification/container/qualifications';
import Skills from '../skill/container/skills';

const ResumePage = React.createClass({
  render() {
    return (
      <div>
        <PageTitle text="Resume" />
        <Qualifications />
        <Skills />
      </div>
    );
  }
});

export default ResumePage;
