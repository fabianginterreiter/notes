import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import PanelsStore from '../stores/PanelsStore';

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      style: {}
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);

    PanelsStore.addChangeListener(this, (e) => {
      this.setState({
        style: {
          width: (e.notes ? '299' : '0') + 'px',
          left: (e.categories ? 200 : 0) + (e.tags ? 200 : 0) + 'px'
        }
      })
    });
  }

  componentWillUnmount() {
    PanelsStore.removeChangeListener(this);
  }

  componentWillReceiveProps(nextProps) {
    var category = nextProps.category ? nextProps.category : '';
    var url = '/api/notes' + category + (nextProps.tags ? '?tags=' + nextProps.tags : '');
    fetch(url).then((result) => result.json()).then((notes) => {
      this.setState({notes:notes});
      PanelsStore.setNotes(true);
    });
  }

  getUrl(note) {
    return note.file + (this.props.tags ? '?tags=' + this.props.tags : '') + (this.props.category ? (this.props.tags ? '&' : '?') + 'category=' + this.props.category : '');
  }

  handleClose() {
    PanelsStore.setNotes(false);
  }

  render() {
    return (<div className="notes panel" style={this.state.style}>
      <header>Notes<span onClick={this.handleClose.bind(this)} className="right"><i className="fa fa-times" /></span></header>
      <div className="list">
      <ul>
      {this.state.notes.map((note) => (<li key={note.file}>
        <Link to={this.getUrl(note)} className={(this.props.file === note.file ? 'active' : '')}>
        <div className="title">{(note.title ? note.title : note.basename)}</div>
        <span className="date">{moment(note.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </Link></li>))}
      </ul></div></div>)
  }
}

module.exports = Notes;