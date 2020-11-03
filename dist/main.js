/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*!
 * Strongly Typed Events for TypeScript
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ste_core_1 = __webpack_require__(1);
exports.DispatcherBase = ste_core_1.DispatcherBase;
exports.DispatcherWrapper = ste_core_1.DispatcherWrapper;
exports.EventListBase = ste_core_1.EventListBase;
exports.Subscription = ste_core_1.Subscription;
var ste_events_1 = __webpack_require__(5);
exports.EventDispatcher = ste_events_1.EventDispatcher;
exports.EventHandlingBase = ste_events_1.EventHandlingBase;
exports.EventList = ste_events_1.EventList;
exports.NonUniformEventList = ste_events_1.NonUniformEventList;
var ste_simple_events_1 = __webpack_require__(7);
exports.SimpleEventDispatcher = ste_simple_events_1.SimpleEventDispatcher;
exports.SimpleEventHandlingBase = ste_simple_events_1.SimpleEventHandlingBase;
exports.SimpleEventList = ste_simple_events_1.SimpleEventList;
exports.NonUniformSimpleEventList = ste_simple_events_1.NonUniformSimpleEventList;
var ste_signals_1 = __webpack_require__(9);
exports.SignalDispatcher = ste_signals_1.SignalDispatcher;
exports.SignalHandlingBase = ste_signals_1.SignalHandlingBase;
exports.SignalList = ste_signals_1.SignalList;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dispatching_1 = __webpack_require__(3);
exports.DispatcherBase = dispatching_1.DispatcherBase;
exports.DispatcherWrapper = dispatching_1.DispatcherWrapper;
exports.EventListBase = dispatching_1.EventListBase;
var subscription_1 = __webpack_require__(2);
exports.Subscription = subscription_1.Subscription;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Stores a handler. Manages execution meta data.
 * @class Subscription
 * @template TEventHandler
 */
var Subscription = /** @class */ (function () {
    /**
     * Creates an instance of Subscription.
     *
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     */
    function Subscription(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     */
    Subscription.prototype.execute = function (executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(function () {
                    fn.apply(scope, args);
                }, 1);
            }
            else {
                fn.apply(scope, args);
            }
        }
    };
    return Subscription;
}());
exports.Subscription = Subscription;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var management_1 = __webpack_require__(4);
var subscription_1 = __webpack_require__(2);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 */
var DispatcherBase = /** @class */ (function () {
    function DispatcherBase() {
        this._wrap = new DispatcherWrapper(this);
        this._subscriptions = new Array();
    }
    Object.defineProperty(DispatcherBase.prototype, "count", {
        /**
         * Returns the number of subscriptions.
         *
         * @readonly
         *
         * @memberOf DispatcherBase
         */
        get: function () {
            return this._subscriptions.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    DispatcherBase.prototype.subscribe = function (fn) {
        var _this = this;
        if (fn) {
            this._subscriptions.push(new subscription_1.Subscription(fn, false));
        }
        return function () {
            _this.unsubscribe(fn);
        };
    };
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    DispatcherBase.prototype.sub = function (fn) {
        return this.subscribe(fn);
    };
    /**
     * Subscribe once to the event with the specified name.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    DispatcherBase.prototype.one = function (fn) {
        var _this = this;
        if (fn) {
            this._subscriptions.push(new subscription_1.Subscription(fn, true));
        }
        return function () {
            _this.unsubscribe(fn);
        };
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param fn The event handler.
     */
    DispatcherBase.prototype.has = function (fn) {
        if (!fn)
            return false;
        return this._subscriptions.some(function (sub) { return sub.handler == fn; });
    };
    /**
     * Unsubscribes the handler from the dispatcher.
     * @param fn The event handler.
     */
    DispatcherBase.prototype.unsubscribe = function (fn) {
        if (!fn)
            return;
        for (var i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                break;
            }
        }
    };
    /**
     * Unsubscribes the handler from the dispatcher.
     * @param fn The event handler.
     */
    DispatcherBase.prototype.unsub = function (fn) {
        this.unsubscribe(fn);
    };
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} The scope the scope of the event. The scope becomes the "this" for handler.
     * @param {IArguments} args The arguments for the event.
     */
    DispatcherBase.prototype._dispatch = function (executeAsync, scope, args) {
        var _this = this;
        var _loop_1 = function (sub) {
            var ev = new management_1.EventManagement(function () { return _this.unsub(sub.handler); });
            var nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            sub.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this_1.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return "break";
            }
        };
        var this_1 = this;
        //execute on a copy because of bug #9
        for (var _i = 0, _a = __spreadArrays(this._subscriptions); _i < _a.length; _i++) {
            var sub = _a[_i];
            var state_1 = _loop_1(sub);
            if (state_1 === "break")
                break;
        }
    };
    /**
     * Cleans up subs that ran and should run only once.
     */
    DispatcherBase.prototype.cleanup = function (sub) {
        if (sub.isOnce && sub.isExecuted) {
            var i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
            }
        }
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    DispatcherBase.prototype.asEvent = function () {
        return this._wrap;
    };
    /**
     * Clears all the subscriptions.
     */
    DispatcherBase.prototype.clear = function () {
        this._subscriptions.splice(0, this._subscriptions.length);
    };
    return DispatcherBase;
}());
exports.DispatcherBase = DispatcherBase;
/**
 * Base class for event lists classes. Implements the get and remove.
 */
var EventListBase = /** @class */ (function () {
    function EventListBase() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    EventListBase.prototype.get = function (name) {
        var event = this._events[name];
        if (event) {
            return event;
        }
        event = this.createDispatcher();
        this._events[name] = event;
        return event;
    };
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    EventListBase.prototype.remove = function (name) {
        delete this._events[name];
    };
    return EventListBase;
}());
exports.EventListBase = EventListBase;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 */
var DispatcherWrapper = /** @class */ (function () {
    /**
     * Creates a new EventDispatcherWrapper instance.
     * @param dispatcher The dispatcher.
     */
    function DispatcherWrapper(dispatcher) {
        this._subscribe = function (fn) { return dispatcher.subscribe(fn); };
        this._unsubscribe = function (fn) { return dispatcher.unsubscribe(fn); };
        this._one = function (fn) { return dispatcher.one(fn); };
        this._has = function (fn) { return dispatcher.has(fn); };
        this._clear = function () { return dispatcher.clear(); };
        this._count = function () { return dispatcher.count; };
    }
    Object.defineProperty(DispatcherWrapper.prototype, "count", {
        /**
         * Returns the number of subscriptions.
         *
         * @readonly
         * @type {number}
         * @memberOf DispatcherWrapper
         */
        get: function () {
            return this._count();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    DispatcherWrapper.prototype.subscribe = function (fn) {
        return this._subscribe(fn);
    };
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    DispatcherWrapper.prototype.sub = function (fn) {
        return this.subscribe(fn);
    };
    /**
     * Unsubscribe from the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.unsubscribe = function (fn) {
        this._unsubscribe(fn);
    };
    /**
     * Unsubscribe from the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.unsub = function (fn) {
        this.unsubscribe(fn);
    };
    /**
     * Subscribe once to the event with the specified name.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.one = function (fn) {
        return this._one(fn);
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param fn The event handler.
     */
    DispatcherWrapper.prototype.has = function (fn) {
        return this._has(fn);
    };
    /**
     * Clears all the subscriptions.
     */
    DispatcherWrapper.prototype.clear = function () {
        this._clear();
    };
    return DispatcherWrapper;
}());
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Allows the user to interact with the event.
 *
 * @class EventManagement
 * @implements {IEventManagement}
 */
var EventManagement = /** @class */ (function () {
    function EventManagement(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    EventManagement.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };
    return EventManagement;
}());
exports.EventManagement = EventManagement;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(6);
exports.EventDispatcher = events_1.EventDispatcher;
exports.EventHandlingBase = events_1.EventHandlingBase;
exports.EventList = events_1.EventList;
exports.NonUniformEventList = events_1.NonUniformEventList;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ste_core_1 = __webpack_require__(1);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 */
var EventDispatcher = /** @class */ (function (_super) {
    __extends(EventDispatcher, _super);
    /**
     * Creates a new EventDispatcher instance.
     */
    function EventDispatcher() {
        return _super.call(this) || this;
    }
    /**
     * Dispatches the event.
     * @param sender The sender.
     * @param args The arguments object.
     */
    EventDispatcher.prototype.dispatch = function (sender, args) {
        this._dispatch(false, this, arguments);
    };
    /**
     * Dispatches the events thread.
     * @param sender The sender.
     * @param args The arguments object.
     */
    EventDispatcher.prototype.dispatchAsync = function (sender, args) {
        this._dispatch(true, this, arguments);
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    EventDispatcher.prototype.asEvent = function () {
        return _super.prototype.asEvent.call(this);
    };
    return EventDispatcher;
}(ste_core_1.DispatcherBase));
exports.EventDispatcher = EventDispatcher;
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
var NonUniformEventList = /** @class */ (function () {
    function NonUniformEventList() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    NonUniformEventList.prototype.get = function (name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        var event = this.createDispatcher();
        this._events[name] = event;
        return event;
    };
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    NonUniformEventList.prototype.remove = function (name) {
        delete this._events[name];
    };
    /**
     * Creates a new dispatcher instance.
     */
    NonUniformEventList.prototype.createDispatcher = function () {
        return new EventDispatcher();
    };
    return NonUniformEventList;
}());
exports.NonUniformEventList = NonUniformEventList;
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
var EventList = /** @class */ (function (_super) {
    __extends(EventList, _super);
    /**
     * Creates a new EventList instance.
     */
    function EventList() {
        return _super.call(this) || this;
    }
    /**
     * Creates a new dispatcher instance.
     */
    EventList.prototype.createDispatcher = function () {
        return new EventDispatcher();
    };
    return EventList;
}(ste_core_1.EventListBase));
exports.EventList = EventList;
/**
 * Extends objects with event handling capabilities.
 */
var EventHandlingBase = /** @class */ (function () {
    function EventHandlingBase() {
        this._events = new EventList();
    }
    Object.defineProperty(EventHandlingBase.prototype, "events", {
        /**
         * Gets the list with all the event dispatchers.
         */
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.subscribe = function (name, fn) {
        this._events.get(name).subscribe(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.sub = function (name, fn) {
        this.subscribe(name, fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.unsubscribe = function (name, fn) {
        this._events.get(name).unsubscribe(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.unsub = function (name, fn) {
        this.unsubscribe(name, fn);
    };
    /**
     * Subscribes to once the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.one = function (name, fn) {
        this._events.get(name).one(fn);
    };
    /**
     * Subscribes to once the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.has = function (name, fn) {
        return this._events.get(name).has(fn);
    };
    return EventHandlingBase;
}());
exports.EventHandlingBase = EventHandlingBase;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var simple_events_1 = __webpack_require__(8);
exports.SimpleEventDispatcher = simple_events_1.SimpleEventDispatcher;
exports.SimpleEventHandlingBase = simple_events_1.SimpleEventHandlingBase;
exports.SimpleEventList = simple_events_1.SimpleEventList;
exports.NonUniformSimpleEventList = simple_events_1.NonUniformSimpleEventList;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ste_core_1 = __webpack_require__(1);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 */
var SimpleEventDispatcher = /** @class */ (function (_super) {
    __extends(SimpleEventDispatcher, _super);
    /**
     * Creates a new SimpleEventDispatcher instance.
     */
    function SimpleEventDispatcher() {
        return _super.call(this) || this;
    }
    /**
     * Dispatches the event.
     * @param args The arguments object.
     */
    SimpleEventDispatcher.prototype.dispatch = function (args) {
        this._dispatch(false, this, arguments);
    };
    /**
     * Dispatches the events thread.
     * @param args The arguments object.
     */
    SimpleEventDispatcher.prototype.dispatchAsync = function (args) {
        this._dispatch(true, this, arguments);
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    SimpleEventDispatcher.prototype.asEvent = function () {
        return _super.prototype.asEvent.call(this);
    };
    return SimpleEventDispatcher;
}(ste_core_1.DispatcherBase));
exports.SimpleEventDispatcher = SimpleEventDispatcher;
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
var NonUniformSimpleEventList = /** @class */ (function () {
    function NonUniformSimpleEventList() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    NonUniformSimpleEventList.prototype.get = function (name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        var event = this.createDispatcher();
        this._events[name] = event;
        return event;
    };
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    NonUniformSimpleEventList.prototype.remove = function (name) {
        delete this._events[name];
    };
    /**
     * Creates a new dispatcher instance.
     */
    NonUniformSimpleEventList.prototype.createDispatcher = function () {
        return new SimpleEventDispatcher();
    };
    return NonUniformSimpleEventList;
}());
exports.NonUniformSimpleEventList = NonUniformSimpleEventList;
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
var SimpleEventList = /** @class */ (function (_super) {
    __extends(SimpleEventList, _super);
    /**
     * Creates a new SimpleEventList instance.
     */
    function SimpleEventList() {
        return _super.call(this) || this;
    }
    /**
     * Creates a new dispatcher instance.
     */
    SimpleEventList.prototype.createDispatcher = function () {
        return new SimpleEventDispatcher();
    };
    return SimpleEventList;
}(ste_core_1.EventListBase));
exports.SimpleEventList = SimpleEventList;
/**
 * Extends objects with simple event handling capabilities.
 */
var SimpleEventHandlingBase = /** @class */ (function () {
    function SimpleEventHandlingBase() {
        this._events = new SimpleEventList();
    }
    Object.defineProperty(SimpleEventHandlingBase.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.subscribe = function (name, fn) {
        this._events.get(name).subscribe(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.sub = function (name, fn) {
        this.subscribe(name, fn);
    };
    /**
     * Subscribes once to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.one = function (name, fn) {
        this._events.get(name).one(fn);
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.has = function (name, fn) {
        return this._events.get(name).has(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.unsubscribe = function (name, fn) {
        this._events.get(name).unsubscribe(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.unsub = function (name, fn) {
        this.unsubscribe(name, fn);
    };
    return SimpleEventHandlingBase;
}());
exports.SimpleEventHandlingBase = SimpleEventHandlingBase;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var signals_1 = __webpack_require__(10);
exports.SignalDispatcher = signals_1.SignalDispatcher;
exports.SignalHandlingBase = signals_1.SignalHandlingBase;
exports.SignalList = signals_1.SignalList;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ste_core_1 = __webpack_require__(1);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 */
var SignalDispatcher = /** @class */ (function (_super) {
    __extends(SignalDispatcher, _super);
    /**
     * Creates a new SignalDispatcher instance.
     */
    function SignalDispatcher() {
        return _super.call(this) || this;
    }
    /**
     * Dispatches the signal.
     */
    SignalDispatcher.prototype.dispatch = function () {
        this._dispatch(false, this, arguments);
    };
    /**
     * Dispatches the signal threaded.
     */
    SignalDispatcher.prototype.dispatchAsync = function () {
        this._dispatch(true, this, arguments);
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    SignalDispatcher.prototype.asEvent = function () {
        return _super.prototype.asEvent.call(this);
    };
    return SignalDispatcher;
}(ste_core_1.DispatcherBase));
exports.SignalDispatcher = SignalDispatcher;
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 */
var SignalList = /** @class */ (function (_super) {
    __extends(SignalList, _super);
    /**
     * Creates a new SignalList instance.
     */
    function SignalList() {
        return _super.call(this) || this;
    }
    /**
     * Creates a new dispatcher instance.
     */
    SignalList.prototype.createDispatcher = function () {
        return new SignalDispatcher();
    };
    return SignalList;
}(ste_core_1.EventListBase));
exports.SignalList = SignalList;
/**
 * Extends objects with signal event handling capabilities.
 */
var SignalHandlingBase = /** @class */ (function () {
    function SignalHandlingBase() {
        this._events = new SignalList();
    }
    Object.defineProperty(SignalHandlingBase.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes once to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.one = function (name, fn) {
        this._events.get(name).one(fn);
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.has = function (name, fn) {
        return this._events.get(name).has(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.subscribe = function (name, fn) {
        this._events.get(name).subscribe(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.sub = function (name, fn) {
        this.subscribe(name, fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.unsubscribe = function (name, fn) {
        this._events.get(name).unsubscribe(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.unsub = function (name, fn) {
        this.unsubscribe(name, fn);
    };
    return SignalHandlingBase;
}());
exports.SignalHandlingBase = SignalHandlingBase;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/ts/app/utils/custom-methods.ts
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var body = document.body;
var enGrid = document.getElementById("engrid");
var enInput = function () {
  /* @TODO */

  /************************************
   * Globablly Scoped Constants and Variables
   ***********************************/
  // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
  // @TODO A "Not" condition is needed for #en__field_transaction_email because someone could name their email opt in "Email" and it will get the .en_field--email class generated for it
  // get DOM elements
  var init = function init() {
    var formInput = document.querySelectorAll(".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox");
    var otherInputs = document.querySelectorAll(".en__field__input--other");
    Array.from(formInput).forEach(function (e) {
      // @TODO Currently checkboxes always return as having a value, since they do but they're just not checked. Need to update and account for that, should also do Radio's while we're at it
      var element = e.querySelector("input, textarea, select");

      if (element && element.value) {
        e.classList.add("has-value");
      }

      bindEvents(e);
    });
    /* @TODO */

    /************************************
     * Automatically select other radio input when an amount is entered into it.
     ***********************************/

    Array.from(otherInputs).forEach(function (e) {
      ["focus", "input"].forEach(function (evt) {
        e.addEventListener(evt, function (ev) {
          var target = ev.target;

          if (target && target.parentNode && target.parentNode.parentNode) {
            var targetWrapper = target.parentNode;
            targetWrapper.classList.remove("en__field__item--hidden");

            if (targetWrapper.parentNode) {
              var lastRadioInput = targetWrapper.parentNode.querySelector(".en__field__item:nth-last-child(2) input");
              lastRadioInput.checked = !0;
            }
          }
        }, false);
      });
    });
  };

  return {
    init: init
  };
}();
var setBackgroundImages = function setBackgroundImages(bg) {
  console.log("Backgroud", bg); // Find Inline Background Image, hide it, and set it as the background image.

  var pageBackground = document.querySelector(".page-backgroundImage");
  var pageBackgroundImg = document.querySelector(".page-backgroundImage img");
  var pageBackgroundLegacyImg = document.querySelector(".background-image p");
  var pageBackgroundImgSrc = ""; // let pageBackgroundImgSrc: any = null;

  var contentFooter = document.querySelector(".content-footer");
  /*!
   * Determine if an element is in the viewport
   * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}    elem The element
   * @return {Boolean}      Returns true if element is in the viewport
   */

  var isInViewport = function isInViewport(e) {
    var distance = e.getBoundingClientRect(); // console.log("Footer: ", distance);

    return distance.top >= 0 && distance.left >= 0 && distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) && distance.right <= (window.innerWidth || document.documentElement.clientWidth);
  }; // If we find a image on the page, we don't care about the hardcoded options
  // Find the background image


  if (pageBackgroundImg) {
    //@TODO consider moving JS into page template as it's critical to initial render
    //Measure page layout to see if it's a short or tall page before applying the background image
    if (contentFooter && isInViewport(contentFooter)) {
      body.classList.add("footer-above-fold");
    } else {
      body.classList.add("footer-below-fold");
    }

    pageBackgroundImgSrc = pageBackgroundImg.src;
    pageBackgroundImg.style.display = "none";
  } else if (pageBackgroundLegacyImg) {
    // Support for legacy pages
    pageBackgroundImgSrc = pageBackgroundLegacyImg.innerHTML;
    pageBackgroundLegacyImg.style.display = "none";
  } else {
    // Fallback Image
    if (Array.isArray(bg)) {
      pageBackgroundImgSrc = bg[Math.floor(Math.random() * bg.length)];
    }
  } // Set the background image


  if (pageBackground && pageBackgroundImgSrc) {
    pageBackground.style.backgroundImage = "url(" + pageBackgroundImgSrc + ")";
  }
};
var bindEvents = function bindEvents(e) {
  /* @TODO */

  /************************************
   * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
   * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
   * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
   ***********************************/
  // Occurs when an input field gets focus
  var handleFocus = function handleFocus(e) {
    var target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      var targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.add("has-focus");
    }
  }; // Occurs when a user leaves an input field


  var handleBlur = function handleBlur(e) {
    var target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      var targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.remove("has-focus");

      if (target.value) {
        targetWrapper.classList.add("has-value");
      } else {
        targetWrapper.classList.remove("has-value");
      }
    }
  }; // Occurs when a user changes the selected option of a <select> element


  var handleChange = function handleChange(e) {
    var target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      var targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.add("has-value");
    }
  }; // Occurs when a text or textarea element gets user input


  var handleInput = function handleInput(e) {
    var target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      var targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.add("has-value");
    }
  }; // Occurs on browser autofill of fields


  var onAutoFillStart = function onAutoFillStart(e) {
    e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
  };

  var onAutoFillCancel = function onAutoFillCancel(e) {
    return e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");
  };

  var onAnimationStart = function onAnimationStart(e) {
    var target = e.target;
    var animation = e.animationName;

    switch (animation) {
      case "onAutoFillStart":
        return onAutoFillStart(target);

      case "onAutoFillCancel":
        return onAutoFillCancel(target);
    }
  };

  var enField = e.querySelector("input, textarea, select");

  if (enField) {
    enField.addEventListener("focus", handleFocus);
    enField.addEventListener("blur", handleBlur);
    enField.addEventListener("change", handleChange);
    enField.addEventListener("input", handleInput);
    enField.addEventListener("animationstart", onAnimationStart);
  }
};
var debugBar = function debugBar() {
  if (window.location.search.indexOf("mode=DEMO") > -1 || window.location.href.indexOf("debug") != -1 || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    body.classList.add("debug");

    if (enGrid) {
      enGrid.insertAdjacentHTML("beforebegin", '<span id="debug-bar">' + '<span id="info-wrapper">' + "<span>DEBUG BAR</span>" + "</span>" + '<span id="buttons-wrapper">' + '<span id="debug-close">X</span>' + "</span>" + "</span>");
    }

    if (window.location.search.indexOf("mode=DEMO") > -1) {
      var infoWrapper = document.getElementById("info-wrapper");
      var buttonsWrapper = document.getElementById("buttons-wrapper");

      if (infoWrapper) {
        // console.log(window.performance);
        var now = new Date().getTime();
        var initialPageLoad = (now - performance.timing.navigationStart) / 1000;
        var domInteractive = initialPageLoad + (now - performance.timing.domInteractive) / 1000;
        infoWrapper.insertAdjacentHTML("beforeend", "<span>Initial Load: " + initialPageLoad + "s</span>" + "<span>DOM Interactive: " + domInteractive + "s</span>");

        if (buttonsWrapper) {
          buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' + '<button id="page-edit" type="button">Edit in PageBuilder (BETA)</button>');
        }
      }
    }

    if (window.location.href.indexOf("debug") != -1 || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      var _buttonsWrapper = document.getElementById("buttons-wrapper");

      if (_buttonsWrapper) {
        _buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' + '<button id="fancy-errors-toggle" type="button">Toggle Fancy Errors</button>' + '<button id="float-labels-toggle" type="button">Toggle Float Lables</button>');
      }
    }

    if (document.getElementById("fancy-errors-toggle")) {
      var debugTemplateButton = document.getElementById("fancy-errors-toggle");

      if (debugTemplateButton) {
        debugTemplateButton.addEventListener("click", function () {
          fancyErrorsToggle();
        }, false);
      }
    }

    if (document.getElementById("float-labels-toggle")) {
      var _debugTemplateButton = document.getElementById("float-labels-toggle");

      if (_debugTemplateButton) {
        _debugTemplateButton.addEventListener("click", function () {
          floatLabelsToggle();
        }, false);
      }
    }

    if (document.getElementById("layout-toggle")) {
      var _debugTemplateButton2 = document.getElementById("layout-toggle");

      if (_debugTemplateButton2) {
        _debugTemplateButton2.addEventListener("click", function () {
          layoutToggle();
        }, false);
      }
    }

    if (document.getElementById("page-edit")) {
      var _debugTemplateButton3 = document.getElementById("page-edit");

      if (_debugTemplateButton3) {
        _debugTemplateButton3.addEventListener("click", function () {
          pageEdit();
        }, false);
      }
    }

    if (document.getElementById("debug-close")) {
      var _debugTemplateButton4 = document.getElementById("debug-close");

      if (_debugTemplateButton4) {
        _debugTemplateButton4.addEventListener("click", function () {
          debugClose();
        }, false);
      }
    }

    var fancyErrorsToggle = function fancyErrorsToggle() {
      enGrid.classList.toggle("fancy-errors");
    };

    var floatLabelsToggle = function floatLabelsToggle() {
      enGrid.classList.toggle("float-labels");
    };

    var pageEdit = function pageEdit() {
      window.location.href = window.location.href + "?edit";
    };

    var layoutToggle = function layoutToggle() {
      if (enGrid) {
        if (enGrid.classList.contains("layout-centerleft1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col");
        } else if (enGrid.classList.contains("layout-centercenter1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col-wide");
        } else if (enGrid.classList.contains("layout-centercenter1col-wide")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerright1col");
        } else if (enGrid.classList.contains("layout-centerright1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerleft1col");
        } else {
          console.log("While trying to switch layouts, something unexpected happen.");
        }
      }
    };

    var debugClose = function debugClose() {
      body.classList.remove("debug");
      var debugBar = document.getElementById("debug-bar");

      if (debugBar) {
        debugBar.style.display = "none";
      }
    };

    var removeClassesByPrefix = function removeClassesByPrefix(el, prefix) {
      for (var i = el.classList.length - 1; i >= 0; i--) {
        if (el.classList[i].startsWith(prefix)) {
          el.classList.remove(el.classList[i]);
        }
      }
    };
  }
};
var inputPlaceholder = function inputPlaceholder() {
  var enGridFloatLabels = document.querySelector("#engrid:not(.float-labels)");

  if (enGridFloatLabels) {
    var enFieldDonationAmt = document.querySelector(".en__field--donationAmt.en__field--withOther .en__field__input--other"); // const enFieldFirstName = document.querySelector("#en__field_supporter_firstName") as HTMLInputElement;
    // const enFieldLastName = document.querySelector("#en__field_supporter_lastName") as HTMLInputElement;
    // const enFieldEmailAddress = document.querySelector("#en__field_supporter_emailAddress") as HTMLInputElement;
    // const enFieldPhoneNumber = document.querySelector("#en__field_supporter_phoneNumber") as HTMLInputElement;

    var enFieldPhoneNumber2 = document.querySelector("#en__field_supporter_phoneNumber2"); // const enFieldCountry = document.querySelector("#en__field_supporter_country") as HTMLSelectElement;
    // const enFieldAddress1 = document.querySelector("#en__field_supporter_address1") as HTMLInputElement;
    // const enFieldAddress2 = document.querySelector("#en__field_supporter_address2") as HTMLInputElement;
    // const enFieldCity = document.querySelector("#en__field_supporter_city") as HTMLInputElement;
    // const enFieldRegion = document.querySelector("#en__field_supporter_region") as HTMLSelectElement;
    // const enFieldPostcode = document.querySelector("#en__field_supporter_postcode") as HTMLInputElement;

    var enFieldHonname = document.querySelector("#en__field_transaction_honname");
    var enFieldInfname = document.querySelector("#en__field_transaction_infname");
    var enFieldInfemail = document.querySelector("#en__field_transaction_infemail"); // const enFieldInfcountry = document.querySelector("#en__field_transaction_infcountry") as HTMLSelectElement;

    var enFieldInfadd1 = document.querySelector("#en__field_transaction_infadd1");
    var enFieldInfadd2 = document.querySelector("#en__field_transaction_infadd2");
    var enFieldInfcity = document.querySelector("#en__field_transaction_infcity"); // const enFieldInfreg = document.querySelector("#en__field_transaction_infreg") as HTMLSelectElement;

    var enFieldInfpostcd = document.querySelector("#en__field_transaction_infpostcd");
    var enFieldGftrsn = document.querySelector("#en__field_transaction_gftrsn"); // const enPaymentType = document.querySelector("#en__field_transaction_paymenttype") as HTMLInputElement;

    var enFieldCcnumber = document.querySelector("#en__field_transaction_ccnumber"); // const enFieldCcexpire = document.querySelector("#en__field_transaction_ccexpire") as HTMLInputElement;
    // const enFieldCcvv = document.querySelector("#en__field_transaction_ccvv") as HTMLInputElement;
    // const enFieldBankAccountNumber = document.querySelector("#en__field_supporter_bankAccountNumber") as HTMLInputElement;
    // const enFieldBankRoutingNumber = document.querySelector("#en__field_supporter_bankRoutingNumber") as HTMLInputElement;

    if (enFieldDonationAmt) {
      enFieldDonationAmt.placeholder = "Other";
      enFieldDonationAmt.setAttribute("type", "number");
    } // if (enFieldFirstName) {
    //   enFieldFirstName.placeholder = "First name";
    // }
    // if (enFieldLastName) {
    //   enFieldLastName.placeholder = "Last name";
    // }
    // if (enFieldEmailAddress) {
    //   enFieldEmailAddress.placeholder = "Email address";
    // }
    // if (enFieldPhoneNumber) {
    //   enFieldPhoneNumber.placeholder = "Phone number";
    // }


    if (enFieldPhoneNumber2) {
      enFieldPhoneNumber2.placeholder = "000-000-0000 (optional)";
    } // if (enFieldCountry){
    //   enFieldCountry.placeholder = "Country";
    // // }
    // if (enFieldAddress1) {
    //   enFieldAddress1.placeholder = "Street address";
    // }
    // if (enFieldAddress2) {
    //   enFieldAddress2.placeholder = "Apt., ste., bldg.";
    // }
    // if (enFieldCity) {
    //   enFieldCity.placeholder = "City";
    // }
    // if (enFieldRegion){
    //   enFieldRegion.placeholder = "TBD";
    // }
    // if (enFieldPostcode) {
    //   enFieldPostcode.placeholder = "Post code";
    // }


    if (enFieldHonname) {
      enFieldHonname.placeholder = "Honoree name";
    }

    if (enFieldInfname) {
      enFieldInfname.placeholder = "Recipient name";
    }

    if (enFieldInfemail) {
      enFieldInfemail.placeholder = "Recipient email address";
    } // if (enFieldInfcountry){
    //   enFieldInfcountry.placeholder = "TBD";
    // }


    if (enFieldInfadd1) {
      enFieldInfadd1.placeholder = "Recipient street address";
    }

    if (enFieldInfadd2) {
      enFieldInfadd2.placeholder = "Recipient Apt., ste., bldg.";
    }

    if (enFieldInfcity) {
      enFieldInfcity.placeholder = "Recipient city";
    } // if (enFieldInfreg){
    //   enFieldInfreg.placeholder = "TBD";
    // }


    if (enFieldInfpostcd) {
      enFieldInfpostcd.placeholder = "Recipient postal code";
    }

    if (enFieldGftrsn) {
      enFieldGftrsn.placeholder = "Reason for your gift";
    } // if (enPaymentType) {
    //   enPaymentType.placeholder = "TBD";
    // }


    if (enFieldCcnumber) {
      enFieldCcnumber.placeholder = "•••• •••• •••• ••••";
    } // if (enFieldCcexpire) {
    //   enFieldCcexpire.placeholder = "MM / YY";
    // }
    // if (enFieldCcvv) {
    //   enFieldCcvv.placeholder = "CVV";
    // }
    // if (enFieldBankAccountNumber) {
    //   enFieldBankAccountNumber.placeholder = "Bank account number";
    // }
    // if (enFieldBankRoutingNumber) {
    //   enFieldBankRoutingNumber.placeholder = "Bank routing number";
    // }

  }
};
var watchInmemField = function watchInmemField() {
  var enFieldTransactionInmem = document.getElementById("en__field_transaction_inmem");

  var handleEnFieldTransactionInmemChange = function handleEnFieldTransactionInmemChange(e) {
    if (enFieldTransactionInmem.checked) {
      enGrid.classList.add("has-give-in-honor");
    } else {
      enGrid.classList.remove("has-give-in-honor");
    }
  }; // Check Give In Honor State on Page Load


  if (enFieldTransactionInmem) {
    // Run on page load
    if (enFieldTransactionInmem.checked) {
      enGrid.classList.add("has-give-in-honor");
    } else {
      enGrid.classList.remove("has-give-in-honor");
    } // Run on change


    enFieldTransactionInmem.addEventListener("change", handleEnFieldTransactionInmemChange);
  }
};
var watchRecurrpayField = function watchRecurrpayField() {
  var enFieldRecurrpay = document.querySelector(".en__field--recurrpay");
  var transactionRecurrpay = document.getElementsByName("transaction.recurrpay");
  var enFieldRecurrpayStartingValue = document.querySelector('input[name="transaction.recurrpay"]:checked');
  var enFieldRecurrpayCurrentValue = document.querySelector('input[name="transaction.recurrpay"]:checked');

  var handleEnFieldRecurrpay = function handleEnFieldRecurrpay(e) {
    enFieldRecurrpayCurrentValue = document.querySelector('input[name="transaction.recurrpay"]:checked');

    if (enFieldRecurrpayCurrentValue.value.toLowerCase() == "y") {
      enGrid.classList.remove("has-give-once");
      enGrid.classList.add("has-give-monthly");
    } else if (enFieldRecurrpayCurrentValue.value.toLowerCase() == "n") {
      enGrid.classList.remove("has-give-monthly");
      enGrid.classList.add("has-give-once");
    }
  }; // Check Giving Frequency on page load


  if (enFieldRecurrpay) {
    enFieldRecurrpayCurrentValue = document.querySelector('input[name="transaction.recurrpay"]:checked');

    if (enFieldRecurrpayCurrentValue.value.toLowerCase() == "y") {
      enGrid.classList.remove("has-give-once");
      enGrid.classList.add("has-give-monthly");
    } else if (enFieldRecurrpayCurrentValue.value.toLowerCase() == "n") {
      enGrid.classList.add("has-give-once");
      enGrid.classList.remove("has-give-monthly");
    }
  } // Watch each Giving Frequency radio input for a change


  if (transactionRecurrpay) {
    Array.from(transactionRecurrpay).forEach(function (e) {
      var element = e;
      element.addEventListener("change", handleEnFieldRecurrpay);
    });
  }
}; // @TODO Refactor (low priority)

var watchGiveBySelectField = function watchGiveBySelectField() {
  var enFieldGiveBySelect = document.querySelector(".en__field--giveBySelect");
  var transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
  var enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
  var enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
  var prefix = "has-give-by-";
  var enGrid_classes = enGrid.className.split(" ").filter(function (c) {
    return !c.startsWith(prefix);
  });

  var handleEnFieldGiveBySelect = function handleEnFieldGiveBySelect(e) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
    console.log("enFieldGiveBySelectCurrentValue:", enFieldGiveBySelectCurrentValue);

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-card"); // enFieldPaymentType.value = "card";

      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "check") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-check");
      enFieldPaymentType.value = "check";
      enFieldPaymentType.value = "Check";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-paypal");
      enFieldPaymentType.value = "paypal";
      enFieldPaymentType.value = "Paypal";
    }
  }; // Check Giving Frequency on page load


  if (enFieldGiveBySelect) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-card"); // enFieldPaymentType.value = "card";

      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "check") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-check");
      enFieldPaymentType.value = "check";
      enFieldPaymentType.value = "Check";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-paypal");
      enFieldPaymentType.value = "paypal";
      enFieldPaymentType.value = "Paypal";
    }
  } // Watch each Giving Frequency radio input for a change


  if (transactionGiveBySelect) {
    Array.from(transactionGiveBySelect).forEach(function (e) {
      var element = e;
      element.addEventListener("change", handleEnFieldGiveBySelect);
    });
  }
}; // LEGACY: Support the Legacy Give By Select field

var watchLegacyGiveBySelectField = function watchLegacyGiveBySelectField() {
  var enFieldGiveBySelect = document.querySelector(".give-by-select");
  var transactionGiveBySelect = document.getElementsByName("supporter.questions.180165");
  var enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
  var enFieldGiveBySelectCurrentValue = document.querySelector('input[name="supporter.questions.180165"]:checked');
  var paypalOption = new Option("paypal");
  var prefix = "has-give-by-";
  var enGrid_classes = enGrid.className.split(" ").filter(function (c) {
    return !c.startsWith(prefix);
  });

  var handleEnFieldGiveBySelect = function handleEnFieldGiveBySelect(e) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="supporter.questions.180165"]:checked');
    console.log("enFieldGiveBySelectCurrentValue:", enFieldGiveBySelectCurrentValue);

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-card"); // enFieldPaymentType.value = "card";

      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "check") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-check");
      enFieldPaymentType.value = "Check";
      enFieldPaymentType.value = "check";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-paypal");
      enFieldPaymentType.add(paypalOption);
      enFieldPaymentType.value = "Paypal";
      enFieldPaymentType.value = "paypal";
    }
  }; // Check Giving Frequency on page load


  if (enFieldGiveBySelect) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="supporter.questions.180165"]:checked');

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-card"); // enFieldPaymentType.value = "card";

      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "check") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-check");
      enFieldPaymentType.value = "Check";
      enFieldPaymentType.value = "check";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      enGrid.className = enGrid_classes.join(" ").trim();
      enGrid.classList.add("has-give-by-paypal");
      enFieldPaymentType.add(paypalOption);
      enFieldPaymentType.value = "Paypal";
      enFieldPaymentType.value = "paypal";
    }
  } // Watch each Giving Frequency radio input for a change


  if (transactionGiveBySelect) {
    Array.from(transactionGiveBySelect).forEach(function (e) {
      var element = e;
      element.addEventListener("change", handleEnFieldGiveBySelect);
    });
  }
};
/*
 * Input fields as reference variables
 */

var field_credit_card = document.getElementById("en__field_transaction_ccnumber");
var field_payment_type = document.getElementById("en__field_transaction_paymenttype");
var field_expiration_parts = document.querySelectorAll(".en__field--ccexpire .en__field__input--splitselect");
var field_country = document.getElementById("en__field_supporter_country");
var field_expiration_month = field_expiration_parts[0];
var field_expiration_year = field_expiration_parts[1];
/* The Donation Other Giving Amount is a "Number" type input field. This restricts valid inputs to integers unless a step value is defined. Be defining a step value of .01 any valid 2 digit decimal can be entered */

var SetEnFieldOtherAmountRadioStepValue = function SetEnFieldOtherAmountRadioStepValue() {
  var enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt .en__field__input--other");

  if (enFieldOtherAmountRadio) {
    enFieldOtherAmountRadio.setAttribute("step", ".01");
  }
};
/*
 * Helpers
 */
// current_month and current_year used by handleExpUpdate()

var d = new Date();
var current_month = d.getMonth() + 1; // month options in expiration dropdown are indexed from 1

var current_year = d.getFullYear() - 2000; // getCardType used by handleCCUpdate()

var getCardType = function getCardType(cc_partial) {
  var key_character = cc_partial.charAt(0);
  var prefix = "live-card-type-";
  var field_credit_card_classes = field_credit_card.className.split(" ").filter(function (c) {
    return !c.startsWith(prefix);
  });

  switch (key_character) {
    case "0":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return "N/A";

    case "1":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return "N/A";

    case "2":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return "N/A";

    case "3":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-amex");
      return "American Express";

    case "4":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-visa");
      return "Visa";

    case "5":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-mastercard");
      return "Mastercard";

    case "6":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-discover");
      return "Discover";

    case "7":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return "N/A";

    case "8":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return "N/A";

    case "9":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return "N/A";

    default:
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-na");
      return "N/A";
  }
};
/*
 * Handlers
 */


var handleCCUpdate = function handleCCUpdate() {
  var card_type = getCardType(field_credit_card.value);
  var payment_text = field_payment_type.options[field_payment_type.selectedIndex].text;

  if (card_type && payment_text != card_type) {
    field_payment_type.value = Array.from(field_payment_type.options).filter(function (d) {
      return d.text === card_type;
    })[0].value;
  }
};

var handleExpUpdate = function handleExpUpdate(e) {
  // handle if year is changed to current year (disable all months less than current month)
  // handle if month is changed to less than current month (disable current year)
  if (e == "month") {
    var selected_month = parseInt(field_expiration_month.value);
    var disable = selected_month < current_month;
    console.log("month disable", disable, _typeof(disable), selected_month, current_month);

    for (var i = 0; i < field_expiration_year.options.length; i++) {
      // disable or enable current year
      if (parseInt(field_expiration_year.options[i].value) <= current_year) {
        if (disable) {
          //@TODO Couldn't get working in TypeScript
          field_expiration_year.options[i].setAttribute("disabled", "disabled");
        } else {
          field_expiration_year.options[i].disabled = false;
        }
      }
    }
  } else if (e == "year") {
    var selected_year = parseInt(field_expiration_year.value);

    var _disable = selected_year == current_year;

    console.log("year disable", _disable, _typeof(_disable), selected_year, current_year);

    for (var _i = 0; _i < field_expiration_month.options.length; _i++) {
      // disable or enable all months less than current month
      if (parseInt(field_expiration_month.options[_i].value) < current_month) {
        if (_disable) {
          //@TODO Couldn't get working in TypeScript
          field_expiration_month.options[_i].setAttribute("disabled", "disabled");
        } else {
          field_expiration_month.options[_i].disabled = false;
        }
      }
    }
  }
};
/*
 * Event Listeners
 */


if (field_credit_card) {
  field_credit_card.addEventListener("keyup", function () {
    handleCCUpdate();
  });
  field_credit_card.addEventListener("paste", function () {
    handleCCUpdate();
  });
  field_credit_card.addEventListener("blur", function () {
    handleCCUpdate();
  });
}

if (field_expiration_month && field_expiration_year) {
  field_expiration_month.addEventListener("change", function () {
    handleExpUpdate("month");
  });
  field_expiration_year.addEventListener("change", function () {
    handleExpUpdate("year");
  });
} // EN Polyfill to support "label" clicking on Advocacy Recipient "labels"


var contactDetailLabels = function contactDetailLabels() {
  var contact = document.querySelectorAll(".en__contactDetails__rows"); // @TODO Needs refactoring. Has to be a better way to do this.

  var recipientChange = function recipientChange(e) {
    var recipientRow = e.target; // console.log("recipientChange: recipientRow: ", recipientRow);

    var recipientRowWrapper = recipientRow.parentNode; // console.log("recipientChange: recipientRowWrapper: ", recipientRowWrapper);

    var recipientRowsWrapper = recipientRowWrapper.parentNode; // console.log("recipientChange: recipientRowsWrapper: ", recipientRowsWrapper);

    var contactDetails = recipientRowsWrapper.parentNode; // console.log("recipientChange: contactDetails: ", contactDetails);

    var contactDetailsCheckbox = contactDetails.querySelector("input"); // console.log("recipientChange: contactDetailsCheckbox: ", contactDetailsCheckbox);

    if (contactDetailsCheckbox.checked) {
      contactDetailsCheckbox.checked = false;
    } else {
      contactDetailsCheckbox.checked = true;
    }
  };

  if (contact) {
    Array.from(contact).forEach(function (e) {
      var element = e;
      element.addEventListener("click", recipientChange);
    });
  }
}; // Adds a URL path that can be used to easily arrive at the editable version of the current page
// By appending "/edit" to the end of a live URL you will see the editable version
//@TODO Needs to be updated to adapt for "us.e-activist" and "e-activist" URLS, without needing it specified, as well as pass in page number and work for all page types without each needing to be specified

var easyEdit = function easyEdit() {
  var liveURL = window.location.href;
  var editURL = "";

  if (liveURL.search("edit") !== -1) {
    if (liveURL.includes("https://act.ran.org/page/")) {
      editURL = liveURL.replace("https://act.ran.org/page/", "https://us.e-activist.com/index.html#pages/");
      editURL = editURL.replace("/donate/1", "/edit");
      editURL = editURL.replace("/action/1", "/edit");
      editURL = editURL.replace("/data/1", "/edit");
      window.location.href = editURL;
    }
  }
}; // If you go to and Engaging Networks Unsubscribe page anonymously
// then the fields are in their default states. If you go to it via an email
// link that authenticates who you are, it then populates the fields with corresponding
// values from your account. This means to unsubscribe the user has to uncheck the
// newsletter checkbox(s) before submitting.

var simpleUnsubscribe = function simpleUnsubscribe() {
  // console.log("simpleUnsubscribe fired");
  // Check if we're on an Unsubscribe / Manage Subscriptions page
  if (window.location.href.indexOf("/subscriptions") != -1) {
    // console.log("On an subscription management page");
    // Check if any form elements on this page have the "forceUncheck" class
    var forceUncheck = document.querySelectorAll(".forceUncheck");

    if (forceUncheck) {
      // console.log("Found forceUnchecl dom elements", forceUncheck);
      // Step through each DOM element with forceUncheck looking for checkboxes
      Array.from(forceUncheck).forEach(function (e) {
        var element = e; // console.log("Checking this formComponent for checkboxes", element);
        // In the forceUncheck form component, find any checboxes

        var uncheckCheckbox = element.querySelectorAll("input[type='checkbox']");

        if (uncheckCheckbox) {
          // Step through each Checkbox in the forceUncheck form component
          Array.from(uncheckCheckbox).forEach(function (f) {
            var checkbox = f; // console.log("Unchecking this checkbox", checkbox);
            // Uncheck the checbox

            checkbox.checked = false;
          });
        }
      });
    }
  }
}; // Watch the Region Field for changes. If there is only one option, hide it.

var country_select = document.getElementById("en__field_supporter_country");
var region_select = document.getElementById("en__field_supporter_region");

if (country_select) {
  country_select.addEventListener("change", function () {
    setTimeout(function () {
      if (region_select.options.length == 1 && region_select.options[0].value == "other") {
        region_select.classList.add("hide");
      } else {
        region_select.classList.remove("hide");
      }
    }, 100);
  });
}
// CONCATENATED MODULE: ./src/ts/app/utils/show-hide-radio-checkboxes.ts
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ShowHideRadioCheckboxes =
/*#__PURE__*/
function () {
  _createClass(ShowHideRadioCheckboxes, [{
    key: "hideAll",
    // All Affected Elements
    // Class used on Show/Hide Divs + Input Value
    // Hide All Divs
    value: function hideAll() {
      var _this = this;

      this.elements.forEach(function (item, index) {
        if (item instanceof HTMLInputElement) _this.hide(item);
      });
    } // Hide Single Element Div

  }, {
    key: "hide",
    value: function hide(item) {
      var inputValue = item.value;
      document.querySelectorAll("." + this.classes + inputValue).forEach(function (el) {
        // Consider toggling "hide" class so these fields can be displayed when in a debug state
        if (el instanceof HTMLElement) el.style.display = "none";
      });
    } // Show Single Element Div

  }, {
    key: "show",
    value: function show(item) {
      var inputValue = item.value;
      document.querySelectorAll("." + this.classes + inputValue).forEach(function (el) {
        // Consider toggling "hide" class so these fields can be displayed when in a debug state
        if (el instanceof HTMLElement) el.style.display = "";
      });

      if (item.type == "checkbox" && !item.checked) {
        this.hide(item);
      }
    }
  }]);

  function ShowHideRadioCheckboxes(elements, classes) {
    var _this2 = this;

    _classCallCheck(this, ShowHideRadioCheckboxes);

    _defineProperty(this, "elements", void 0);

    _defineProperty(this, "classes", void 0);

    this.elements = document.getElementsByName(elements);
    this.classes = classes;
    this.hideAll();

    var _loop = function _loop(i) {
      var element = _this2.elements[i];

      if (element.checked) {
        _this2.show(element);
      }

      element.addEventListener("change", function (e) {
        _this2.hideAll();

        _this2.show(element);
      });
    };

    for (var i = 0; i < this.elements.length; i++) {
      _loop(i);
    }
  }

  return ShowHideRadioCheckboxes;
}();


// EXTERNAL MODULE: ./node_modules/strongly-typed-events/dist/index.js
var dist = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ts/app/events/donation-amount.ts
function donation_amount_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function donation_amount_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function donation_amount_createClass(Constructor, protoProps, staticProps) { if (protoProps) donation_amount_defineProperties(Constructor.prototype, protoProps); if (staticProps) donation_amount_defineProperties(Constructor, staticProps); return Constructor; }

function donation_amount_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var donation_amount_DonationAmount =
/*#__PURE__*/
function () {
  function DonationAmount(radios, other) {
    var _this = this;

    donation_amount_classCallCheck(this, DonationAmount);

    donation_amount_defineProperty(this, "_onAmountChange", new dist["SimpleEventDispatcher"]());

    donation_amount_defineProperty(this, "_amount", 0);

    donation_amount_defineProperty(this, "_radios", "");

    donation_amount_defineProperty(this, "_other", "");

    donation_amount_defineProperty(this, "_dispatch", true);

    this._other = other;
    this._radios = radios; // Watch the Radios for Changes

    document.addEventListener("change", function (e) {
      var element = e.target;

      if (element && (element.name == radios || element.name == other)) {
        _this.amount = parseFloat(element.value);
      }
    });
  }

  donation_amount_createClass(DonationAmount, [{
    key: "load",
    // Set amount var with currently selected amount
    value: function load() {
      var currentAmountField = document.querySelector('input[name="' + this._radios + '"]:checked');

      if (currentAmountField && currentAmountField.value) {
        var currentAmountValue = parseFloat(currentAmountField.value);

        if (currentAmountValue > 0) {
          this.amount = parseFloat(currentAmountField.value);
        } else {
          var otherField = document.querySelector('input[name="' + this._other + '"]');
          currentAmountValue = parseFloat(otherField.value);
          this.amount = parseFloat(otherField.value);
        }
      }
    } // Force a new amount

  }, {
    key: "setAmount",
    value: function setAmount(amount) {
      var dispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      // Set dispatch to be checked by the SET method
      this._dispatch = dispatch; // Search for the current amount on radio boxes

      var found = Array.from(document.querySelectorAll('input[name="' + this._radios + '"]')).filter(function (el) {
        return el instanceof HTMLInputElement && parseInt(el.value) == amount;
      }); // We found the amount on the radio boxes, so check it

      if (found.length) {
        var amountField = found[0];
        amountField.checked = true; // Clear OTHER text field

        this.clearOther();
      } else {
        var otherField = document.querySelector('input[name="' + this._other + '"]');
        otherField.focus();
        otherField.value = parseFloat(amount.toString()).toFixed(2);
      } // Set the new amount and trigger all live variables


      this.amount = amount; // Revert dispatch to default value (true)

      this._dispatch = true;
    } // Clear Other Field

  }, {
    key: "clearOther",
    value: function clearOther() {
      var otherField = document.querySelector('input[name="' + this._other + '"]');
      otherField.value = "";
      var otherWrapper = otherField.parentNode;
      otherWrapper.classList.add("en__field__item--hidden");
    }
  }, {
    key: "amount",
    get: function get() {
      return this._amount;
    } // Every time we set an amount, trigger the onAmountChange event
    ,
    set: function set(value) {
      this._amount = value || 0;
      if (this._dispatch) this._onAmountChange.dispatch(this._amount);
    }
  }, {
    key: "onAmountChange",
    get: function get() {
      return this._onAmountChange.asEvent();
    }
  }]);

  return DonationAmount;
}();


// CONCATENATED MODULE: ./src/ts/app/events/donation-frequency.ts
function donation_frequency_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function donation_frequency_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function donation_frequency_createClass(Constructor, protoProps, staticProps) { if (protoProps) donation_frequency_defineProperties(Constructor.prototype, protoProps); if (staticProps) donation_frequency_defineProperties(Constructor, staticProps); return Constructor; }

function donation_frequency_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var donation_frequency_DonationFrequency =
/*#__PURE__*/
function () {
  function DonationFrequency(radios) {
    var _this = this;

    donation_frequency_classCallCheck(this, DonationFrequency);

    donation_frequency_defineProperty(this, "_onFrequencyChange", new dist["SimpleEventDispatcher"]());

    donation_frequency_defineProperty(this, "_frequency", "single");

    donation_frequency_defineProperty(this, "_radios", "");

    this._radios = radios; // Watch the Radios for Changes

    document.addEventListener("change", function (e) {
      var element = e.target;

      if (element && element.name == radios) {
        _this.frequency = element.value;
      }
    });
  }

  donation_frequency_createClass(DonationFrequency, [{
    key: "load",
    // Set amount var with currently selected amount
    value: function load() {
      var currentFrequencyField = document.querySelector('input[name="' + this._radios + '"]:checked');

      if (currentFrequencyField && currentFrequencyField.value) {
        this.frequency = currentFrequencyField.value;
      }
    }
  }, {
    key: "frequency",
    get: function get() {
      return this._frequency;
    } // Every time we set a frequency, trigger the onFrequencyChange event
    ,
    set: function set(value) {
      this._frequency = value == "Y" ? "monthly" : "single";

      this._onFrequencyChange.dispatch(this._frequency);
    }
  }, {
    key: "onFrequencyChange",
    get: function get() {
      return this._onFrequencyChange.asEvent();
    }
  }]);

  return DonationFrequency;
}();


// CONCATENATED MODULE: ./src/ts/app/events/en-form.ts
function en_form_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function en_form_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function en_form_createClass(Constructor, protoProps, staticProps) { if (protoProps) en_form_defineProperties(Constructor.prototype, protoProps); if (staticProps) en_form_defineProperties(Constructor, staticProps); return Constructor; }

function en_form_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var en_form_EnForm =
/*#__PURE__*/
function () {
  function EnForm() {
    en_form_classCallCheck(this, EnForm);

    en_form_defineProperty(this, "_onSubmit", new dist["SignalDispatcher"]());

    en_form_defineProperty(this, "_onError", new dist["SignalDispatcher"]());

    en_form_defineProperty(this, "submit", true);
  }

  en_form_createClass(EnForm, [{
    key: "dispatchSubmit",
    value: function dispatchSubmit() {
      this._onSubmit.dispatch();

      console.log("dispatchSubmit");
    }
  }, {
    key: "dispatchError",
    value: function dispatchError() {
      this._onError.dispatch();

      console.log("dispatchError");
    }
  }, {
    key: "submitForm",
    value: function submitForm() {
      var enForm = document.querySelector("form .en__submit button");

      if (enForm) {
        // Add submitting class to modal
        var enModal = document.getElementById("enModal");
        if (enModal) enModal.classList.add("is-submitting");
        enForm.click();
        console.log("submitForm");
      }
    }
  }, {
    key: "onSubmit",
    get: function get() {
      // console.log("onSubmit");
      return this._onSubmit.asEvent();
    }
  }, {
    key: "onError",
    get: function get() {
      // console.log("onError");
      return this._onError.asEvent();
    }
  }]);

  return EnForm;
}();


// CONCATENATED MODULE: ./src/ts/app/utils/live-variables.ts
function live_variables_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function live_variables_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function live_variables_createClass(Constructor, protoProps, staticProps) { if (protoProps) live_variables_defineProperties(Constructor.prototype, protoProps); if (staticProps) live_variables_defineProperties(Constructor, staticProps); return Constructor; }

function live_variables_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var live_variables_LiveVariables =
/*#__PURE__*/
function () {
  function LiveVariables(submitLabel) {
    var _this = this;

    live_variables_classCallCheck(this, LiveVariables);

    live_variables_defineProperty(this, "_amount", void 0);

    live_variables_defineProperty(this, "_fees", void 0);

    live_variables_defineProperty(this, "_frequency", void 0);

    live_variables_defineProperty(this, "multiplier", 1 / 12);

    this._amount = amount;
    this._frequency = frequency;
    this._fees = fees;
    amount.onAmountChange.subscribe(function () {
      return _this.changeSubmitButton(submitLabel);
    });
    amount.onAmountChange.subscribe(function () {
      return _this.changeLiveAmount();
    });
    amount.onAmountChange.subscribe(function () {
      return _this.changeLiveUpsellAmount();
    });
    fees.onFeeChange.subscribe(function () {
      return _this.changeLiveAmount();
    });
    fees.onFeeChange.subscribe(function () {
      return _this.changeLiveUpsellAmount();
    });
    fees.onFeeChange.subscribe(function () {
      return _this.changeSubmitButton(submitLabel);
    });
    frequency.onFrequencyChange.subscribe(function () {
      return _this.changeLiveFrequency();
    });
    frequency.onFrequencyChange.subscribe(function () {
      return _this.changeSubmitButton(submitLabel);
    });
    app_form.onSubmit.subscribe(function () {
      return _this.loadingSubmitButton();
    });
    app_form.onError.subscribe(function () {
      return _this.changeSubmitButton(submitLabel);
    }); // Watch the monthly-upsell links

    document.addEventListener("click", function (e) {
      var element = e.target;

      if (element) {
        if (element.classList.contains("monthly-upsell")) {
          _this.upsold(e);
        } else if (element.classList.contains("form-submit")) {
          e.preventDefault();
          app_form.submitForm();
        }
      }
    });
  }

  live_variables_createClass(LiveVariables, [{
    key: "getAmountTxt",
    value: function getAmountTxt() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var amountTxt = Number.isInteger(amount) ? "$" + amount : "$" + amount.toFixed(2);
      return amount > 0 ? amountTxt : "";
    }
  }, {
    key: "getUpsellAmountTxt",
    value: function getUpsellAmountTxt() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var amountTxt = "$" + Math.ceil(amount / 5) * 5;
      return amount > 0 ? amountTxt : "";
    }
  }, {
    key: "getUpsellAmountRaw",
    value: function getUpsellAmountRaw() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var amountRaw = Math.ceil(amount / 5) * 5;
      return amount > 0 ? amountRaw.toString() : "";
    }
  }, {
    key: "changeSubmitButton",
    value: function changeSubmitButton(submitLabel) {
      var submit = document.querySelector(".dynamic-giving-button button");
      var amount = this.getAmountTxt(this._amount.amount + this._fees.fee);

      if (amount) {
        var _frequency = this._frequency.frequency == "single" ? "" : " Monthly";

        var label = amount != "" ? submitLabel + " " + amount + _frequency : submitLabel + " Now";
        submit.innerHTML = label;
      }
    }
  }, {
    key: "loadingSubmitButton",
    value: function loadingSubmitButton() {
      var submit = document.querySelector(".en__submit button");
      var submitButtonOriginalHTML = submit.innerHTML;
      var submitButtonProcessingHTML = "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" + submitButtonOriginalHTML + "</span></span>";
      submitButtonOriginalHTML = submit.innerHTML;
      submit.innerHTML = submitButtonProcessingHTML;
      return true;
    }
  }, {
    key: "changeLiveAmount",
    value: function changeLiveAmount() {
      var _this2 = this;

      var value = this._amount.amount + this._fees.fee;
      var live_amount = document.querySelectorAll(".live-giving-amount");
      live_amount.forEach(function (elem) {
        return elem.innerHTML = _this2.getAmountTxt(value);
      });
    }
  }, {
    key: "changeLiveUpsellAmount",
    value: function changeLiveUpsellAmount() {
      var _this3 = this;

      var value = (this._amount.amount + this._fees.fee) * this.multiplier;
      var live_upsell_amount = document.querySelectorAll(".live-giving-upsell-amount");
      live_upsell_amount.forEach(function (elem) {
        return elem.innerHTML = _this3.getUpsellAmountTxt(value);
      });
      var live_upsell_amount_raw = document.querySelectorAll(".live-giving-upsell-amount-raw");
      live_upsell_amount_raw.forEach(function (elem) {
        return elem.innerHTML = _this3.getUpsellAmountRaw(value);
      });
    }
  }, {
    key: "changeLiveFrequency",
    value: function changeLiveFrequency() {
      var _this4 = this;

      var live_frequency = document.querySelectorAll(".live-giving-frequency");
      live_frequency.forEach(function (elem) {
        return elem.innerHTML = _this4._frequency.frequency == "single" ? "" : "monthly";
      });
    } // Watch for a clicks on monthly-upsell link

  }, {
    key: "upsold",
    value: function upsold(e) {
      // Find and select monthly giving
      var enFieldRecurrpay = document.querySelector(".en__field--recurrpay input[value='Y']");

      if (enFieldRecurrpay) {
        enFieldRecurrpay.checked = true;
      } // Find the hidden radio select that needs to be selected when entering an "Other" amount


      var enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt input[value='other']");

      if (enFieldOtherAmountRadio) {
        enFieldOtherAmountRadio.checked = true;
      } // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent


      var enFieldOtherAmount = document.querySelector("input[name='transaction.donationAmt.other']");

      if (enFieldOtherAmount) {
        // @TODO Needs to use getUpsellAmountRaw to set value
        enFieldOtherAmount.value = this.getUpsellAmountRaw(this._amount.amount * this.multiplier);
        amount.load();
        frequency.load();

        if (enFieldOtherAmount.parentElement) {
          enFieldOtherAmount.parentElement.classList.remove("en__field__item--hidden");
        }
      }

      var target = e.target;

      if (target && target.classList.contains("form-submit")) {
        e.preventDefault(); // Form submit

        app_form.submitForm();
      }
    }
  }]);

  return LiveVariables;
}();


// CONCATENATED MODULE: ./src/ts/app/events/processing-fees.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { processing_fees_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function processing_fees_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function processing_fees_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function processing_fees_createClass(Constructor, protoProps, staticProps) { if (protoProps) processing_fees_defineProperties(Constructor.prototype, protoProps); if (staticProps) processing_fees_defineProperties(Constructor, staticProps); return Constructor; }

function processing_fees_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var processing_fees_ProcessingFees =
/*#__PURE__*/
function () {
  function ProcessingFees() {
    var _this = this;

    processing_fees_classCallCheck(this, ProcessingFees);

    processing_fees_defineProperty(this, "_onFeeChange", new dist["SimpleEventDispatcher"]());

    processing_fees_defineProperty(this, "_amount", amount);

    processing_fees_defineProperty(this, "_fee", 0);

    processing_fees_defineProperty(this, "_field", document.querySelector('input[name="supporter.processing_fees"]'));

    processing_fees_defineProperty(this, "_subscribe", void 0);

    // Watch the Radios for Changes
    if (this._field instanceof HTMLInputElement) {
      this._field.addEventListener("change", function (e) {
        if (_this._field instanceof HTMLInputElement && _this._field.checked && !_this._subscribe) {
          _this._subscribe = app_form.onSubmit.subscribe(function () {
            return _this.addFees();
          });
        }

        _this._onFeeChange.dispatch(_this.fee);
      });
    } // this._amount = amount;

  }

  processing_fees_createClass(ProcessingFees, [{
    key: "calculateFees",
    value: function calculateFees() {
      if (this._field instanceof HTMLInputElement && this._field.checked && "dataset" in this._field) {
        var fees = _objectSpread({}, {
          processingFeePercentAdded: "0",
          processingFeeFixedAmountAdded: "0"
        }, {}, this._field.dataset);

        var processing_fee = parseFloat(fees.processingFeePercentAdded) / 100 * this._amount.amount + parseFloat(fees.processingFeeFixedAmountAdded);
        return Math.round(processing_fee * 100) / 100;
      }

      return 0;
    } // Add Fees to Amount

  }, {
    key: "addFees",
    value: function addFees() {
      if (app_form.submit) {
        this._amount.setAmount(this._amount.amount + this.fee, false);
      }
    } // Remove Fees From Amount

  }, {
    key: "removeFees",
    value: function removeFees() {
      this._amount.setAmount(this._amount.amount - this.fee);
    }
  }, {
    key: "onFeeChange",
    get: function get() {
      return this._onFeeChange.asEvent();
    }
  }, {
    key: "fee",
    get: function get() {
      return this.calculateFees();
    } // Every time we set a frequency, trigger the onFrequencyChange event
    ,
    set: function set(value) {
      this._fee = value;

      this._onFeeChange.dispatch(this._fee);
    }
  }]);

  return ProcessingFees;
}();


// CONCATENATED MODULE: ./src/ts/app/utils/cookie.ts
function cookie_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function cookie_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { cookie_ownKeys(source, true).forEach(function (key) { cookie_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { cookie_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function cookie_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
Example:
import * as cookie from "./cookie";

cookie.set('name', 'value');
cookie.get('name'); // => 'value'
cookie.remove('name');
cookie.set('name', 'value', { expires: 7 }); // 7 Days cookie
cookie.set('name', 'value', { expires: 7, path: '' }); // Set Path
cookie.remove('name', { path: '' });
 */
function stringifyAttribute(name, value) {
  if (!value) {
    return "";
  }

  var stringified = "; " + name;

  if (value === true) {
    return stringified; // boolean attributes shouldn't have a value
  }

  return stringified + "=" + value;
}

function stringifyAttributes(attributes) {
  if (typeof attributes.expires === "number") {
    var expires = new Date();
    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e5);
    attributes.expires = expires;
  }

  return stringifyAttribute("Expires", attributes.expires ? attributes.expires.toUTCString() : "") + stringifyAttribute("Domain", attributes.domain) + stringifyAttribute("Path", attributes.path) + stringifyAttribute("Secure", attributes.secure) + stringifyAttribute("SameSite", attributes.sameSite);
}

function encode(name, value, attributes) {
  return encodeURIComponent(name).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent) // allowed special characters
  .replace(/\(/g, "%28").replace(/\)/g, "%29") + // replace opening and closing parens
  "=" + encodeURIComponent(value) // allowed special characters
  .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + stringifyAttributes(attributes);
}
function parse(cookieString) {
  var result = {};
  var cookies = cookieString ? cookieString.split("; ") : [];
  var rdecode = /(%[\dA-F]{2})+/gi;

  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split("=");
    var cookie = parts.slice(1).join("=");

    if (cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1);
    }

    try {
      var _name = parts[0].replace(rdecode, decodeURIComponent);

      result[_name] = cookie.replace(rdecode, decodeURIComponent);
    } catch (e) {// ignore cookies with invalid name/value encoding
    }
  }

  return result;
}
function getAll() {
  return parse(document.cookie);
}
function get(name) {
  return getAll()[name];
}
function set(name, value, attributes) {
  document.cookie = encode(name, value, cookie_objectSpread({
    path: "/"
  }, attributes));
}
function remove(name, attributes) {
  set(name, "", cookie_objectSpread({}, attributes, {
    expires: -1
  }));
}
// CONCATENATED MODULE: ./src/ts/app/utils/modal.ts
function modal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function modal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function modal_createClass(Constructor, protoProps, staticProps) { if (protoProps) modal_defineProperties(Constructor.prototype, protoProps); if (staticProps) modal_defineProperties(Constructor, staticProps); return Constructor; }

function modal_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var modal_Modal =
/*#__PURE__*/
function () {
  function Modal() {
    var _this = this;

    modal_classCallCheck(this, Modal);

    modal_defineProperty(this, "debug", false);

    modal_defineProperty(this, "overlay", void 0);

    modal_defineProperty(this, "upsellModal", void 0);

    modal_defineProperty(this, "exitModal", void 0);

    this.upsellModal = document.getElementById("upsellModal");
    this.exitModal = document.getElementById("exitModal");
    var markup = "\n    <div class=\"enModal-container\">\n        <a href=\"#\" class=\"button-close\"></a>\n        <div id=\"enModalContent\">\n        </div>\n    </div>";
    var overlay = document.createElement("div");
    overlay.id = "enModal";
    overlay.classList.add("is-hidden");
    overlay.innerHTML = markup;
    var closeButton = overlay.querySelector(".button-close");
    closeButton.addEventListener("click", this.close.bind(this));
    document.addEventListener("keyup", function (e) {
      if (e.key === "Escape") {
        closeButton.click();
      }
    });
    this.overlay = overlay;
    document.body.appendChild(overlay);

    if (this.upsellModal) {
      app_form.onSubmit.subscribe(function () {
        return _this.openUpsell();
      });
    }

    if (this.exitModal) {
      document.addEventListener("mouseout", function (evt) {
        // Only open the exit modal if you're currently seeing the upSell Modal
        if (evt.toElement === null && evt.relatedTarget === null && !_this.overlay.classList.contains("is-hidden") && !_this.overlay.classList.contains("is-submitting") && _this.overlay.classList.contains("upsellModal")) {
          // An intent to exit has happend
          _this.open(_this.exitModal);
        }
      });
    }
  }

  modal_createClass(Modal, [{
    key: "openUpsell",
    value: function openUpsell() {
      if (this.debug) console.log("Upsell Triggered");
      var freq = frequency.frequency; // Only open Upsell Modal if Frequency == Single & if the Modal is closed

      if (freq == "single" && this.overlay.classList.contains("is-hidden")) {
        this.open(this.upsellModal);
        window.scrollTo(0, 0); // Avoid form submission so you can see the modal

        app_form.submit = false;
        return false;
      } else {
        // @TODO Only submits the form IF monthly (Delete this)
        app_form.submit = true; // @TODO Maybe we need to force a resubmit

        return true;
      }
    }
  }, {
    key: "open",
    value: function open(modal) {
      // If we can't find modal, get out
      if (!modal) return;
      var hideModal = get("hide_upsellModal"); // Get cookie
      // If we have a cookie AND no Debug, get out

      if (hideModal && !this.debug) return;
      var overlayContent = this.overlay.querySelector("#enModalContent"); // Remove all classes from Overlay

      this.overlay.classList.remove("exitModal", "upsellModal"); // Add current Modal Id to Overlay as Class

      this.overlay.classList.add(modal.id); // Add modal content to overlay

      overlayContent.innerHTML = modal.innerHTML; // Load Values

      amount.load();
      frequency.load(); // @TODO After the Modal is open we need to find a way to register that there are new buttons with the "monthly-upsell" class that should be watched for clicks
      // Show Modal

      this.overlay.classList.remove("is-hidden");
    }
  }, {
    key: "close",
    value: function close(e) {
      e.preventDefault();

      if (this.overlay.classList.contains("exitModal")) {
        this.open(this.upsellModal);
      } else {
        set("hide_upsellModal", "1", {
          expires: 1
        }); // Create one day cookie

        this.overlay.classList.add("is-hidden");
      }
    }
  }]);

  return Modal;
}();


// CONCATENATED MODULE: ./src/ts/app/index.ts
function app_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function app_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { app_ownKeys(source, true).forEach(function (key) { app_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { app_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function app_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var amount = new donation_amount_DonationAmount("transaction.donationAmt", "transaction.donationAmt.other");
var frequency = new donation_frequency_DonationFrequency("transaction.recurrpay");
var app_form = new en_form_EnForm(); // Processing Fees Event

var fees = new processing_fees_ProcessingFees();
var app_run = function run(opts) {
  var options = app_objectSpread({}, {
    backgroundImage: "auto",
    submitLabel: "Donate"
  }, {}, opts); // The entire App


  setBackgroundImages(options.backgroundImage);
  inputPlaceholder();
  watchInmemField();
  watchRecurrpayField();
  watchGiveBySelectField();
  watchLegacyGiveBySelectField();
  SetEnFieldOtherAmountRadioStepValue();
  simpleUnsubscribe();
  contactDetailLabels();
  easyEdit();
  enInput.init();
  new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
  new ShowHideRadioCheckboxes("supporter.questions.180165", "giveBySelect-");
  new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
  new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");
  debugBar(); // Event Listener Examples

  amount.onAmountChange.subscribe(function (s) {
    return console.log("Live Amount: ".concat(s));
  });
  frequency.onFrequencyChange.subscribe(function (s) {
    return console.log("Live Frequency: ".concat(s));
  });
  app_form.onSubmit.subscribe(function (s) {
    return console.log("Submit: ".concat(s));
  });
  app_form.onError.subscribe(function (s) {
    return console.log("Error: ".concat(s));
  });

  window.enOnSubmit = function () {
    app_form.dispatchSubmit();
    return app_form.submit;
  };

  window.enOnError = function () {
    app_form.dispatchError();
  }; // Live Variables


  new live_variables_LiveVariables(options.submitLabel); // Modal

  var modal = new modal_Modal();
  modal.debug = true; // Comment it out to disable debug
  // On the end of the script, after all subscribers defined, let's load the current value

  amount.load();
  frequency.load();
};
// EXTERNAL MODULE: ./src/themes/ran/sass/main.scss
var main = __webpack_require__(11);

// CONCATENATED MODULE: ./src/themes/ran/index.ts


var ran_options = {
  backgroundImage: ["https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10042/IMG-3019_Greenpeace_Victor_Moriyama-BACKGROUND.jpg?v=1572910092000"]
};

if (document.readyState !== "loading") {
  app_run(ran_options);
} else {
  document.addEventListener("DOMContentLoaded", function () {
    app_run(ran_options);
  });
}

/***/ })
/******/ ]);