/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactRouter = __webpack_require__(4);

	var _path = __webpack_require__(5);

	var _path2 = _interopRequireDefault(_path);

	var _reactMarkdown = __webpack_require__(7);

	var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function getLocation() {
	  return window.location.pathname;
	}

	var Welcome = function (_React$Component) {
	  _inherits(Welcome, _React$Component);

	  function Welcome(props) {
	    _classCallCheck(this, Welcome);

	    var _this = _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).call(this, props));

	    _this.state = {
	      category: '/',
	      file: null,
	      tag: null
	    };
	    return _this;
	  }

	  _createClass(Welcome, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.componentWillReceiveProps(this.props);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.setState({
	        category: nextProps.location.query.category,
	        tag: nextProps.location.query.tag,
	        file: nextProps.location.pathname.length > 1 ? nextProps.location.pathname : null
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(Categories, { category: this.state.category, file: this.state.file }),
	        _react2.default.createElement(Tags, { category: this.state.category, tag: this.state.tag, file: this.state.file }),
	        _react2.default.createElement(Notes, { category: this.state.category, tag: this.state.tag, file: this.state.file }),
	        _react2.default.createElement(Note, { file: this.state.file })
	      );
	    }
	  }]);

	  return Welcome;
	}(_react2.default.Component);

	var Categories = function (_React$Component2) {
	  _inherits(Categories, _React$Component2);

	  function Categories(props) {
	    _classCallCheck(this, Categories);

	    var _this2 = _possibleConstructorReturn(this, (Categories.__proto__ || Object.getPrototypeOf(Categories)).call(this, props));

	    _this2.state = {
	      categories: []
	    };
	    return _this2;
	  }

	  _createClass(Categories, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this3 = this;

	      fetch('/api/categories').then(function (result) {
	        return result.json();
	      }).then(function (categories) {
	        return _this3.setState({
	          categories: categories
	        });
	      });
	    }
	  }, {
	    key: 'renderCategories',
	    value: function renderCategories(categories) {
	      var _this4 = this;

	      var result = [];

	      categories.forEach(function (category) {
	        return result.push(_react2.default.createElement(
	          'li',
	          { key: category.name },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: getLocation() + '?category=' + category.dir },
	            category.name
	          ),
	          _react2.default.createElement(
	            'ul',
	            null,
	            _this4.renderCategories(category.categories)
	          )
	        ));
	      });

	      return result;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: getLocation() },
	          'All'
	        ),
	        _react2.default.createElement(
	          'ul',
	          null,
	          this.renderCategories(this.state.categories)
	        )
	      );
	    }
	  }]);

	  return Categories;
	}(_react2.default.Component);

	var Tags = function (_React$Component3) {
	  _inherits(Tags, _React$Component3);

	  function Tags(props) {
	    _classCallCheck(this, Tags);

	    var _this5 = _possibleConstructorReturn(this, (Tags.__proto__ || Object.getPrototypeOf(Tags)).call(this, props));

	    _this5.state = {
	      tags: []
	    };
	    return _this5;
	  }

	  _createClass(Tags, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.componentWillReceiveProps(this.props);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this6 = this;

	      if (!nextProps.category) {
	        return;
	      }

	      fetch('/api/tags/' + nextProps.category).then(function (result) {
	        return result.json();
	      }).then(function (tags) {
	        return _this6.setState({ tags: tags });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this7 = this;

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'ul',
	          null,
	          _react2.default.createElement(
	            'li',
	            null,
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: getLocation() + (this.props.category ? '?category=' + this.props.category : '') },
	              'All'
	            )
	          ),
	          this.state.tags.map(function (tag) {
	            return _react2.default.createElement(
	              'li',
	              { key: tag },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: getLocation() + '?tag=' + tag + (_this7.props.category ? '&category=' + _this7.props.category : '') },
	                tag
	              )
	            );
	          })
	        )
	      );
	    }
	  }]);

	  return Tags;
	}(_react2.default.Component);

	var Notes = function (_React$Component4) {
	  _inherits(Notes, _React$Component4);

	  function Notes(props) {
	    _classCallCheck(this, Notes);

	    var _this8 = _possibleConstructorReturn(this, (Notes.__proto__ || Object.getPrototypeOf(Notes)).call(this, props));

	    _this8.state = {
	      notes: []
	    };
	    return _this8;
	  }

	  _createClass(Notes, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.componentWillReceiveProps(this.props);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this9 = this;

	      if (!nextProps.category) {
	        return;
	      }

	      fetch('/api/notes/' + nextProps.category + (nextProps.tag ? '?tag=' + nextProps.tag : '')).then(function (result) {
	        return result.json();
	      }).then(function (notes) {
	        return _this9.setState({ notes: notes });
	      });
	    }
	  }, {
	    key: 'getUrl',
	    value: function getUrl(note) {
	      return note.file + (this.props.tag ? '?tag=' + this.props.tag : '') + (this.props.category ? (this.props.tag ? '&' : '?') + 'category=' + this.props.category : '');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this10 = this;

	      var url = this.prop;

	      return _react2.default.createElement(
	        'ul',
	        null,
	        this.state.notes.map(function (note) {
	          return _react2.default.createElement(
	            'li',
	            { key: note.file },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: _this10.getUrl(note) },
	              note.basename
	            )
	          );
	        })
	      );
	    }
	  }]);

	  return Notes;
	}(_react2.default.Component);

	var Note = function (_React$Component5) {
	  _inherits(Note, _React$Component5);

	  function Note(props) {
	    _classCallCheck(this, Note);

	    var _this11 = _possibleConstructorReturn(this, (Note.__proto__ || Object.getPrototypeOf(Note)).call(this, props));

	    _this11.state = {
	      note: null
	    };
	    return _this11;
	  }

	  _createClass(Note, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.componentWillReceiveProps(this.props);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this12 = this;

	      if (!nextProps.file) {
	        return;
	      }

	      fetch('/api/note' + nextProps.file).then(function (result) {
	        return result.json();
	      }).then(function (note) {
	        return _this12.setState({ note: note });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (!this.state.note) {
	        return _react2.default.createElement('span', null);
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'h1',
	          null,
	          this.state.note.basename
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(_reactMarkdown2.default, { source: this.state.note.content })
	        )
	      );
	    }
	  }]);

	  return Note;
	}(_react2.default.Component);

	_reactDom2.default.render(_react2.default.createElement(
	  _reactRouter.Router,
	  { history: _reactRouter.browserHistory },
	  _react2.default.createElement(_reactRouter.Route, { path: '/*', component: Welcome })
	), document.getElementById('app'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(8);

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = vendor;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(123);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(240);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(1);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(2))(227);

/***/ }
/******/ ]);