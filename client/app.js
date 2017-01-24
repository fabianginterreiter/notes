"use strict"

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, IndexRoute, IndexRedirect, Link } from 'react-router'
import path from 'path'
import ReactMarkdown from 'react-markdown'

class Welcome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      category: '/',
      file: null
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
    fetch('/api/categories').then((result) => result.json()).then((categories) => this.setState({
      categories: categories
    }));
  }

  componentWillReceiveProps(nextProps) {
    var category = nextProps.location.pathname;

    if (category.endsWith('.md')) {
      category = path.dirname(category);
    }

    this.setState({
      category: category,
      tag: nextProps.location.query.tag,
      file: nextProps.location.query.file
    });
  }

  renderCategories(categories) {
    var result = [];

    categories.forEach((category) => result.push(
      <li key={category.name}>
        <Link to={category.dir}>{category.name}</Link>
      <ul>{this.renderCategories(category.categories)}</ul>
      </li>));

    return result;
  }

  render() {
    return (
      <div>
        <Link to={'/' + (this.state.file ? '?file=' + this.state.file : '') }>All</Link>
        <ul>
        {this.renderCategories(this.state.categories)}</ul>
        <Tags category={this.state.category} tag={this.state.tag} file={this.state.file} />
        <Notes category={this.state.category} tag={this.state.tag} file={this.state.file} />
        <Note file={this.state.file} />
      </div>
    );
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
    fetch('/api/tags' + nextProps.category).then((result) => result.json()).then((tags) => this.setState({tags:tags}));
  }

  render() {
    return (<div>
      <ul>
        <li><Link to={this.props.category + (this.props.file ? '?file=' + this.props.file : '')}>All</Link></li>
      {this.state.tags.map((tag) => (
        <li key={tag}><Link to={this.props.category + '?tag=' + tag + (this.props.file ? '&file=' + this.props.file : '')}>{tag}</Link></li>
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
    fetch('/api/notes' + nextProps.category + (nextProps.tag ? '?tag=' + nextProps.tag : '')).then((result) => result.json()).then((notes) => this.setState({notes:notes}));
  }

  getUrl(note) {
    if (this.props.tag) {
      return this.props.category + '?tag=' + this.props.tag + '&file=' + note.file;
    }

    return this.props.category + '?file=' + note.file;
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

