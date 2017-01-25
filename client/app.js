"use strict"

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, IndexRoute, IndexRedirect, Link } from 'react-router'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'

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
      <div className="container">
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

  renderCategories(categories, deep) {
    var result = [];

    var style = {
      paddingLeft: (10 + deep * 10) + 'px'
    }

    categories.forEach((category) => result.push(
      <li key={category.name} >
        <Link style={style} to={getLocation() + '?category=' + category.dir} className={this.props.category === category.dir ? 'active' : ''}>{category.name}</Link>
      <ul>{this.renderCategories(category.categories, deep + 1)}</ul>
      </li>));

    return result;
  }

  render() {
    return (<div className="categories panel">
        <ul>
        <li><Link to={getLocation()} className={(!this.props.category ? 'active' : '')}>All</Link></li>
        <li className="divider" />
        {this.renderCategories(this.state.categories, 0)}</ul></div>);
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
    var category = nextProps.category ? nextProps.category : '';
    fetch('/api/tags/' + category).then((result) => result.json()).then((tags) => this.setState({tags:tags}));
  }

  render() {
    return (<div className="tags panel">
      <ul>
        <li><Link to={getLocation() + (this.props.category ? '?category=' + this.props.category : '')} className={(!this.props.tag ? 'active' : '')}>All</Link></li>
        <li className="divider" />
      {this.state.tags.map((tag) => (
        <li key={tag}><Link to={getLocation() + '?tag=' + tag + (this.props.category ? '&category=' + this.props.category : '')} className={(this.props.tag === tag ? 'active' : '')}>#{tag}</Link></li>
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
    var category = nextProps.category ? nextProps.category : '';
    fetch('/api/notes/' + category + (nextProps.tag ? '?tag=' + nextProps.tag : '')).then((result) => result.json()).then((notes) => this.setState({notes:notes}));
  }

  getUrl(note) {
    return note.file + (this.props.tag ? '?tag=' + this.props.tag : '') + (this.props.category ? (this.props.tag ? '&' : '?') + 'category=' + this.props.category : '');
  }

  render() {
    var url = this.prop

    return (<div className="notes panel"><ul>
      {this.state.notes.map((note) => (<li key={note.file}>
        <Link to={this.getUrl(note)} className={(this.props.file === note.file ? 'active' : '')}>
        <div className="title">{note.basename}</div>
        {moment(note.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Link></li>))}
      </ul></div>)
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

    return (<div className="note">
        <div className="content"><ReactMarkdown source={this.state.note.content} /></div>
      </div>)
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/*" component={Welcome} />
  </Router>,
  document.getElementById('app')
);


