var SkillForm = React.createClass({
  getInitialState: function() {
    return {
      skill : ''
    };
  },
  handleSkillChange: function(e) {
    this.setState({skill: e.target.value});
  },
  handleValidation: function(e) {
    e.preventDefault();
    var skill = this.state.skill.trim();

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!skill) {
      $('#skillName').addClass('required');
      $('#form-message').show();

      this.setState({formMessage: 'Please provide skill.'});
    } else {
      $('#skillName').val('');
      this.setState({skill: ''});

      this.handleSubmit({
        skill: skill
      });
    }
  },
  handleSubmit: function(item) {
    $.ajax({
      url: '/api/resume/skill',
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(items) {
        this.context.router.push('/resume');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div id="skill-form" className="">
          <p id="form-message">{this.state.formMessage}</p>
          <form encType="multipart/form-data" onSubmit={this.handleValidation}>
            <fieldset className="form-group">
              <label htmlFor="skillName">Add skill</label>
              <input type="text" className="form-control" id="skillName" value={this.state.skill} onChange={this.handleSkillChange} />
            </fieldset>
          </form>
      </div>
    );
  }
});

SkillForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}
