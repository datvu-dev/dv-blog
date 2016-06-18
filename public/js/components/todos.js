// js/scripts.js
var TodoBox = React.createClass({
  loadToDoList: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function(item) {
    var items = this.state.data;
    var newItems = items.concat([item]);
    this.setState({data: newItems});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoDelete: function(id) {
    // var items = this.state.data;
    // var newItems = items.concat([item]);
    // this.setState({data: newItems});
    $.ajax({
      url: '/api/todos/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: item,
      success: function(data) {
        // this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadToDoList();
    setInterval(this.loadToDoList, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="container">
        <Banner data={this.state.data} />
        <TodoList onTodoDelete={this.handleTodoDelete} data={this.state.data} />
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
});

var Banner = React.createClass({
  render: function() {
    return (
      <div className="jumbotron text-center">
          <h1>I am a Todo-aholic <span className="label label-info">{this.props.data.length}</span></h1>
      </div>
    )
  }
});

var TodoList = React.createClass({
  render: function() {
    var todoItems = this.props.data.map(function(item) {
      return (
        <TodoItem text={item.text} id={item._id} key={item._id} />
      );
    });

    return (
      <div id="todo-list" className="row">
          <div className="col-sm-4 col-sm-offset-4">
              {todoItems}
          </div>
      </div>
    )
  }
});

var TodoItem = React.createClass({
  handleComplete: function() {
    $.ajax({
      url: '/api/todos/' + this.props.id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        // this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="checkbox">
          <label>
              <input type="checkbox" onChange={this.handleComplete} /> {this.props.text}
          </label>
      </div>
    )
  }
});

var TodoForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onTodoSubmit({text: text});
    this.setState({text: ''});
  },
  render: function() {
    return (
      <div id="todo-form" className="row">
          <div className="col-sm-8 col-sm-offset-2 text-center">
              <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                      <input type="text" className="form-control input-lg text-center" placeholder="I want to buy a puppy that will love me forever" value={this.state.text} onChange={this.handleTextChange}/>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg">Add</button>
              </form>
          </div>
      </div>
    )
  }
});

ReactDOM.render(
  <TodoBox url="/api/todos" pollInterval={2000} />,
  document.getElementById('main-content')
);
