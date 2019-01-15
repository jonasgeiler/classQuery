/*
Notes:

cq_event_addClass-theClassToAdd_id-test
'_' is for splitting the different parts of the classQuery
'-' is for splitting the different parameter of the parts

*/


class classQuery {
	/*
	CONSTRUCTOR STUFF
	*/

	constructor() {
		let prototype = Object.getPrototypeOf(this);
		let propertyNames = Object.getOwnPropertyNames(prototype);

		this.events = {
			...this.getPropertiesWithPrefix(propertyNames, 'event_'),
			...this.getNonSpecialEvents()
		};
		this.actions = this.getPropertiesWithPrefix(propertyNames, 'action_');
		this.selectors = this.getPropertiesWithPrefix(propertyNames, 'selector_');

		let init = () => {
			this.buildClassQueries();
			this.registerEvents();
		};

		document.addEventListener('DOMContentLoaded', init);
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			init();
		}
	}

	// Get all class properties that start with a specific string
	getPropertiesWithPrefix(propertyNames, startsWith) {
		let properties = {};

		propertyNames.filter(propertyName => {
			return (propertyName.startsWith(startsWith) && propertyName !== 'event_nonSpecial');
		}).forEach(propertyName => {
			properties[propertyName.replace(startsWith, '')] = this[propertyName].bind();
		});

		return properties;
	}



	/*
	SCRIPT STARTING STUFF
	*/

	buildClassQueries() {
		const classQueryElements = document.querySelectorAll('*[class*="cq_"]');
		this.classQueries = [];

		let classQueryIDCount = 0;

		classQueryElements.forEach(element => {
			element.classList.forEach(elementClass => {
				if (elementClass.startsWith('cq_')) {
					let newClassQuery = {};
					newClassQuery.query = elementClass;
					newClassQuery.element = element;

					newClassQuery.id = classQueryIDCount;
					classQueryIDCount++;

					const classQueryParts = elementClass.split('_');

					if (classQueryParts.length < 4) {
						classQuery.error('classQueries must consist of at least 4 parts!', element);
					}

					// Extract the parts:
					let cq = classQueryParts.splice(0, 1)[0];
					let event = classQueryParts.splice(0, 1)[0];
					let action = classQueryParts.splice(0, 1)[0];
					let selector = classQueryParts.join('_'); // Take the rest of the classQuery


					/* EVENT-PART */
					if (!Object.keys(this.events).includes(event)) {
						classQuery.error('Unknown classQuery event "' + event + '"!', element);
					}

					newClassQuery.eventName = event;
					newClassQuery.event = () => this.events[event](newClassQuery);
					/*  */


					/* ACTION-PART */
					const args = action.split('-');
					const actionName = args.splice(0, 1)[0];

					if (!Object.keys(this.actions).includes(actionName)) {
						classQuery.error('Unknown classQuery action "' + actionName + '"!', element);
					}

					newClassQuery.actionName = actionName;
					newClassQuery.action = () => this.actions[actionName](newClassQuery);

					// Detect argument binding
					if (args[0] === '' && args[1] === '') {
						newClassQuery.actionArguments = element.dataset;
						newClassQuery.areActionArgumentsExternal = true;
					} else {
						newClassQuery.actionArguments = args;
						newClassQuery.areActionArgumentsExternal = false;
					}
					/*  */


					/* SELECTOR-PART */
					const selectorSplit = selector.split('-');
					const selectorMethod = selectorSplit.splice(0, 1)[0];
					const selectorElement = selectorSplit.join('-');

					if (!Object.keys(this.selectors).includes(selectorMethod)) {
						classQuery.error('Unknown classQuery selector method "' + selectorMethod + '"!', element);
					}

					newClassQuery.selectorMethod = selectorMethod;
					newClassQuery.selectorElement = selectorElement;
					newClassQuery.selector = () => this.selectors[selectorMethod](newClassQuery);
					/*  */


					this.classQueries.push(newClassQuery);
				}
			});
		});
	}

	registerEvents() {
		classQuery.log(this.classQueries);

		this.classQueries.forEach(_classQuery => {
			_classQuery.event(_classQuery);
		});
	}



	/*
	EVENTS - the first part of the classQuery (init, click, input, change, ...)
	*/

	// Get all non-special events (like click, dblclick, input, ...)
	getNonSpecialEvents() {
		let nonSpecialEventNames = [
			'readystatechange',
			'mouseenter',
			'mouseleave',
			'wheel',
			'copy',
			'cut',
			'paste',
			'beforescriptexecute',
			'afterscriptexecute',
			'abort',
			'canplay',
			'canplaythrough',
			'change',
			'click',
			'contextmenu',
			'dblclick',
			'drag',
			'dragend',
			'dragenter',
			'dragleave',
			'dragover',
			'dragstart',
			'drop',
			'durationchange',
			'emptied',
			'ended',
			'input',
			'invalid',
			'keydown',
			'keypress',
			'keyup',
			'loadeddata',
			'loadedmetadata',
			'loadstart',
			'mousedown',
			'mousemove',
			'mouseout',
			'mouseover',
			'mouseup',
			'pause',
			'play',
			'playing',
			'progress',
			'ratechange',
			'reset',
			'seeked',
			'seeking',
			'select',
			'show',
			'stalled',
			'submit',
			'suspend',
			'timeupdate',
			'volumechange',
			'waiting',
			'mozfullscreenchange',
			'mozfullscreenerror',
			'mozpointerlockchange',
			'mozpointerlockerror',
			'blur',
			'error',
			'focus',
			'load',
			'scroll'
		];
		let nonSpecialEvents = {};

		nonSpecialEventNames.forEach(nonSpecialEventName => {
			nonSpecialEvents[nonSpecialEventName] = (_classQuery) => this.event_nonSpecial(nonSpecialEventName, _classQuery);
		});

		return nonSpecialEvents;
	}

	// For all non-special events (like click, dblclick, input, ...)
	event_nonSpecial(event, _classQuery) {
		_classQuery.element.addEventListener(event, _classQuery.action);
	}

	// Gets executed at the start of classQuery
	event_init(_classQuery) {
		_classQuery.action();
	}



	/*
	ACTIONS - the second part of the classQuery (show, hide, remove, ...); DOM Manipulations
	*/

	action_show(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
		} else {
			if (_classQuery.actionArguments.length !== 0) {
				classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'inherit';
		}
	}

	action_hide(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
		} else {
			if (_classQuery.actionArguments.length !== 0) {
				classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
	}

	action_addClass(_classQuery) {
		if (!_classQuery.areActionArgumentsExternal && _classQuery.actionArguments.length < 1) {
			classQuery.error('"' + _classQuery.actionName + '"-Action requires at least 1 argument!', _classQuery.element);
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			if (_classQuery.areActionArgumentsExternal) {
				_classQuery.actionArguments.classes.split(' ').forEach(classToAdd => {
					elements[i].classList.add(classToAdd);
				});
			} else {
				_classQuery.actionArguments.forEach(classToAdd => {
					elements[i].classList.add(classToAdd);
				});
			}
		}
	}

	action_removeClass(_classQuery) {
		if (!_classQuery.areActionArgumentsExternal && _classQuery.actionArguments.length < 1) {
			classQuery.error('"' + _classQuery.actionName + '"-Action requires at least 1 argument!', _classQuery.element);
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			if (_classQuery.areActionArgumentsExternal) {
				_classQuery.actionArguments.classes.split(' ').forEach(classToAdd => {
					elements[i].classList.remove(classToAdd);
				});
			} else {
				_classQuery.actionArguments.forEach(classToAdd => {
					elements[i].classList.remove(classToAdd);
				});
			}
		}
	}

	action_toggleClass(_classQuery) {
		if (!_classQuery.areActionArgumentsExternal && _classQuery.actionArguments.length < 1) {
			classQuery.error('"' + _classQuery.actionName + '"-Action requires at least 1 argument!', _classQuery.element);
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			if (_classQuery.areActionArgumentsExternal) {
				_classQuery.actionArguments.classes.split(' ').forEach(classToAdd => {
					elements[i].classList.toggle(classToAdd);
				});
			} else {
				_classQuery.actionArguments.forEach(classToAdd => {
					elements[i].classList.toggle(classToAdd);
				});
			}
		}
	}

	action_setAttribute(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			if (!_classQuery.actionArguments.attributename) {
				classQuery.error('"' + _classQuery.actionName + '"-Action has no argument "attributeName"!', _classQuery.element);
			}

			if (!_classQuery.actionArguments.attributevalue) {
				classQuery.error('"' + _classQuery.actionName + '"-Action has no argument "attributeValue"!', _classQuery.element);
			}
		} else {
			if (_classQuery.actionArguments.length !== 2) {
				classQuery.error('"' + _classQuery.actionName + '"-Action requires two arguments!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			if (_classQuery.areActionArgumentsExternal) {
				elements[i].setAttribute(_classQuery.actionArguments.attributename, _classQuery.actionArguments.attributevalue);
			} else {
				elements[i].setAttribute(_classQuery.actionArguments[0], _classQuery.actionArguments[1]);
			}
		}
	}

	action_removeAttribute(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			if (!_classQuery.actionArguments.attributename) {
				classQuery.error('"' + _classQuery.actionName + '"-Action has no argument "attributeName"!', _classQuery.element);
			}
		} else {
			if (_classQuery.actionArguments.length !== 1) {
				classQuery.error('"' + _classQuery.actionName + '"-Action requires only 1 argument!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			if (_classQuery.areActionArgumentsExternal) {
				elements[i].removeAttribute(_classQuery.actionArguments.attributename);
			} else {
				elements[i].removeAttribute(_classQuery.actionArguments[0]);
			}
		}
	}

	action_empty(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
		} else {
			if (_classQuery.actionArguments.length !== 0) {
				classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			elements[i].innerHTML = '';
		}
	}

	action_duplicate(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
		} else {
			if (_classQuery.actionArguments.length !== 0) {
				classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			elements[i].insertAdjacentHTML('afterend', elements[i].outerHTML);
		}
	}

	action_remove(_classQuery) {
		if (_classQuery.areActionArgumentsExternal) {
			classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
		} else {
			if (_classQuery.actionArguments.length !== 0) {
				classQuery.error('"' + _classQuery.actionName + '"-Action doesn\'t require any arguments!', _classQuery.element);
			}
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			elements[i].remove();
		}
	}

	action_scrollIntoView(_classQuery) {
		if (!_classQuery.areActionArgumentsExternal && _classQuery.actionArguments.length > 2) {
			classQuery.error('"' + _classQuery.actionName + '"-Action takes only 2 optional arguments!', _classQuery.element);
		}


		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			let scrollOptions = {
				behavior: 'auto',
				block:    'start'
			};

			if (_classQuery.areActionArgumentsExternal) {
				if (_classQuery.actionArguments.behavior) {
					if (_classQuery.actionArguments.behavior === 'auto' || _classQuery.actionArguments.behavior === 'smooth') {
						scrollOptions.behavior = _classQuery.actionArguments.behavior;
					} else {
						classQuery.error('"' + _classQuery.actionName + '"-Action argument "behavior" must be "auto" or "smooth" - invalid value!', _classQuery.element);
					}
				}

				if (_classQuery.actionArguments.position) {
					if (_classQuery.actionArguments.position === 'start' || _classQuery.actionArguments.position === 'end') {
						scrollOptions.block = _classQuery.actionArguments.position;
					} else {
						classQuery.error('"' + _classQuery.actionName + '"-Action argument "start" must be "top" or "end" - invalid value!', _classQuery.element);
					}
				}
			} else {
				if (_classQuery.actionArguments.length > 0) {
					if (_classQuery.actionArguments[0] === 'auto' || _classQuery.actionArguments[0] === 'smooth') {
						scrollOptions.behavior = _classQuery.actionArguments[0];
					} else {
						classQuery.error('"' + _classQuery.actionName + '"-Action argument "behavior" must be "auto" or "smooth" - invalid value!', _classQuery.element);
					}
				}

				if (_classQuery.actionArguments.length === 2) {
					if (_classQuery.actionArguments[1] === 'start' || _classQuery.actionArguments[1] === 'end') {
						scrollOptions.block = _classQuery.actionArguments[1];
					} else {
						classQuery.error('"' + _classQuery.actionName + '"-Action argument "position" must be "start" or "end" - invalid value!', _classQuery.element);
					}
				}
			}

			elements[i].scrollIntoView(scrollOptions);
		}
	}

	action_trigger(_classQuery) {
		let eventName = '';

		if (_classQuery.areActionArgumentsExternal) {
			if (!_classQuery.actionArguments.event) {
				classQuery.error('"' + _classQuery.actionName + '"-Action has no argument "event"!', _classQuery.element);
			}

			eventName = _classQuery.actionArguments.event;
		} else {
			if (_classQuery.actionArguments.length !== 1) {
				classQuery.error('"' + _classQuery.actionName + '"-Action requires only 1 argument!', _classQuery.element);
			}

			eventName = _classQuery.actionArguments[0];
		}

		let elements = _classQuery.selector();
		let eventToTrigger = new Event(eventName);

		for (let i = 0; i < elements.length; i++) {
			elements[i].dispatchEvent(eventToTrigger);
		}
	}



	/*
	SELECTORS - the third part of the classQuery (id, class, name, tagname, ...); CSS selectors
	*/

	selector_id(_classQuery) {
		return [document.getElementById(_classQuery.selectorElement)];
	}

	selector_class(_classQuery) {
		return document.getElementsByClassName(_classQuery.selectorElement);
	}

	selector_name(_classQuery) {
		return document.getElementsByName(_classQuery.selectorElement);
	}

	selector_tag(_classQuery) {
		return document.getElementsByTagName(_classQuery.selectorElement);
	}

	selector_self(_classQuery) {
		return [_classQuery.element];
	}

	selector_parent(_classQuery) {
		return [_classQuery.element.parentElement];
	}



	/*
	OTHER STUFF - like log and throw
	*/

	static log(message) {
		console.log(message);
	}

	static error(message, referenceElement = false) {
		if (referenceElement) {
			console.error(message, referenceElement);
		} else {
			console.error(message);
		}

		throw new Error('An error occured!  (See above)');
	}
}