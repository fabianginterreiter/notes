import React from 'react';

import Categories from './Categories';
import Tags from './Tags';
import Notes from './Notes';
import Note from './Note';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      category: '/',
      file: null,
      tags: null
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      category: nextProps.location.query.category,
      tags: nextProps.location.query.tags,
      file: nextProps.location.pathname.length > 1 ? nextProps.location.pathname : null
    });
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