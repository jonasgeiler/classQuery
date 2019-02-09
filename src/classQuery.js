/*
Notes:

cq_event_addClass-theClassToAdd_id-test
'_' is for splitting the different parts of the classQuery
'-' is for splitting the different parameter of the parts

*/

/*
TODO:
- preventDefault for non-special events
- duplicate: Where the copied element appears
- trigger: Fix the seperation of built-in events (click on link) and custom events (onclick)
- Page freeze:
  <div>
    <input name="test[]" type="text" class="testInput">
  </div>
  <button class="cq_click_duplicate_class-testInput">I need more input fields!</button>
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

		classQueryElements.forEach(element => {
			element.classList.forEach(elementClass => {
				if (elementClass.startsWith('cq_')) {
					let newClassQuery = {};
					newClassQuery.query = elementClass;
					newClassQuery.element = element;

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

	/**
	 * This event emits, when the classQuery-class gets initialized.
	 * So basically when the page finished loading.
	 *
	 * @cq_part event
	 * @cq_partName init
	 * @cq_example
	 * - Hide an element by at page load: `cq_init_hide_self`
	 */
	event_init(_classQuery) {
		_classQuery.action();
	}




	/*
	ACTIONS - the second part of the classQuery (show, hide, remove, ...); DOM Manipulations
	*/


	/**
	 * Un-hide an element.
	 * (Removes `display: none` style and replaces it with `display: inherit`)
	 *
	 * @cq_part action
	 * @cq_partName show
	 * @cq_examples
	 * - Show element with id "notifications" at button click: `cq_click_show_id-notifications`
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

	/**
	 * Hide an element.
	 * (Adds `display: none`)
	 *
	 * @cq_part action
	 * @cq_partName hide
	 * @cq_examples
	 * - Hide element with id "notifications" at button click: `cq_click_hide_id-notifications`
	 */
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

	/**
	 * Adds one or more classes to an element.
	 *
	 * @cq_part action
	 * @cq_partName addClass
	 * @cq_arg classes A list of classes to add.
	 * Space-separated if external argument.
	 * Hyphen-separated if non-external argument.
	 * @cq_examples
	 * - Add the class 'active' to self at double click: `cq_dblclick_addClass-active_self`
	 * - Add the classes 'active' and 'awesome' to self at double click: `cq_dblclick_addClass-active-awesome_self`
	 * - Add the class 'is-active' to self at double click:
	 *   ```html
	 *   <li class="cq_dblclick_addClass--_self" data-classes="is-active">Menu Item</li>
	 *   ```
	 */
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

	/**
	 * Removes one or more classes from an element.
	 *
	 * @cq_part action
	 * @cq_partName removeClass
	 * @cq_arg classes A list of classes to remove.
	 * Space-separated if external argument.
	 * Hyphen-separated if non-external argument.
	 * @cq_examples
	 * - Remove the class 'active' from self at double click: `cq_dblclick_removeClass-active_self`
	 * - Remove the classes 'active' and 'awesome' from self at double click: `cq_dblclick_removeClass-active-awesome_self`
	 * - Remove the class 'is-active' from self at double click:
	 *   ```html
	 *   <li class="cq_dblclick_removeClass--_self" data-classes="is-active">Menu Item</li>
	 *   ```
	 */
	action_removeClass(_classQuery) {
		if (!_classQuery.areActionArgumentsExternal && _classQuery.actionArguments.length < 1) {
			classQuery.error('"' + _classQuery.actionName + '"-Action requires at least 1 argument!', _classQuery.element);
		}

		let elements = _classQuery.selector();

		for (let i = 0; i < elements.length; i++) {
			if (_classQuery.areActionArgumentsExternal) {
				_classQuery.actionArguments.classes.split(' ').forEach(classToRemove => {
					elements[i].classList.remove(classToRemove);
				});
			} else {
				_classQuery.actionArguments.forEach(classToRemove => {
					elements[i].classList.remove(classToRemove);
				});
			}
		}
	}

	/**
	 * Toggles one or more classes on an element.
	 * If the element already has the class, remove it.
	 * If the element doesn't have the class, add it.
	 *
	 * @cq_part action
	 * @cq_partName toggleClass
	 * @cq_arg classes A list of classes to toggle.
	 * Space-separated if external argument.
	 * Hyphen-separated if non-external argument.
	 * @cq_examples
	 * - Toggle the class 'active' on self at double click: `cq_dblclick_toggleClass-active_self`
	 * - Toggle the classes 'active' and 'awesome' on self at double click: `cq_dblclick_toggleClass-active-awesome_self`
	 * - Toggle the class 'is-active' on self at double click:
	 *   ```html
	 *   <li class="cq_dblclick_toggleClass--_self" data-classes="is-active">Menu Item</li>
	 *   ```
	 */
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

	/**
	 * Set the attribute on an element to a specific value.
	 *
	 * @cq_part action
	 * @cq_partName setAttribute
	 * @cq_arg attributeName The name of the attribute to set.
	 * For example 'disabled'.
	 * @cq_arg attributeValue The value to set the attribute to.
	 * For example 'true' (when attributeName is 'disabled').
	 * @cq_examples
	 * - Set language attribute on the HTML tag when clicked on a button:
	 *   ```html
	 *   <html lang="en">
	 *     <body>
	 *       <button class="cq_click_setAttribute-lang-en_tag-html">Switch to English</button>
	 *       <button class="cq_click_setAttribute-lang-de_tag-html">Switch to German</button>
	 *       <button class="cq_click_setAttribute-lang-fr_tag-html">Switch to French</button>
	 *     </body>
	 *   </html>
	 *   ```
	 * - Set a link when double clicked on a button:
	 *   ```html
	 *   <a name="link" href="#" target="_blank">This is a link</a>
	 *
	 *   <button class="cq_click_setAttribute--_name-link" data-attributeName="href" data-attributeValue="https://google.com">Change link</button>
	 *   ```
	 */
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

	/**
	 * Remove an attribute from an element.
	 *
	 * @cq_part action
	 * @cq_partName removeAttribute
	 * @cq_arg attributeName The name of the attribute to remove.
	 * For example 'disabled'.
	 * @cq_examples
	 * - Un-disable another element on click: `cq_click_removeAttribute-disabled_id-otherElement`
	 */
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

	/**
	 * Removes all children of an element.
	 * (Sets innerHTML to '')
	 *
	 * @cq_part action
	 * @cq_partName empty
	 * @cq_examples
	 * - Clear all table data at click: `cq_click_empty_tag-tbody`
	 */
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

	/**
	 * Duplicate an element.
	 * (Insert a copy of an element after the copied element)
	 *
	 * @cq_part action
	 * @cq_partName duplicate
	 * @cq_examples
	 * - Additional fields in form:
	 *   ```html
	 *   <div id="form">
	 *     <div id="inputFields">
	 *       <input name="test[]" type="text" id="testInput">
	 *     </div>
	 *
	 *     <button class="cq_click_duplicate_id-testInput">I need more input fields!</button>
	 *   </div>
	 *   ```
	 */
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

	/**
	 * Completely remove an element.
	 *
	 * @cq_part action
	 * @cq_partName remove
	 * @cq_examples
	 * - Dismiss notification:
	 *   ```html
	 *   <div class="notification">
	 *     <button class="cq_click_remove_parent">×</button>
	 *
	 *     <p class="notification-content">
	 *       Some content ...
	 *     </p>
	 *   </div>
	 *   ```
	 */
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

	/**
	 * Scroll an element into view.
	 *
	 * @cq_part action
	 * @cq_partName scrollTo
	 * @cq_arg behavior How to scroll. Either 'auto' or 'smooth'.
	 * Look [here](https://developer.mozilla.org/de/docs/Web/API/Element/scrollIntoView) for more information!
	 * @cq_arg position The position in the view to scroll to. Either 'start' or 'end'.
	 * Look [here](https://developer.mozilla.org/de/docs/Web/API/Element/scrollIntoView) for more information!
	 * (Referenced as 'block', not 'position', there.)
	 * @cq_examples
	 * - Smoothly scroll to different parts of the website:
	 *   ```html
	 *   <a href="#" class="cq_click_scrollTo-smooth-start_id-introduction">Go to introduction</a>
	 *   <a href="#" class="cq_click_scrollTo-smooth_id-contact">Go to contact form</a>
	 *   <a href="#" class="cq_click_scrollTo-smooth-end_id-members">Go to members list</a>
	 *
	 *   <!-- Some other content ... -->
	 *
	 *   <div id="introduction">
	 *     This is the introduction!
	 *   </div>
	 *
	 *   <div id="contact">
	 *     This is a contact form.
	 *   </div>
	 *
	 *   <div class="members">
	 *     This is a list with all members.
	 *   </div>
	 *   ```
	 */
	action_scrollTo(_classQuery) {
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
						classQuery.error('"' + _classQuery.actionName + '"-Action argument "position" must be "start" or "end" - invalid value!', _classQuery.element);
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

	/**
	 * Trigger an event on an element.
	 *
	 * @cq_part action
	 * @cq_partName trigger
	 * @cq_arg event The event to trigger.
	 * For example 'click'.
	 * @cq_examples
	 * - Trigger submit in a form:
	 *   ```html
	 *   <form action="/login" method="post">
	 *     <input name="username" type="text">
	 *
	 *     <input type="submit" id="submitForm">
	 *   </form>
	 *
	 *   <a href="#" class="cq_click_trigger-click_id-submitForm">Trigger submit!</a>
	 *   ```
	 *   Note: At the time of writing, this example does not work, due to a bug.
	 *
	 */
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


	/**
	 * Select an element by it's id.
	 * (Similar to the `#`-sign in css)
	 *
	 * @cq_part selector
	 * @cq_partName id
	 */
	selector_id(_classQuery) {
		return [document.getElementById(_classQuery.selectorElement)];
	}

	/**
	 * Select all elements within the same class.
	 * (Similar to the `.`-sign in css)
	 *
	 * @cq_part selector
	 * @cq_partName class
	 */
	selector_class(_classQuery) {
		return document.getElementsByClassName(_classQuery.selectorElement);
	}

	/**
	 * Select an element by it's name.
	 * (Similar to the `*[name='<theName>']`-selector in css)
	 *
	 * @cq_part selector
	 * @cq_partName name
	 */
	selector_name(_classQuery) {
		return document.getElementsByName(_classQuery.selectorElement);
	}

	/**
	 * Select all elements of the same tag name.
	 *
	 * @cq_part selector
	 * @cq_partName tag
	 */
	selector_tag(_classQuery) {
		return document.getElementsByTagName(_classQuery.selectorElement);
	}

	/**
	 * Select the element where the classQuery is.
	 *
	 * @cq_part selector
	 * @cq_partName self
	 */
	selector_self(_classQuery) {
		return [_classQuery.element];
	}

	/**
	 * Select the parent of the element where the classQuery is.
	 *
	 * @cq_part selector
	 * @cq_partName parent
	 */
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