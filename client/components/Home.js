import React from 'react';

import Categories from './Categories';
import Tags from './Tags';
import Notes from './Notes';
import Note from './Note';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      category: undefined,
      file: undefined,
      tags: undefined
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    var next = {
      category: nextProps.location.query.category,
      tags: nextProps.location.query.tags,
      file: nextProps.location.pathname.length > 1 ? nextProps.location.pathname : undefined
    };

    if (this.state.category === next.category && this.state.tags === next.tags && this.state.file === next.file) {
      return;
    }

    this.setState(next);
  }

  render() {
    return (
      <div>
        <Categories category={this.state.category} file={this.state.file} />
        <Tags category={this.state.category} tags={this.state.tags} file={this.state.file} />
        <Notes category={this.state.category} tags={this.state.tags} file={this.state.file} />
        <Note file={this.state.file} />
      </div>
    );
  }
}

module.exports = Home;