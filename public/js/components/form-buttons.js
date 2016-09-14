var FormButtons = React.createClass({
  cancel() {
    window.history.back();;
  },
  render() {
    return (
      <div className="text-right">
        <button type="button" className="btn btn-default" onClick={this.cancel}>Cancel</button>
        <button type="submit" className="btn btn-main" onClick={this.submit}>Save</button>
      </div>
    )
  }
});
