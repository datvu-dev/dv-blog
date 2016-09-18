// public/js/partials/skill-form.js

var SkillForm = React.createClass({
  getInitialState() {
    return {
      skill : ''
    };
  },
  handleSkillChange(e) {
    this.setState({skill: e.target.value});
  },
  handleValidation(e) {
    e.preventDefault();
    let {skill} = this.state;

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!skill.trim()) {
      $('#skillName').addClass('required').focus();
      $('#form-message').show();

      this.setState({formMessage: 'Please provide skill.'});
    } else {
      $('#skillName').val('');
      this.setState({skill: ''});

      this.handleSubmit({skill});
    }
  },
  handleSubmit(item) {
    $.ajax({
      url: '/api/resume/skill',
      dataType: 'json',
      type: 'POST',
      data: item,
      success: items => {
        this.context.router.push('/resume');
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  },
  render() {
    return (
      <div id="skill-form" className="">
          <p id="form-message">{this.state.formMessage}</p>
          <form encType="multipart/form-data" onSubmit={this.handleValidation}>
            <fieldset className="form-group">
              <label htmlFor="skillName">Add skill</label>
              <input type="text" className="form-control" id="skillName"
                value={this.state.skill} onChange={this.handleSkillChange} />
            </fieldset>
          </form>
      </div>
    );
  }
});

SkillForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}
