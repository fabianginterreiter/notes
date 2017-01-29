import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

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
    var url = '/api/notes' + category + (nextProps.tags ? '?tags=' + nextProps.tags : '');
    fetch(url).then((result) => result.json()).then((notes) => this.setState({notes:notes}));
  }

  getUrl(note) {
    return note.file + (this.props.tags ? '?tags=' + this.props.tags : '') + (this.props.category ? (this.props.tags ? '&' : '?') + 'category=' + this.props.category : '');
  }

  render() {
    return (<div className="notes panel"><ul>
      {this.state.notes.map((note) => (<li key={note.file}>
        <Link to={this.getUrl(note)} className={(this.props.file === note.file ? 'active' : '')}>
        <div className="title">{(note.title ? note.title : note.basename)}</div>
        <span className="date">{moment(note.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </Link></li>))}
      </ul></div>)
  }
}

module.exports = Notes;