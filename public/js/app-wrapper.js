// app-render.js

var {Router, Route, IndexRoute, IndexLink, Link} = ReactRouter;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/resume">Resume</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/todos">To-do List</Link>
          </nav>
        </header>
        <div id="main-content">{this.props.children}</div>
        <footer>
        </footer>
      </div>
    );
  }
});

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="todos" url="/api/todos" component={TodoBox} />
    </Route>
  </Router>,
  document.getElementById('container')
);
