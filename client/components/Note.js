import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import PanelsStore from '../stores/PanelsStore';
import ReloadListener from '../stores/ReloadListener';

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: null,
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

    if (this.state.edit) {
      buttons.push(<span key="cancel" onClick={() => this.setState({edit:null})}>Cancel</span>);
      buttons.push(<span key="save" onClick={() => this.handleSave()}>Save</span>);
    } else {
      buttons.push(<span key="edit" onClick={() => this.setState({edit:this.state.note.content})}>Edit</span>);
    }


    var content = null;
    if (this.state.note) {

      if (this.state.edit) {
        content =(<div className="content"><textarea value={this.state.edit} onChange={(event) => this.handleChange(event)} /></div>);
      } else {
        content = (<div className="content"><div className="text"><ReactMarkdown source={this.state.note.content} /></div></div>);
      }
    }

    return (<div className="note" style={this.state.style}>
        <header>{buttons}&nbsp;<span onClick={this.handleReload.bind(this)} className="right"><i className="fa fa-refresh" /></span></header>
        {content}
      </div>)
  }

  handleChange(event) {
    this.setState({
      edit: event.target.value
    });
  }

  handleSave() {
    var note = this.state.note;
    note.content = this.state.edit;

    fetch('/api/note' + this.props.file, {
      body: JSON.stringify(note),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT"
    }).then((result) => result.json()).then((object) => {
      ReloadListener.dispatch();
      this.setState({
        note: object,
        edit: null
      });
    });
  }
}

module.exports = Note;
