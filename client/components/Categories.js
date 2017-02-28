import React from 'react';
import { Link } from 'react-router';
import PanelsStore from '../stores/PanelsStore';
import ReloadListener from '../stores/ReloadListener';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      style: this.createStyle(PanelsStore.getObject())
    }
  }

  componentDidMount() {
    this.load();

    PanelsStore.addChangeListener(this, (e) => 
      this.setState({
        style:this.createStyle(e)
      })
    );

    ReloadListener.addChangeListener(this, this.load.bind(this));
  }

  load() {
    fetch('/api/categories').then((result) => result.json()).then((categories) => this.setState({
      categories: categories
    }));
  }

  createStyle(e) {
     return {
        width: (e.categories ? '199' : '0') + 'px'
      }
  }

  componentWillUnmount() {
    PanelsStore.removeChangeListener(this);
    ReloadListener.removeChangeListener(this);
  }

  toggleCategory(e, category) {
    e.preventDefault();
    category.open = !category.open;
    this.forceUpdate();
  }

  renderCategories(categories, deep) {
    var result = [];

    var style = {
      paddingLeft: (10 + deep * 10) + 'px'
    }

    categories.forEach((category) => {
      if (category.categories.length === 0) {
        result.push(
          <li key={category.name} className={this.props.category === category.dir ? 'active' : ''}>
            <Link style={style} to={window.location.pathname + '?category=' + category.dir}>{category.name}</Link>
          </li>)
      } else {
        var sub = null;
        if (category.open) {
          sub = (<ul>{this.renderCategories(category.categories, deep + 1)}</ul>);
        }

        result.push(
          <li key={category.name} >
            <Link style={style} to={window.location.pathname + '?category=' + category.dir} className={this.props.category === category.dir ? 'active' : ''}>
              {category.title}
            </Link>
            <span className="badge" onClick={(e) => this.toggleCategory(e, category)}>
              <i className={'fa fa-chevron-' + (category.open ? 'down' : 'up')} />
            </span>
            {sub}
          </li>)  
      }
    });

    return result;
  }

  handleClose() {
    PanelsStore.setCategories(false);
  }

  render() {
    return (<div className="categories panel" style={this.state.style}>
        <header><i className="fa fa-folder-o" /><span onClick={this.handleClose.bind(this)} className="right"><i className="fa fa-times" /></span></header>
        <div className="list">
        <ul>
        <li><Link to={window.location.pathname} className={(!this.props.category ? 'active' : '')}>All</Link></li>
        <li className="divider" />
        {this.renderCategories(this.state.categories, 0)}</ul></div></div>);
  }
}

module.exports = Categories;