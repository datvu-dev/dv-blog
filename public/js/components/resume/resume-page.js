// public/js/pages/resume.js

import React from 'react';
import Qualifications from '../qualification/container/qualifications';
import Skills from '../skill/container/skills';

const ResumePage = React.createClass({
  render() {
    return (
      <div>
        <Qualifications />
        <Skills />
      </div>
    );
  }
});

export default ResumePage;
