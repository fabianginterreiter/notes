import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import PanelsStore from '../stores/PanelsStore';
import ReloadListener from '../stores/ReloadListener';

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: null,
      style: this.createStyle(PanelsStore.getObject())
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);

    PanelsStore.addChangeListener(this, (e) => 
      this.setState({
        style:this.createStyle(e)
      })
    );
  }

  createStyle(e) {
   return {
        left: (e.categories ? 200 : 0) + (e.tags ? 200 : 0) + (e.notes ? 300 : 0) + 'px'
      }
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

  handleReload() {
    fetch('/api/reload').then(() => {
      console.log("reload");
      ReloadListener.dispatch();
    });
  }

  render() {
    var buttons = [];

    if (!PanelsStore.getObject().categories) {
      buttons.push(<span key="categories" onClick={() => PanelsStore.setCategories(true)}><i className="fa fa-folder-o" />&nbsp;</span>);
    }

    if (!PanelsStore.getObject().tags) {
      buttons.push(<span key="tags" onClick={() => PanelsStore.setTags(true)}><i className="fa fa-tags" />&nbsp;</span>);
    }

    if (!PanelsStore.getObject().notes) {
      buttons.push(<span key="notes" onClick={() => PanelsStore.setNotes(true)}><i className="fa fa-file-text-o" />&nbsp;</span>);
    }

    var content = null;
    if (this.state.note) {
      content = (<div className="content"><ReactMarkdown source={this.state.note.content} /></div>);
    }

    return (<div className="note" style={this.state.style}>
        <header>{buttons}&nbsp;<span onClick={this.handleReload.bind(this)} className="right"><i className="fa fa-refresh" /></span></header>
        {content}
      </div>)
  }
}

module.exports = Note;