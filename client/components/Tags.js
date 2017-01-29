import React from 'react';
import { Link } from 'react-router';

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      filter: '',
      addTags: []
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    var category = nextProps.category ? nextProps.category : '';
    fetch('/api/tags/' + category).then((result) => result.json()).then((tags) => this.setState({tags:tags}));

    if (nextProps.tags) {
      fetch('/api/tags/' + category + '?tags=' + nextProps.tags).then((result) => result.json()).then((tags) => this.setState({addTags:tags}));
    } else {
      this.setState({addTags:[]});
    }
  }

  handleChange(e) {
    this.setState({
      filter: e.target.value
    });
  }

  renderPlusButton(tag) {
    if (!this.props.tags) {
      return null;
    }

    if (this.isActive(tag)) {
      var s = this.props.tags.split(',');

      for (var index = 0; index < s.length; index++) {
        if (s[index] === tag) {
          s.splice(index, 1);
          break;
        }
      }

      var url = null;

      if (s.length === 0) {
        url = window.location.pathname + (this.props.category ? '?category=' + this.props.category : '');
      } else {
        url = window.location.pathname + '?tags=' + s.join(',') + (this.props.category ? '&category=' + this.props.category : '');
      }

      return (<Link className="badge" to={url}><i className="fa fa-minus-square" /></Link>);
    }

    if (!this.contains(this.state.addTags, tag)) {
      return null;
    }

    return (<Link className="badge" to={window.location.pathname + '?tags=' + this.props.tags + ',' + tag + (this.props.category ? '&category=' + this.props.category : '')}><i className="fa fa-plus-square" /></Link>);
  }

  renderTag(tag) {
    if (!tag.startsWith(this.state.filter)) {
      return null;
    }

    return (<li key={tag} className={(this.isActive(tag) ? 'active' : '')}>
      <Link to={window.location.pathname   + '?tags=' + tag + (this.props.category ? '&category=' + this.props.category : '')}>
      #{tag}
      </Link>
      {this.renderPlusButton(tag)}
      </li>);
  }

  contains(t, tag) {
    for (var index = 0; index < t.length; index++) {
      if (t[index] === tag) {
        return true;
      }
    }

    return false;
  }

  isActive(tag) {
    if (!this.props.tags) {
      return false;
    }

    var t = this.props.tags.split(',');
    
    return this.contains(t, tag);
  }

  render() {
    return (<div className="tags panel">
      <input type="text" onChange={this.handleChange.bind(this)} value={this.state.filter} placeholder="Filter" />
      <ul>
        <li><Link to={window.location.pathname + (this.props.category ? '?category=' + this.props.category : '')} className={(!this.props.tags ? 'active' : '')}>All</Link></li>
          <li className="divider" />
          {this.state.tags.map((tag) => this.renderTag(tag))}
      </ul>
    </div>)
  }
}

module.exports = Tags;