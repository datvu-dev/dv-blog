// public/js/components/year-dropdown.js

var YearsSelect = React.createClass({
  onSelectChange: function(e) {
    this.props.onSelectChange(e.target.value);
  },
  render: function() {
    var currentYear = new Date().getFullYear();
    var years = [];
    var startYear = 2010;

    while (startYear <= currentYear) {
      years.push(startYear++);
    }

    var yearItems = years.map(function(item) {
      return (
        <option key={item} value={item}>{item}</option>
      );
    });

    return (
      <select className="form-control" id="projectYear" value={this.props.value} onChange={this.onSelectChange}>
        <option value="" disabled="disabled"> -- Select year --</option>
        {yearItems}
      </select>
    )
  }
});
