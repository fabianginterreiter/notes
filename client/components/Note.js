import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import PanelsStore from '../stores/PanelsStore';

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: null,
      style: {}
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);

    PanelsStore.addChangeListener(this, (e) => {
      this.setState({
        style: {
          left: (e.categories ? 200 : 0) + (e.tags ? 200 : 0) + (e.notes ? 300 : 0) + 'px'
        }
      })
    });
  }

  componentWillUnmount() {
    PanelsStore.removeChangeListener(this);
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

    var buttons = [];

    if (!PanelsStore.getObject().categories) {
      buttons.push(<span key="categories" onClick={() => PanelsStore.setCategories(true)}><i className="fa fa-folder-o" /></span>);
    }

    if (!PanelsStore.getObject().tags) {
      buttons.push(<span key="tags" onClick={() => PanelsStore.setTags(true)}><i className="fa fa-tags" /></span>);
    }

    if (!PanelsStore.getObject().notes) {
      buttons.push(<span key="notes" onClick={() => PanelsStore.setNotes(true)}><i className="fa fa-file-text-o" /></span>);
    }

    return (<div className="note" style={this.state.style}>
        <header>{buttons}&nbsp;</header>
        <div className="content"><ReactMarkdown source={this.state.note.content} /></div>
      </div>)
  }
}

module.exports = Note;