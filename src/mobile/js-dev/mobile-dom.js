/*
 *	移动端 公共类库
 * 作者：黄其山
 */

(function (global, factory) {

	//  cmd commonjs
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(global);
	}

	// amd requirejs
	else if (typeof define === "function" && define.amd) {
		define(function () {
			return factory(global);
		});
	}

	// cmd seajs
	else if (typeof define === "function" && define.cmd) {
		define(function (require, exports, module) {
			module.exports = factory(global);
		});

	} else {
		factory(global);
	}

})(typeof window !== "undefined" ? window : this, function (window) {

	"use strict"

	// 冲突Mobile兼容
	var _mobile = window.mobile, _m = window.m, _$ = window.$;

	// 创建mobile对象
	window.Mobile = window.$ = window.m = window.mobile = function (selector, context) {

		if (typeof selector === "function" && arguments.length === 1) {
			Mobile.ready(selector);
			return;
		};
		return new Mobile.fn.init(selector, context);
	};

	// 版本号
	Mobile.version = "1.1.0";

	// 可计算值的列表值
	Mobile.numberList = ["left", "top", "right", "bottom", "width", "height"];

	var _block = ["body", "div", "p", "table", "tr", "thead", "tbody", "tfoot", "h1", "h2", "h3", "h4", "h5", "h6",
		"article",
		"aside", "details", "figcaption", "figure", "footer", "header", "hgroup", "main", "menu", "nav", "section",
		"summary",
		"ul", "li", "ol", "dl", "dt", "dd", "fieldset"
	]
	var _inlineBlock = ["img", "audio", "canvas", "progress", "video", "text-area", "select", "input", "button"];

	// 查找元素显示类型
	function _getElementType(nodeName) {
		var _type = "inline";

		// block
		Mobile.each(_block, function (i, v) {
			if (v === nodeName) {
				_type = "block";
				return false;
			}
		});

		// inlineblock
		Mobile.each(_inlineBlock, function (i, v) {
			if (v === nodeName) {
				_type = "inline-block";
				return false;
			}
		});

		return _type;

	}

	// 查找父元素
	function _searchParents(el, fn) {

		if (el.parentElement) {
			if (fn(el.parentElement)) {
				return el.parentElement;
			}
		}

		if ((el.nodeName || "").toLowerCase() === "html") {
			return;
		}

		return _searchParents(el.parentElement, fn);

	}

	// scrollTop 动画
	function _scrollTop(self, y, time) {

		time = typeof time === "number" ? time : 400;
		y = typeof y === "number" ? y : parseFloat(y);
		y = isNaN(y) ? 0 : y;
		var fx = 20;
		var speed = 20;

		self.clearTimeId = self.clearTimeId || 0;
		clearInterval(self.clearTimeId);

		var isElement = true;
		if (self === window || self === document) {
			isElement = false;
		} else {
			isElement = true;
		}

		var speed1 = time / fx;
		var windowStartTop = (isElement ? self.scrollTop : parseFloat(window.pageYOffset)) || 0;

		var speed2 = Math.abs(windowStartTop - y);
		speed = speed2 / speed1;

		if (windowStartTop > y) {

			self.clearTimeId = setInterval(function () {
				windowStartTop = windowStartTop - speed;
				isElement ? self.scrollTop = windowStartTop : window.scrollTo(0, windowStartTop);
				//	console.log("scrolltop")
				if ((windowStartTop - speed) <= y) {
					// stop
					isElement ? self.scrollTop = y : window.scrollTo(0, y);
					clearInterval(self.clearTimeId);
				}
			}, fx);
		} else {
			if (windowStartTop === y) {
				// stop
				clearInterval(self.clearTimeId);
				return;
			}
			self.clearTimeId = setInterval(function () {
				windowStartTop = windowStartTop + speed;
				isElement ? self.scrollTop = windowStartTop : window.scrollTo(0, windowStartTop);
				//console.log("scrolltop");
				if (windowStartTop + speed > y) {
					// stop
					isElement ? self.scrollTop = y : window.scrollTo(0, y);
					clearInterval(self.clearTimeId);
				}
			}, fx);
		}
	}

	// 原型-prototype
	Mobile.fn = Mobile.prototype = {

		init: function (selector, content) {

			var arrs = [];
			this.length = 0;
			if (!content) {

				// 字符串
				if (typeof selector === "string") {
					if (selector.trim().length === 0) {
						return this;
					}
					var els = document.querySelectorAll(selector);
					Array.prototype.push.apply(this, els);
				} else if (typeof selector === "object") {

					// 遍历数组型对象
					if (selector.hasOwnProperty("length") && selector.length > 0) {
						Mobile.each(selector, function (i, v) {
							arrs.push(v);
						});
					} else if (selector.nodeType === Node.ELEMENT_NODE || selector.nodeType === Node.DOCUMENT_NODE || selector ===
						window) {
						// 单例对象 
						arrs.push(selector);
					}

					Array.prototype.push.apply(this, arrs);

				}

			} else {

				if (typeof content === "string" && typeof selector === "string") {

					if (content.trim().length === 0) {
						return this;
					}
					if (selector.trim().length === 0) {
						return this;
					}

					var p = document.querySelectorAll(content);
					Mobile.each(p, function () {
						var childElements = this.querySelectorAll(selector);
						for (var i = 0; i < childElements.length; i++) {
							arrs.push(childElements[i])
						}
					});
					Array.prototype.push.apply(this, arrs);

				} else if (typeof content === "object" && typeof selector === "string") {
					if (selector.trim().length === 0) {
						return this;
					}
					// 遍历数组型对象
					if (content.hasOwnProperty("length") && content.length > 0) {

						Mobile.each(content, function () {
							var childElements = this.querySelectorAll(selector);
							for (var i = 0; i < childElements.length; i++) {
								arrs.push(childElements[i]);
							}

						});
						Array.prototype.push.apply(this, arrs);

					} else if (content.nodeType === Node.ELEMENT_NODE || content.nodeType === Node.DOCUMENT_NODE) {
						var childElements = content.querySelectorAll(selector);
						Array.prototype.push.apply(this, childElements);
					}

				}

			}
			return this;
		},

	}

	// 将init函数作为实例化的mobile原型。 
	Mobile.fn.init.prototype = Mobile.fn;

	// 添加静态和实例的扩展方法
	Mobile.extend = Mobile.fn.extend = function (obj) {

		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			// skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !Mobile.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			if ((options = arguments[i]) != null) {

				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}


					if (deep && copy && (Mobile.isPlainObject(copy) || (copyIsArray = Mobile.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;

							// 深度复制数组
							clone = src && Mobile.isArray(src) ? src : [];

						} else {

							//  深度复制对象
							clone = src && Mobile.isPlainObject(src) ? src : {};
						}


						target[name] = Mobile.extend(deep, clone, copy);

						//  复制值类型
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}


		return target;
	}

	// 扩展静态方法
	Mobile.extend({

		noCoflict: function (deep) {
			window.$ = _$;
			window.m = _m;
			if (deep) {
				window.mobile = _mobile;
			}

			return Mobile;
		},

		each: function (els, fn) {
			if (!els) {
				throw new Error("els property type must is Array or Object");
			}
			for (var i = 0; i < els.length; i++) {

				if (typeof fn === "function") {
					var bl = fn.call(els[i], i, els[i]);
					if (bl === false) {
						break;
					}
				}
			}
		},

		ready: function (fn) {

			if (typeof fn === "function") {
				window.addEventListener("load", fn);

			}
			return;
		},

		// 列表项和子项的匹配	
		isEqual: function (list, item) {
			list = list || [];
			for (var i = 0; i < list.length; i++) {

				if (list[i] === item) {
					return true;
				}
			}

			return false;

		},

		// html字符串转dom对象
		htmlStringToDOM: function (txt) {

			var df2 = document.createDocumentFragment();
			var df = document.createDocumentFragment();
			var div = document.createElement("div");
			div.innerHTML = txt;
			df.appendChild(div);
			var _nodes = df.querySelector("div").childNodes;
			for (var i = _nodes.length; i > 0; i--) {
				df2.insertBefore(_nodes[i - 1], df2.childNodes[0]);
			}
			df = null;
			return df2;

		},

		checkSelector: function (el, txt) {
			txt = typeof txt === "string" ? txt : "";
			if (txt.trim() === "") {
				return false;
			}
			var regId = /\#[a-zA-Z_][\w|-]*[^\.|^#|\[]{0,}/g;
			var regClass = /\.[a-zA-Z_][\w|-]*[^\.|^#|\[]{0,}/g;
			var regTag = /^[a-zA-Z][\w|-]*[^\.|^#|\[]{0,}|[\]][a-zA-Z][\w|-]*[^\.|^#|\[]{0,}/g;
			var regAttr = /\[[a-zA-Z][\w-=]*\]/g;

			var idList = txt.match(regId) || [];
			idList = rep(idList, "#", "");
			var isIdBl = isId(el, idList, txt);
			//alert(isIdBl)

			var classList = txt.match(regClass) || [];
			classList = rep(classList, ".", "");
			var isClassBl = isclass(el, classList, txt);
			//alert(isClassBl)

			var tagList = txt.match(regTag) || [];
			tagList = rep(tagList, "]", "")
			var isTagBl = istag(el, tagList, txt);
			//alert(isTagBl)

			var attrList = txt.match(regAttr) || [];
			attrList = rep(attrList, "[", "");
			attrList = rep(attrList, "]", "");
			var isAttrBl = isAttr(el, attrList, txt);
			//alert(attrList)

			function rep(list, old, now) {
				var arr = [];
				for (var i = 0; i < list.length; i++) {
					arr.push(list[i].replace(old, now));
				}

				return arr;
			}

			function isId(el, idList, searchTxt) {

				if (searchTxt.search(/#/) === -1) {
					return true;
				} else if (searchTxt.search(/#/) !== -1 && idList.length === 0) {
					return false;
				}

				// 上条件不符合  向下执行
				var id = el.id || "";
				for (var i = 0; i < idList.length; i++) {
					if (idList[i] == id) {
						return true;
					}
				}
				return false;

			}

			function isclass(el, idList, searchTxt) {
				if (searchTxt.search(/\./) === -1) {
					return true;
				} else if (searchTxt.search(/\./) !== -1 && idList.length === 0) {
					return false;
				}

				// 上条件不符合  向下执行
				var _class = el.classList || "";

				for (var i = 0; i < idList.length; i++) {
					if (!_class.contains(idList[i])) {
						return false;
					}
				}
				return true;

			}

			function istag(el, idList, searchTxt) {
				if (searchTxt.search(/^[a-zA-Z]|[\]][a-zA-Z]/) === -1) {
					return true;
				} else if (searchTxt.search(/^[a-zA-Z]|[\]][a-zA-Z]/) !== -1 && idList.length === 0) {
					return false;
				}

				// 上条件不符合  向下执行
				var _tag = (el.nodeName || "").toLowerCase();

				for (var i = 0; i < idList.length; i++) {
					if (idList[i].trim() !== _tag) {
						return false;
					}
				}
				return true;

			}

			function isAttr(el, idList, searchTxt) {

				if (searchTxt.search(/\[.*\]/) === -1) {
					return true;
				} else if (searchTxt.search(/\[.*\]/) !== -1 && idList.length === 0) {
					return false;
				}

				// 上条件不符合  向下执行
				//var _tag = el.getat
				var _reg2 = /=/g;
				for (var i = 0; i < idList.length; i++) {

					if (_reg2.test(idList[i])) {
						//alert(idList[i]);
						var arr2 = idList[i].split("=");
						if ((el.getAttribute(arr2[0]) || "").trim() !== (arr2[1] || "").trim()) {
							return false;
						}
					} else {

						if (!el.hasAttribute(idList[i])) {
							return false;
						}
					}

				}
				return true;

			}

			return isIdBl && isClassBl && isTagBl && isAttrBl;
		},

		trim: function (txt) {
			var str = "";
			txt = typeof txt === "string" ? txt : "";
			str = txt.replace(/^\s*|\s*$/img, "");
			return str;
		},

		round: function (value, ratio) {

			if (arguments.length === 1) {

				if (typeof value === "number") {
					return Math.round(value);
				}

			} else if (arguments.length === 2) {
				if (typeof value === "number" && typeof ratio === "number") {

					var _v = Math.floor(value);
					_v = _v + ratio;

					if (value > _v) {
						return Math.ceil(value);
					} else {
						return Math.floor(value);
					}

				}

			}

			return null;
		},

		// 检查是否为移动端
		isMobile: function () {

			var userAgentInfo = navigator.userAgent.toString().toLowerCase();
			var Agents = ["Android", "iPhone",
				"SymbianOS", "Windows Phone",
				"iPad", "iPod"
			];
			//console.log(userAgentInfo)
			var flag = false;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v].toLowerCase()) > 0) {
					flag = true;
					break;
				}
			}
			return flag;
		},

		/* jsonToDate 
		  /Date(1492048799952)/ 或 1492048799952
		  fmt=("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423 
		  */
		jsonToDate: function (value, fmt) {
			fmt = typeof fmt !== "string" ? "yyyy-MM-dd HH:mm:ss" : fmt;
			var txts = value.toString().replace("/Date(", "").replace(")/", "");
			var times = Number(txts);
			times = isNaN(times) ? new Date(value).getTime() : times;
			var dt = new Date(Number(times.toString()));
			var o = {
				"M+": dt.getMonth() + 1,
				"d+": dt.getDate(),
				"H+": dt.getHours(),
				"m+": dt.getMinutes(),
				"s+": dt.getSeconds(),
				"q+": Math.floor((dt.getMonth() + 3) / 3),
				"S": dt.getMilliseconds()
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
				}
			}
			return fmt

		},

		isFunction: function (obj) {
			return Mobile.type(obj) === "function";
		},

		isArray: Array.isArray || function (obj) {
			return Mobile.type(obj) === "array";
		},

		isWindow: function (obj) {

			return obj != null && obj == obj.window;
		},


		isEmptyObject: function (obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		isPlainObject: function (obj) {
			var key;

			// Must be an Object
			if (!obj || Mobile.type(obj) !== "object" || obj.nodeType || Mobile.isWindow(obj)) {
				return false;
			}

			try {
				// Not own constructor property must be Object
				if (obj.constructor &&
					!{}.hasOwnProperty.call(obj, "constructor") &&
					!{}.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
					return false;
				}
			} catch (e) {
				// IE8,9 Will throw exceptions on certain host objects
				return false;
			}

			for (key in obj) { }

			return key === undefined || {}.hasOwnProperty.call(obj, key);
		},

		type: function (obj) {
			var class2type = {};
			var toString = class2type.toString;
			if (obj == null) {
				return obj + "";
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[toString.call(obj)] || "object" :
				typeof obj;
		},

	});

	// 扩展实例方法
	Mobile.fn.extend({

		//each
		each: function (fn) {
			Mobile.each(this, fn);
		},

		// css
		css: function (attr, value) {

			// get  返回第一个一个值
			if (arguments.length === 1 && typeof attr === "string") {

				var _css = "";
				Mobile.each(this, function (i, v) {

					if (window.getComputedStyle) {
						_css = window.getComputedStyle(v, null)[attr.trim()];
						if (Mobile.isEqual(Mobile.numberList, attr.trim())) {
							_css = parseFloat(_css) || 0;
						}
					}
					// ie8
					else if (v.currentStyle) {
						_css = v.currentStyle[attr];
					} else {
						_css = v.style[attr];
					}

					return false;

				});
				return _css;
			}

			// set
			if (arguments.length === 2) {

				Mobile.each(this, function () {
					if (Mobile.isEqual(Mobile.numberList, attr.trim())) {
						this.style[attr.trim()] = Number(value) ? Number(value).toString() + "px" : value;
					} else {
						this.style[attr.trim()] = value;

					}

				});

			}

			//set 对象的值
			if (arguments.length === 1 && typeof attr === "object") {
				Mobile.each(this, function (i, v) {
					for (var _attr in attr) {
						if (Mobile.isEqual(Mobile.numberList, _attr.trim())) {
							this.style[_attr] = Number(attr[_attr]) ? Number(attr[_attr]).toString() + "px" : attr[_attr];
						} else {
							this.style[_attr] = attr[_attr];
						}

					}
				});

			}

			return this;
		},

		// find
		find: function (selector) {
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var _arr = obj[i].querySelectorAll(selector);
				Mobile.each(_arr, function (i, v) {
					arr.push(v);
				})
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// text
		text: function (value) {

			//set 对象的值
			var _text = "";
			if (arguments.length === 0) {
				Mobile.each(this, function () {
					_text += this.innerText;

				});
				return _text;
			}
			if (arguments.length === 1) {
				Mobile.each(this, function () {
					this.innerText = value;
				});
			}
			return this;
		},

		// val
		val: function (value) {

			//set 对象的值
			var _val = "";
			if (arguments.length === 0) {
				Mobile.each(this, function () {
					_val += this.value;

				});
				return _val;
			}
			if (arguments.length === 1) {
				Mobile.each(this, function () {
					this.value = value;
				});
			}
			return this;
		},

		// html
		html: function (value) {

			//set 对象的值
			var _html = "";
			if (arguments.length === 0) {
				Mobile.each(this, function () {
					_html += this.innerHTML;
				});
				return _html;
			}
			if (arguments.length === 1) {
				Mobile.each(this, function () {
					this.innerHTML = value;
				});
			}
			return this;
		},

		// attr
		attr: function (attr, value) {

			// 返回第一个属性值
			if (arguments.length === 1 && typeof attr === "string") {
				var _attr = undefined;
				Mobile.each(this, function () {
					_attr = this.getAttribute(attr);
					if (_attr === null) {
						_attr = undefined;
					}
					return false;
				});
				return _attr;
			}

			if (arguments.length === 2) {

				Mobile.each(this, function () {
					this.setAttribute(attr, value.toString());
				});

			}
			return this;
		},

		// hasAttr
		hasAttr: function (attr) {

			// 是否含有元素的属性
			var _attr = false;
			if (arguments.length === 1 && typeof attr === "string") {

				Mobile.each(this, function () {
					_attr = this.hasAttribute(attr);
					return false;
				});
				return _attr;
			}

		},

		// removeAttr
		removeAttr: function (attr) {

			// 返回第一个属性值
			if (arguments.length === 1 && typeof attr === "string") {

				Mobile.each(this, function () {
					this.removeAttribute(attr);
				});
			}

			return this;
		},

		// addClass
		addClass: function (className) {

			if (typeof className === "string") {
				className = className.split(/\s+/);

			} else {

				return this;
			}

			if (arguments.length === 1) {

				Mobile.each(this, function () {
					for (var y = 0; y < className.length; y++) {
						if (className[y]) {
							this.classList.add(className[y]);
						}

					}
				});

			}

			return this;
		},

		// toggleClass
		toggleClass: function (className) {

			if (typeof className === "string") {
				className = className.split(/\s+/);

			} else {

				return this;
			}

			if (arguments.length === 1) {

				Mobile.each(this, function () {
					for (var y = 0; y < className.length; y++) {
						if (className[y]) {
							if (this.classList.contains(className[y])) {
								this.classList.remove(className[y]);
							} else {
								this.classList.add(className[y]);
							}

						}

					}
				});

			}

			return this;
		},

		//  hasclass
		hasClass: function (className) {
			var ishasClass = false;
			if (arguments.length === 1) {

				Mobile.each(this, function () {
					ishasClass = this.classList.contains(className);
					return false;
				});

			}

			return ishasClass;
		},

		// removeClass
		removeClass: function (className) {

			if (typeof className === "string") {
				className = className.split(/\s+/);

			} else {

				return this;
			}

			if (arguments.length === 1) {

				Mobile.each(this, function () {
					for (var y = 0; y < className.length; y++) {
						if (className[y]) {
							this.classList.remove(className[y]);
						}

					}

				});

			}
			return this;
		},

		// parent 
		parent: function () {
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var _arr = obj[i].parentElement;
				if (_arr) {
					arr.push(_arr)
				}
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// parents 
		parents: function (selector) {
			selector = typeof selector === "string" ? selector : "";
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {

				var p = _searchParents(obj[i], function (elm) {
					return Mobile.checkSelector(elm, selector);
				});

				delete obj[i];
				if (p) {
					arr.push(p);

				}

			};
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// closest 
		closest: function (selector) {
			selector = typeof selector === "string" ? selector : "";
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var p;
				if (Mobile.checkSelector(obj[i], selector)) {
					arr.push(obj[i]);
				} else {
					p = _searchParents(obj[i], function (elm) {
						return Mobile.checkSelector(elm, selector);
					});
				}
				delete obj[i];
				if (p) {
					arr.push(p);
				}
			};
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// get return native dom 
		get: function (index) {
			if (typeof index !== "number") {
				throw Error("index property must is number type")
			}

			if (index >= this.length) {
				throw Error("number  value max object length ");
			}

			return this[index];
		},

		// eq 
		eq: function (index) {
			if (typeof index !== "number") {
				throw Error("index property must is number type")
			}
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				if (i === index) {
					arr.push(obj[i])
				}
				delete obj[i];
			}
			delete obj.length;

			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  first
		first: function () {

			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				if (i === 0) {
					arr.push(obj[i])
				}
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  prev
		prev: function () {
			var arr = [];
			var obj = m(this);
			Mobile.each(obj, function (i, v) {
				var _prev = v.previousElementSibling;
				if (_prev) {
					arr.push(_prev)
				}
				delete v[i];
			});
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  next
		next: function () {
			var arr = [];
			var obj = m(this);
			Mobile.each(obj, function (i, v) {
				var _next = v.nextElementSibling;
				if (_next) {
					arr.push(_next)
				}
				delete v[i];
			});
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  siblings
		siblings: function () {
			var arr = [];
			var obj = m(this);
			Mobile.each(obj, function (i, v) {
				var _children = v.parentElement.children;
				var _index = m(v).index();

				for (var y = 0; y < _children.length; y++) {
					if (y !== _index) {
						arr.push(_children[y]);
					}
				}
				delete v[i];
			});
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  last
		last: function () {

			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var _length = (obj.length > 0) ? obj.length - 1 : 0;
				if (i === _length) {
					arr.push(obj[i])
				}
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  heigth
		height: function () {

			if (arguments.length === 0) {
				var _h = 0;
				Mobile.each(this, function (i, v) {

					// window

					if (this === window) {
						_h = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
					} else if (this === document) {
						_h = m(document.documentElement).css("height"); //document.documentElement.offsetHeight;
					} else {
						_h = m(this).css("height");
					}
					_h = parseFloat(_h);

					return false;

				});
				return _h;
			}

			// set
			else if (arguments.length === 1) {
				var _value = arguments[0]
				Mobile.each(this, function () {
					m(this).css("height", _value);

				});
			}
			return this;
		},

		//  clientHeight  垂直方向 height + 上下padding
		clientHeight: function () {

			if (arguments.length === 0) {
				var _h = 0;
				Mobile.each(this, function (i, v) {

					// window

					if (this === window) {
						_h = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
					} else if (this === document) {
						_h = m(document.documentElement).css("height"); //document.documentElement.offsetHeight;
					} else {
						_h = m(this).eq(0) && m(this).eq(0)[0].clientHeight;
					}
					_h = parseFloat(_h);

					return false;

				});
				return _h;
			}

			return this;
		},

		//  outerHeight 垂直方向 height + 上下padding + 上下border-width
		outerHeight: function () {

			if (arguments.length === 0) {
				var _h = 0;
				Mobile.each(this, function (i, v) {

					// window

					if (this === window) {
						_h = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
					} else if (this === document) {
						_h = m(document.documentElement).eq(0) && m(document.documentElement).eq(0)[0].offsetHeight; //document.documentElement.offsetHeight;
					} else {
						_h = m(this).eq(0) && m(this).eq(0)[0].offsetHeight;
					}
					_h = parseFloat(_h);

					return false;

				});
				return _h;
			}


			return this;
		},

		//  width
		width: function () {

			// get
			if (arguments.length === 0) {
				var _w = 0;
				Mobile.each(this, function () {

					// window
					if (this === window) {

						_w = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
					} else if (this === document) {
						_w = m(document.documentElement).css("width"); //document.documentElement.offsetWidth;

					} else {
						_w = m(this).css("width");
					}
					_w = parseFloat(_w);
					return false;

				});

				return _w;

			}

			// set
			else if (arguments.length === 1) {
				var _value = arguments[0]
				Mobile.each(this, function () {
					m(this).css("width", _value);

				});
			}

			return this;
		},

		//  clientWidth  水平方向 width + 左右padding
		clientWidth: function () {

			// get
			if (arguments.length === 0) {
				var _w = 0;
				Mobile.each(this, function () {

					// window
					if (this === window) {

						_w = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
					} else if (this === document) {
						_w = m(document.documentElement).css("width"); //document.documentElement.offsetWidth;

					} else {
						_w = m(this).eq(0) && m(this).eq(0)[0].clientWidth;
					}
					_w = parseFloat(_w);
					return false;

				});

				return _w;

			}

			return this;
		},

		//  outWidth 水平方向 width + 左右padding + 左右border-width
		outerWidth: function () {

			if (arguments.length === 0) {
				var _w = 0;
				Mobile.each(this, function () {

					// window
					if (this === window) {
						_w = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
					} else if (this === document) {
						_w = m(document.documentElement).eq(0) && m(document.documentElement).eq(0)[0].offsetWidth; //document.documentElement.offsetWidth;

					} else {
						_w = m(this).eq(0) && m(this).eq(0)[0].offsetWidth;

					}
					_w = parseFloat(_w);

					return false;

				});

				return _w;

			}

			return this;
		},

		//  scroll 区域的高度 
		scrollHeight: function () {

			// get
			var _h = 0;
			if (arguments.length === 0) {
				Mobile.each(this, function () {

					_h = m(this).eq(0) && m(this).eq(0)[0].scrollHeight;
					return false;
				});
			}

			return _h;
		},

		//  scroll 区域的宽度 
		scrollWidth: function () {

			// get
			var _w = 0;
			if (arguments.length === 0) {
				Mobile.each(this, function () {

					_w = m(this).eq(0) && m(this).eq(0)[0].scrollWidth;
					return false;
				});
			}

			return _w;
		},

		// getBoundingClientRect() 用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left,width,heigth
		clientRect: function () {

			// get
			var o = {};
			if (arguments.length === 0) {

				Mobile.each(this, function () {

					if (this === window || this === document) {
						o = {};
					} else {
						o = m(this).eq(0) && m(this).eq(0)[0].getBoundingClientRect();
					}

					return false;

				});
			}

			return o;

		},


		// offsetTop  获取当前元素到 定位父节点 的top方向的距离
		offsetTop: function () {
			var _top = 0;
			Mobile.each(this, function () {
				_top = this.offsetTop;
				return false;
			});
			return _top;
		},

		// offsetLeft  获取当前元素到 定位父节点 的left方向的距离
		offsetLeft: function () {
			var _left = 0;
			Mobile.each(this, function () {
				_left = this.offsetLeft;

			});
			return _left;
		},

		// offset
		offset: function () {
			var obj = {};
			Mobile.each(this, function () {
				obj.left = this.offsetLeft;
				obj.top = this.offsetTop;

			});
			return obj;
		},

		// index
		index: function (obj) {
			var _index = -1;
			if (arguments.length === 0) {
				Mobile.each(this, function (i, v) {
					if (v.parentElement) {
						var els = v.parentElement.children;
						for (var i = 0; i < els.length; i++) {
							if (els[i].isEqualNode(v)) {
								_index = i;
							}
						}
					}

					return false;
				});
			}

			return _index;
		},

		//  remove
		remove: function (obj) {
			var arr = [];
			var $this = this;
			Mobile.each(this, function (i, v) {
				if (v.parentElement) {
					var els = this.parentElement;
					var _indexObj = els.removeChild(this);
					arr.push(_indexObj);
				}
				delete $this[i]
			});

			Array.prototype.push.apply(this, arr);
			return this;
		},

		//  append
		append: function (obj) {
			if (typeof obj === "object" && obj.length && obj.length > 0) {
				Mobile.each(this, function () {
					for (var i = 0; i < obj.length; i++) {
						this.appendChild(obj[i]);
					}
				});
			} else if (typeof obj === "string") {
				Mobile.each(this, function () {
					this.innerHTML += obj;

				});

			} else {
				Mobile.each(this, function () {
					this.appendChild(obj);
				});
			}

			return this;
		},

		//  prepend
		prepend: function (obj) {
			if (typeof obj === "object" && obj.length && obj.length > 0) {
				Mobile.each(this, function () {
					for (var i = obj.length; i > 0; i--) {
						this.insertBefore(obj[i - 1], this.childNodes[0]);
					}
				});
			} else if (typeof obj === "string") {
				var els = Mobile.htmlStringToDOM(obj);
				Mobile.each(this, function () {
					this.insertBefore(els, this.childNodes[0]);
				});

			} else {
				Mobile.each(this, function () {
					this.insertBefore(obj, this.childNodes[0]);
				});
			}

			return this;
		},

		//  clone
		clone: function (obj) {
			var _obj;
			Mobile.each(this, function () {
				_obj = this.cloneNode(true);
				return false;
			});
			return _obj;
		},

	});

	// 动画
	Mobile.fn.extend({

		// show
		show: function () {

			Mobile.each(this, function (i, el) {
				clearInterval(this.clearTimeId);
				this.isshow = true;
				var _showType = this.showValue || "none";
				var _nodeName = this.nodeName.toLowerCase();
				if (_showType === "none") {
					_showType = _getElementType(_nodeName);
				}

				this.style.display = _showType;
				this.style.opacity = 1;

			});
			return this;

		},

		// hide
		hide: function () {

			Mobile.each(this, function (i, el) {
				clearInterval(this.clearTimeId);
				this.isshow = false;
				var _v = m(this).css("display") || "none";
				this.showValue = _v;
				this.style.display = "none";
				this.style.opacity = 0;

			});
			return this;
		},

		// toggle
		toggle: function () {

			Mobile.each(this, function () {

				var _v = m(this).css("display") || "none";
				if (_v.trim() != "none") {
					m(this).hide();
				} else {
					m(this).show();
				}
			});
			return this;
		},

		// fadeIn
		fadeIn: function (time) {

			Mobile.each(this, function (i, el) {

				clearInterval(this.clearTimeId);
				var _showType = "";
				this.isshow = true;
				if (!this.firstclick) {
					this.firstclick = true;
					_showType = m(this).css("display") || "none";
					if (_showType === "none") {
						this.style.opacity = 0;
					} else {
						this.style.opacity = 1;
					}

				} else {
					_showType = this.showValue || "none";
					this.style.opacity = parseFloat(m(this).css("opacity")) || 0;

				}

				var _nodeName = this.nodeName.toLowerCase();
				var _opacity = parseFloat(m(this).css("opacity")) || 0;
				if (_showType == "none") {
					_showType = _getElementType(_nodeName);
				}

				this.style.display = _showType;
				this.showValue = _showType;
				time = typeof time === "number" ? time : 400;
				var opt = 1000;
				var fx = 30;
				var t = time / fx;
				var speed = opt / t;
				this.clearTimeId = setInterval(function () {
					var v = parseFloat(el.style.opacity) || 0;
					v = v * 1000;
					el.style.opacity = (speed + v) / 1000;
					v = (parseFloat(el.style.opacity) || 0) * 1000;

					if ((v + speed) > opt) {
						el.style.opacity = opt / 1000;
						el.style.opacity = 1;
						el.style.display = _showType;
						clearInterval(this.clearTimeId);
					}
				}.bind(this), fx);

			});
			return this;

		},

		// fadeOut
		fadeOut: function (time) {

			Mobile.each(this, function (i, el) {
				clearInterval(this.clearTimeId);
				this.firstclick = true;
				this.isshow = false;
				var _v = m(this).css("display") || "none";
				if (_v != "none") {
					this.style.opacity = parseFloat(el.style.opacity) || 1;
				}
				this.showValue = _v;
				time = typeof time === "number" ? time : 400;
				var opt = 1000;
				var fx = 30;
				var t = time / fx;
				var speed = opt / t;
				this.clearTimeId = setInterval(function () {
					var v = parseFloat(el.style.opacity) || 0;
					v = v * 1000;
					el.style.opacity = (v - speed) / 1000;
					v = (parseFloat(el.style.opacity) || 0) * 1000;
					if ((v - speed) < 0) {
						el.style.opacity = 0;
						el.style.display = "none";
						clearInterval(this.clearTimeId);
					}
				}.bind(this), fx);
			});
			return this;
		},

		// fadeToggle
		fadeToggle: function (time) {

			Mobile.each(this, function () {
				var _v = m(this).css("display") || "none";
				if (typeof this.isshow != "undefined") {
					if (this.isshow) {
						m(this).fadeOut(time);
						this.isshow = false;
					} else {
						m(this).fadeIn(time);
						this.isshow = true;
					}

				} else {
					if (_v != "none") {
						if (!this.firstclick) {
							m(this).fadeOut(time);
							this.isshow = false;
						} else {
							m(this).fadeIn(time);
							this.isshow = true;
						}
					} else {
						if (this.firstclick) {
							m(this).fadeOut(time);
							this.isshow = false;
						} else {
							m(this).fadeIn(time);
							this.isshow = true;
						}
					}

				}
			});
			return this;
		},

		//  windowTop
		windowTop: function (y, time) {

			// get
			if (arguments.length === 0) {
				return parseFloat(window.pageYOffset) || 0;
			}

			Mobile.each(this, function () {
				if (this == window || this === document) {
					_scrollTop(this, y, time)
				} else {
					throw new Error("windowTop() function with element must is window or document ");
				}

				return false;
			});
			return this;
		},

		//  scrollTop
		scrollTop: function (y, time) {

			// get
			if (arguments.length === 0) {
				var _size = 0;
				Mobile.each(this, function () {
					if (this === window || this === document) {
						_size = window.pageYOffset || 0;
					} else {
						_size = this.scrollTop;
					}
					return false;
				});
				return _size;
			} else {
				Mobile.each(this, function () {
					_scrollTop(this, y, time);
				});


				return this;
			}
		},

	});


	// 绑定事件
	Mobile.fn.extend({
		on: function (type) {

			var $this = this;
			var isonebind = $this.length > 0 && $this.bindOneElementEvent ? true : false; // m(el).one()只绑定一次事件

			// 正常绑定事件
			if (arguments.length >= 2 && typeof arguments[1] === "function") {
				var handler = arguments[1];
				var bl = typeof arguments[2] === "boolean" ? arguments[2] : false;

				function f(event) {
					handler.call(this, event);

					// m(el).one()只绑定一次事件
					if (isonebind) {
						m(this).off(type, f, bl);
						m.events.on(type, f);
						$this.bindOneElementEvent = false;
					}
				}

				Mobile.each(this, function () {
					if (this.addEventListener) {
						this.addEventListener(type, f, bl);
					}
					//ie8
					//					else if(this.attachEvent) {
					//						this.attachEvent("on" + type, f, bl)
					//					} else {
					//						this["on" + type] =f /*直接赋给事件*/
					//					}
				});

				m.events.on(type, f);
			}

			// 正常绑定事件传object值
			if (arguments.length >= 3 && typeof arguments[1] === "object" && typeof arguments[2] === "function") {
				var obj = arguments[1]
				var handler = arguments[2];
				var bl = typeof arguments[3] === "boolean" ? arguments[3] : false;

				function f(event) {
					event.data = obj;
					handler.call(this, event);

					// m(el).one()只绑定一次事件
					if (isonebind) {
						m(this).off(type, f, bl);
						m.events.on(type, f);
						$this.bindOneElementEvent = false;
					}
				}

				Mobile.each(this, function () {
					if (this.addEventListener) {
						this.addEventListener(type, f, bl);
					}

				});

				m.events.on(type, f);
			}

			// 委托绑定事件
			if (arguments.length >= 3 && typeof arguments[1] === "string" && typeof arguments[2] === "function") {
				var el = arguments[1].trim();
				var handler = arguments[2];
				var bl = typeof arguments[3] === "boolean" ? arguments[3] : false;

				function f(event) {
					if (Mobile.checkSelector(event.target, el)) {
						handler.call(event.target, event);

						// m(el).one()只绑定一次事件
						if (isonebind) {
							m(this).off(type, f, bl);
							m.events.on(type, f);
							$this.bindOneElementEvent = false;
						}
					}
				}
				Mobile.each(this, function () {
					if (this.addEventListener) {
						this.addEventListener(type, f, bl);
					}
				});

				m.events.on(type, f);
			}

			// 委托绑定事件传object值
			if (arguments.length >= 4 && typeof arguments[1] === "string" && typeof arguments[2] === "object" && typeof arguments[
				3] === "function") {
				var el = arguments[1].trim();
				var obj = arguments[2];
				var handler = arguments[3];
				var bl = typeof arguments[4] === "boolean" ? arguments[4] : false;

				function f(event) {
					if (Mobile.checkSelector(event.target, el)) {
						event.data = obj;
						handler.call(event.target, event);

						// m(el).one()只绑定一次事件
						if (isonebind) {
							m(this).off(type, f, bl);
							m.events.on(type, f);
							$this.bindOneElementEvent = false;
						}
					}

				}
				Mobile.each(this, function () {
					if (this.addEventListener) {
						this.addEventListener(type, f, bl);
					}
				});

				m.events.on(type, f);
			}

			return this;

		},

		off: function (type, handler) {

			if (arguments.length === 1) {
				Mobile.each(this, function () {
					for (var i = m.events.props[type].length - 1; i >= 0; i--) {

						if (this.removeEventListener) {
							this.removeEventListener(type, m.events.props[type][i], false);
						} else {
							this.deattachEvent("on" + type, m.events.props[type][i]);
						}

						Mobile.events.off(type, m.events.props[type][i]);
					}
				});

				return;
			}
			Mobile.each(this, function () {
				if (this.removeEventListener)
					this.removeEventListener(type, handler, false);
				else if (this.deattachEvent) { /*IE*/
					this.deattachEvent('on' + type, handler);
				} else {

					// 直接赋给事件
					this["on" + type] = null;

				}
				Mobile.events.off(type, handler);
			});

			return this;

		},

		// trigger
		trigger: function (type, obj) {

			Mobile.each(this, function () {
				obj = obj || {};
				var btnEvent = document.createEvent("CustomEvent");
				btnEvent.initCustomEvent(type, true, false, obj);
				this.dispatchEvent(btnEvent);
			});

		},

		// emit
		emit: function (type, obj) {
			Mobile.each(this, function () {
				m(this).trigger(type, obj);
			});
		},

		//  only bind one event
		one: function () {
			var args = arguments;
			var $this = this;
			this.bindOneElementEvent = true;
			Mobile.each($this, function (i, v) {
				m(this).on.apply($this, args);

			});
		},

		// click
		click: function (fn, bl) {

			if (arguments.length === 0) {
				Mobile.each(this, function () {
					this.click(); // 原生触发
				});
				return this;
			}

			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("click", fn, bl);
			});
		},

		// dblclick
		dblclick: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("dblclick", fn, bl);
			});
		},

		//  blur
		blur: function (fn, bl) {
			if (arguments.length === 0) {
				$(this).each(function () {
					this.blur(); // 原生触发

				});
				return this;
			}

			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("blur", fn, bl);
			});
		},

		// focus
		focus: function (fn, bl) {
			if (arguments.length === 0) {
				$(this).each(function () {
					this.focus(); // 原生触发

				});
				return this;
			}
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("focus", fn, bl);
			});
		},

		// touchstart
		touchstart: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("touchstart", fn, bl);
			});
		},

		// touchmove
		touchmove: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("touchmove", fn, bl);
			});
		},

		// touchend
		touchend: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("touchend", fn, bl);
			});
		},

		// touchcancel
		touchcancel: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("touchcancel", fn, bl);
			});
		},

		// touchend 和 touchcancel 
		touchendcancel: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("touchend", fn, bl);
				m(this).on("touchcancel", fn, bl);
			});
		},

		// window cancel event
		windowcancel: function (fn) {
			var $this = this[0] || {};
			m(window).on("touchstart", function (event) {

				m(event.target).one("touchend", function (event) {
					fn.call($this, event);

				});

			});
		},

		// touchstart touchmove touchend touchcell 合并封装
		move: function (startfn, movefn, endfn,bl) {
			bl=!!bl;
			var isAddMoveEventFirst = true; // 判断是否第一次拖动
			var startX = 0;
			var startY = 0;
			var obj = {
				x: 0,
				y: 0,
				elX: 0,
				elY: 0,
				isX: false,
				isY: false
			};

			m(this).touchstart(start,bl);

			function start(event) {

				var touch = event.changedTouches[0];
				var identifier = touch.identifier;

				obj.x = startX = touch.clientX;
				obj.y = startY = touch.clientY;
				obj.ident = identifier;

				if (typeof startfn === "function") {
					startfn(event, obj);
				}

			}

			m(this).touchmove(move,bl);

			function move(event) {

				var touch = event.changedTouches[0];
				var identifier = touch.identifier;

				var nowX = touch.clientX;
				var nowY = touch.clientY;

				var _x = Math.abs(nowX - startX);
				var _y = Math.abs(nowY - startY);
				obj.x = nowX - startX;
				obj.y = nowY - startY;

				obj.ident = identifier;

				// 检查是否向上下或左右移动
				if (isAddMoveEventFirst && (_x != _y)) {
					isAddMoveEventFirst = false;
					if (_y > _x) {

						obj.isY = true;
						obj.isX = false;
					} else {
						obj.isY = false;
						obj.isX = true;
					}
				}

				if (typeof movefn === "function") {
					movefn(event, obj);
				}


			}

			m(this).touchendcancel(end,bl);

			function end(event) {

				var touch = event.changedTouches[0];
				var identifier = touch.identifier;
				obj.ident = identifier;

				isAddMoveEventFirst = true; // 判断是否第一次拖动
				obj.x = touch.clientX;
				obj.y = touch.clientY;

				if (typeof movefn === "function") {
					endfn(event, obj);
				}

			}


		},

		// tap
		tap: function () {
			var args = arguments;
			var fn = function () { };
			var deletage = "";
			var bl = false;

			Mobile.each(this, function (i, v) {

				var isMOve = true; // 判断是否往上拖动
				var isMOveFirst = true;

				var startX = 0;
				var startY = 0;
				var isDeleDageTarget = true; // 是否是委托事件

				function start(event) {
					event.preventDefault();
					isMOve = true;
					isMOveFirst = true;
					var touch = event.changedTouches[0];
					startX = touch.clientX;
					startY = touch.clientY;
				}

				function move(event) {
					event.preventDefault();
					var touch = event.changedTouches[0];
					var nowX = touch.clientX;
					var nowY = touch.clientY;
					var _x = Math.abs(nowX - startX);
					var _y = Math.abs(nowY - startY);
					if ((_x > 1 || _y > 1) && isMOveFirst) {
						isMOve = false;
						isMOveFirst = false;
					}
				}

				function end(event) {
					event.preventDefault();
					var _target;
					if (isDeleDageTarget) {
						_target = this;
					} else {
						_target = event.target;
					}
					if (isMOve) {
						if (typeof fn === "function") {
							fn.call(_target, event);
						}
					}
				}

				// 使用事件	
				if (args.length >= 1 && typeof args[0] === "function") {
					fn = args[0];
					bl = args[1] || false;
					isDeleDageTarget = true;

					m(this).on("touchstart", start, bl);
					m(this).on("touchmove", move, bl);
					m(this).on("touchend", end, bl);
				}

				// 使用委托事件	
				else if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "function") {
					deletage = args[0];
					fn = args[1];
					bl = args[2] || false;
					isDeleDageTarget = false;

					m(this).on("touchstart", deletage, start, bl);
					m(this).on("touchmove", deletage, move, bl);
					m(this).on("touchend", deletage, end, bl);
				}

				// 使用事件data		
				else if (args.length >= 2 && typeof args[0] === "object" && typeof args[1] === "function") {
					fn = args[1];
					bl = args[2] || false;
					var obj = args[0]
					isDeleDageTarget = true;
					m(this).on("touchstart", obj, start, bl);
					m(this).on("touchmove", obj, move, bl);
					m(this).on("touchend", obj, end, bl);
				}

				// 使用委托事件传值data	
				else if (args.length >= 3 && typeof args[0] === "string" && typeof args[1] === "object" && typeof args[2] ===
					"function") {
					deletage = args[0];
					var obj = args[1]
					fn = args[2];
					bl = args[3] || false;
					isDeleDageTarget = false;

					m(this).on("touchstart", deletage, obj, start, bl);
					m(this).on("touchmove", deletage, obj, move, bl);
					m(this).on("touchend", deletage, obj, end, bl);
				}

			});
		},

		// scroll
		scroll: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("scroll", fn, bl);
			});
		},

		// resize
		resize: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("resize", fn, bl);
			});
		},

		// change
		change: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("change", fn, bl);
			});
		},

		// keyup
		keyup: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("keyup", fn, bl);
			});
		},

		// keyup
		keydown: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("keydown", fn, bl);
			});
		},

		// keypress
		keypress: function (fn, bl) {
			bl = bl || false;
			Mobile.each(this, function () {
				m(this).on("keypress", fn, bl);
			});
		},
	});

	// 自定义事件
	Mobile.extend({
		events: {
			props: {},

			// bind events
			on: function (eventName, fn) {
				this.props[eventName] = this.props[eventName] || [];
				this.props[eventName].push(fn);
			},
			off: function (eventName, fn) {
				if (arguments.length === 1) {

					this.props[eventName] = [];

				} else if (arguments.length === 2) {
					var $events = this.props[eventName] || [];
					for (var i = 0; i < $events.length; i++) {
						if ($events[i] === fn) {
							$events.splice(i, 1);
							break;
						}

					}

				}

			}
		}
	});

	// transform 
	Mobile.fn.extend({

		// setTransform 
		setTransform: function (transforName, value) {

			Mobile.each(this, function () {
				if (!this.transform) {
					this.transform = {};
				}
				this.transform[transforName] = value;
				var result = '';

				for (var item in this.transform) {
					switch (item) {
						case 'rotate':
						case 'rotateX':
						case 'rotateY':
						case 'rotateZ':
						case 'skewX':
						case 'skewY':
						case 'skewZ':
							result += item + '(' + parseFloat(this.transform[item]) + 'deg)  ';
							break;
						case 'skew':
							var arrs = this.transform[item].split(",");
							if (arrs.length === 2) {
								result += item + '(' + parseFloat(arrs[0]) + 'deg,' + parseFloat(arrs[1]) + 'deg)  ';
							} else {
								result += item + '(' + parseFloat(arrs) + 'deg,' + 0 + 'deg)  ';
							}
							break;

						case 'scaleX':
						case 'scaleY':
						case 'scaleZ':
							result += item + '(' + parseFloat(this.transform[item]) + ')  ';
							break;

						case 'scale':
							var arrs = this.transform[item].split(",");

							if (arrs.length === 2) {
								result += item + '(' + parseFloat(arrs[0]) + ',' + parseFloat(arrs[1]) + ')  ';
							} else {
								result += item + '(' + parseFloat(arrs) + ',' + parseFloat(arrs) + ')  ';
							}
							break;

						case 'translateX':
						case 'translateY':
						case 'translateZ':
							result += item + '(' + parseFloat(this.transform[item]) + 'px)  ';
							break;
						case 'translate':
							var arrs = this.transform[item].split(",");

							if (arrs.length === 2) {
								result += item + '(' + parseFloat(arrs[0]) + 'px,' + parseFloat(arrs[1]) + 'px)  ';
							} else {
								result += item + '(' + parseFloat(arrs) + 'px,' + 0 + 'px)  ';
							}
							break;

					};

				};

				this.style.WebkitTransform = result;
				this.style.MozTransform = result;
				this.style.msTransform = result;
				this.style.OTransform = result;
				this.style.transform = result;

			});

			return this;
		},

		// getTransform
		getTransform: function (transforName) {

			var result = 0;
			Mobile.each(this, function () {
				if (!this.transform) {
					this.transform = {};
				}

				// read
				if (typeof this.transform[transforName] == 'undefined') {
					if (transforName == 'scale' || transforName == 'scaleX' || transforName == 'scaleY') {
						result = 1
						if (transforName === "scale") {
							result = [1, 1];
						}

					} else {
						result = 0;
						if (transforName === "skew" || transforName === "translate") {
							result = [0, 0];
						}
					}

				} else {
					if (transforName === "skew" || transforName === "translate" || transforName === "scale") {
						var strs = this.transform[transforName].split(",");
						var arrs = [];
						for (var y = 0; y < strs.length; y++) {
							var v = parseFloat(strs[y]);
							if (transforName === "scale") {
								v = isNaN(v) ? 1 : v;

							} else {
								v = isNaN(v) ? 0 : v;
							}

							arrs.push(v);
						}

						if (arrs.length === 1) {
							if (transforName === "scale") {
								arrs.push(arrs[0]);
							} else {
								arrs.push(0);
							}
						}
						result = arrs;

					} else {
						result = parseFloat(this.transform[transforName]);
					}

				}

			});

			return result;
		},

		// translateX
		translateX: function (size) {
			if (arguments.length === 0) {

				var _v = 0;
				Mobile.each(this, function () {
					_v = m(this).getTransform("translateX");
					return false;
				});

				return _v;

			} else {

				m(this).setTransform("translateX", size);
				return this;
			}

		},

		// translateY
		translateY: function (size) {
			if (arguments.length === 0) {

				var _v = 0;
				Mobile.each(this, function () {
					_v = m(this).getTransform("translateY");
					return false;
				});

				return _v;

			} else {

				m(this).setTransform("translateY", size);
				return this;
			}

		}

	});

	return Mobile;

});
