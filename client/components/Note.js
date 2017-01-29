import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';

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

module.exports = Note;