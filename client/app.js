"use strict"

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, IndexRoute, IndexRedirect, Link } from 'react-router'
import path from 'path'
import ReactMarkdown from 'react-markdown'

function getLocation() {
  return window.location.pathname;
}

class Welcome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      category: '/',
      file: null,
      tag: null
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      category: nextProps.location.query.category,
      tag: nextProps.location.query.tag,
      file: nextProps.location.pathname.length > 1 ? nextProps.location.pathname : null
    });
  }

  render() {
    return (
      <div>
        <Categories category={this.state.category} file={this.state.file} />
        <Tags category={this.state.category} tag={this.state.tag} file={this.state.file} />
        <Notes category={this.state.category} tag={this.state.tag} file={this.state.file} />
        <Note file={this.state.file} />
      </div>
    );
  }
}

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
  }

  componentDidMount() {
    fetch('/api/categories').then((result) => result.json()).then((categories) => this.setState({
      categories: categories
    }));
  }

  renderCategories(categories) {
    var result = [];

    categories.forEach((category) => result.push(
      <li key={category.name}>
        <Link to={getLocation() + '?category=' + category.dir}>{category.name}</Link>
      <ul>{this.renderCategories(category.categories)}</ul>
      </li>));

    return result;
  }

  render() {
    return (<div><Link to={getLocation()}>All</Link>
        <ul>
        {this.renderCategories(this.state.categories)}</ul></div>);
  }
}

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.category) {
      return;
    }

    fetch('/api/tags/' + nextProps.category).then((result) => result.json()).then((tags) => this.setState({tags:tags}));
  }

  render() {
    return (<div>
      <ul>
        <li><Link to={getLocation() + (this.props.category ? '?category=' + this.props.category : '')}>All</Link></li>
      {this.state.tags.map((tag) => (
        <li key={tag}><Link to={getLocation() + '?tag=' + tag + (this.props.category ? '&category=' + this.props.category : '')}>{tag}</Link></li>
        ))}
      </ul></div>)
  }
}

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: []
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.category) {
      return;
    }

    fetch('/api/notes/' + nextProps.category + (nextProps.tag ? '?tag=' + nextProps.tag : '')).then((result) => result.json()).then((notes) => this.setState({notes:notes}));
  }

  getUrl(note) {
    return note.file + (this.props.tag ? '?tag=' + this.props.tag : '') + (this.props.category ? (this.props.tag ? '&' : '?') + 'category=' + this.props.category : '');
  }

  render() {
    var url = this.prop

    return (<ul>
      {this.state.notes.map((note) => (<li key={note.file}><Link to={this.getUrl(note)}>{note.basename}</Link></li>))}
      </ul>)
  }
}

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: null
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) {
      return;
    }

    fetch('/api/note' + nextProps.file).then((result) => result.json()).then((note) => this.setState({note:note}));
  }

  render() {
    if (!this.state.note) {
      return (<span />);
    }

    return (<div>
        <h1>{this.state.note.basename}</h1>
        <div><ReactMarkdown source={this.state.note.content} /></div>
      </div>)
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/*" component={Welcome} />
  </Router>,
  document.getElementById('app')
);


