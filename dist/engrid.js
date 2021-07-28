/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 256:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(356);


/***/ }),

/***/ 356:
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ 110:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatchError = void 0;
/**
 * Indicates an error with dispatching.
 *
 * @export
 * @class DispatchError
 * @extends {Error}
 */
class DispatchError extends Error {
    /**
     * Creates an instance of DispatchError.
     * @param {string} message The message.
     *
     * @memberOf DispatchError
     */
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(233);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 *
 * @export
 * @abstract
 * @class DispatcherBase
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherBase {
    constructor() {
        /**
         * The subscriptions.
         *
         * @protected
         *
         * @memberOf DispatcherBase
         */
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherBase
     */
    get onSubscriptionChange() {
        if (this._onSubscriptionChange == null) {
            this._onSubscriptionChange = new __1.SubscriptionChangeEventDispatcher();
        }
        return this._onSubscriptionChange.asEvent();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        let changes = false;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                changes = true;
                break;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        //execute on a copy because of bug #9
        for (let sub of [...this._subscriptions]) {
            let ev = new __1.EventManagement(() => this.unsub(sub.handler));
            let nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            let s = sub;
            s.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return { propagationStopped: true };
            }
        }
        if (executeAsync) {
            return null;
        }
        return { propagationStopped: false };
    }
    /**
     * Creates a subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce True if the handler should run only one.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf DispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     *
     * @protected
     * @param {ISubscription<TEventHandler>} sub The subscription.
     *
     * @memberOf DispatcherBase
     */
    cleanup(sub) {
        let changes = false;
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
                changes = true;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISubscribable<TEventHandler>}
     *
     * @memberOf DispatcherBase
     */
    asEvent() {
        if (this._wrap == null) {
            this._wrap = new __1.DispatcherWrapper(this);
        }
        return this._wrap;
    }
    /**
     * Clears the subscriptions.
     *
     * @memberOf DispatcherBase
     */
    clear() {
        if (this._subscriptions.length != 0) {
            this._subscriptions.splice(0, this._subscriptions.length);
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Triggers the subscription change event.
     *
     * @private
     *
     * @memberOf DispatcherBase
     */
    triggerSubscriptionChange() {
        if (this._onSubscriptionChange != null) {
            this._onSubscriptionChange.dispatch(this.count);
        }
    }
}
exports.DispatcherBase = DispatcherBase;


/***/ }),

/***/ 207:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 *
 * @export
 * @class DispatcherWrapper
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherWrapper {
    /**
     * Creates an instance of DispatcherWrapper.
     * @param {ISubscribable<TEventHandler>} dispatcher
     *
     * @memberOf DispatcherWrapper
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
        this._onSubscriptionChange = () => dispatcher.onSubscriptionChange;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherWrapper
     */
    get onSubscriptionChange() {
        return this._onSubscriptionChange();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherWrapper
     */
    get count() {
        return this._count();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     *
     * @memberOf DispatcherWrapper
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 685:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 *
 * @export
 * @abstract
 * @class EventListBaset
 * @template TEventDispatcher The type of event dispatcher.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     *
     * @param {string} name The name of the event.
     * @returns {TEventDispatcher} The disptacher.
     *
     * @memberOf EventListBase
     */
    get(name) {
        let event = this._events[name];
        if (event) {
            return event;
        }
        event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     *
     * @param {string} name
     *
     * @memberOf EventListBase
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 928:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(233);
/**
 * Dispatcher base for dispatchers that use promises. Each promise
 * is awaited before the next is dispatched, unless the event is
 * dispatched with the executeAsync flag.
 *
 * @export
 * @abstract
 * @class PromiseDispatcherBase
 * @extends {DispatcherBase<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseDispatcherBase extends __1.DispatcherBase {
    /**
     * The normal dispatch cannot be used in this class.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    /**
     * Crates a new subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce Indicates if the handler should only run once.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf PromiseDispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    async _dispatchAsPromise(executeAsync, scope, args) {
        //execute on a copy because of bug #9
        for (let sub of [...this._subscriptions]) {
            let ev = new __1.EventManagement(() => this.unsub(sub.handler));
            let nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            let ps = sub;
            await ps.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return { propagationStopped: true };
            }
        }
        if (executeAsync) {
            return null;
        }
        return { propagationStopped: false };
    }
}
exports.PromiseDispatcherBase = PromiseDispatcherBase;


/***/ }),

/***/ 243:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(233);
/**
 * Dispatcher for subscription changes.
 *
 * @export
 * @class SubscriptionChangeEventDispatcher
 * @extends {DispatcherBase<SubscriptionChangeEventHandler>}
 */
class SubscriptionChangeEventDispatcher extends __1.DispatcherBase {
    /**
     * Dispatches the event.
     *
     * @param {number} count The currrent number of subscriptions.
     *
     * @memberOf SubscriptionChangeEventDispatcher
     */
    dispatch(count) {
        this._dispatch(false, this, arguments);
    }
}
exports.SubscriptionChangeEventDispatcher = SubscriptionChangeEventDispatcher;


/***/ }),

/***/ 622:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
/**
 * Subscription implementation for events with promises.
 *
 * @export
 * @class PromiseSubscription
 * @implements {ISubscription<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseSubscription {
    /**
     * Creates an instance of PromiseSubscription.
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     *
     * @memberOf PromiseSubscription
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         *
         * @memberOf PromiseSubscription
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     *
     * @memberOf PromiseSubscription
     */
    async execute(executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            //TODO: do we need to cast to any -- seems yuck
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(() => {
                    fn.apply(scope, args);
                }, 1);
                return;
            }
            let result = fn.apply(scope, args);
            await result;
        }
    }
}
exports.PromiseSubscription = PromiseSubscription;


/***/ }),

/***/ 84:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subscription = void 0;
/**
 * Stores a handler. Manages execution meta data.
 * @class Subscription
 * @template TEventHandler
 */
class Subscription {
    /**
     * Creates an instance of Subscription.
     *
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     */
    constructor(handler, isOnce) {
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
    execute(executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(() => {
                    fn.apply(scope, args);
                }, 1);
            }
            else {
                fn.apply(scope, args);
            }
        }
    }
}
exports.Subscription = Subscription;


/***/ }),

/***/ 114:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HandlingBase = void 0;
/**
 * Base class that implements event handling. With a an
 * event list this base class will expose events that can be
 * subscribed to. This will give your class generic events.
 *
 * @export
 * @abstract
 * @class HandlingBase
 * @template TEventHandler The type of event handler.
 * @template TDispatcher The type of dispatcher.
 * @template TList The type of event list.
 */
class HandlingBase {
    /**
     * Creates an instance of HandlingBase.
     * @param {TList} events The event list. Used for event management.
     *
     * @memberOf HandlingBase
     */
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 233:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(53);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(110);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(207);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(685);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(824);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(114);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(928);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(622);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(84);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(243);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 824:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @export
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    /**
     * Creates an instance of EventManagement.
     * @param {() => void} unsub An unsubscribe handler.
     *
     * @memberOf EventManagement
     */
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberOf EventManagement
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 608:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 *
 * @export
 * @class EventDispatcher
 * @extends {DispatcherBase<IEventHandler<TSender, TArgs>>}
 * @implements {IEvent<TSender, TArgs>}
 * @template TSender The sender type.
 * @template TArgs The event arguments type.
 */
class EventDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of EventDispatcher.
     *
     * @memberOf EventDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TSender} sender The sender.
     * @param {TArgs} args The arguments.
     * @returns {IPropagationStatus} The propagation status to interact with the event
     *
     * @memberOf EventDispatcher
     */
    dispatch(sender, args) {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event in an async way. Does not support event interaction.
     *
     * @param {TSender} sender The sender.
     * @param {TArgs} args The arguments.
     *
     * @memberOf EventDispatcher
     */
    dispatchAsync(sender, args) {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {IEvent<TSender, TArgs>} The event.
     *
     * @memberOf EventDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.EventDispatcher = EventDispatcher;


/***/ }),

/***/ 164:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const EventList_1 = __webpack_require__(594);
/**
 * Extends objects with signal event handling capabilities.
 */
class EventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new EventList_1.EventList());
    }
}
exports.EventHandlingBase = EventHandlingBase;


/***/ }),

/***/ 594:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventList = void 0;
const ste_core_1 = __webpack_require__(233);
const EventDispatcher_1 = __webpack_require__(608);
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class EventList extends ste_core_1.EventListBase {
    /**
     * Creates a new EventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new EventDispatcher_1.EventDispatcher();
    }
}
exports.EventList = EventList;


/***/ }),

/***/ 107:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = void 0;
const EventDispatcher_1 = __webpack_require__(608);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new EventDispatcher_1.EventDispatcher();
    }
}
exports.NonUniformEventList = NonUniformEventList;


/***/ }),

/***/ 851:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = exports.EventList = exports.EventHandlingBase = exports.EventDispatcher = void 0;
const EventDispatcher_1 = __webpack_require__(608);
Object.defineProperty(exports, "EventDispatcher", ({ enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } }));
const EventHandlingBase_1 = __webpack_require__(164);
Object.defineProperty(exports, "EventHandlingBase", ({ enumerable: true, get: function () { return EventHandlingBase_1.EventHandlingBase; } }));
const EventList_1 = __webpack_require__(594);
Object.defineProperty(exports, "EventList", ({ enumerable: true, get: function () { return EventList_1.EventList; } }));
const NonUniformEventList_1 = __webpack_require__(107);
Object.defineProperty(exports, "NonUniformEventList", ({ enumerable: true, get: function () { return NonUniformEventList_1.NonUniformEventList; } }));


/***/ }),

/***/ 253:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseEventList = void 0;
const PromiseEventDispatcher_1 = __webpack_require__(933);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformPromiseEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseEventDispatcher_1.PromiseEventDispatcher();
    }
}
exports.NonUniformPromiseEventList = NonUniformPromiseEventList;


/***/ }),

/***/ 933:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 *
 * @export
 * @class PromiseEventDispatcher
 * @extends {PromiseDispatcherBase<IPromiseEventHandler<TSender, TArgs>>}
 * @implements {IPromiseEvent<TSender, TArgs>}
 * @template TSender
 * @template TArgs
 */
class PromiseEventDispatcher extends ste_core_1.PromiseDispatcherBase {
    /**
     * Creates a new EventDispatcher instance.
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TSender} sender The sender object.
     * @param {TArgs} args The argument object.
     * @returns {Promise<IPropagationStatus>} The status.
     *
     * @memberOf PromiseEventDispatcher
     */
    async dispatch(sender, args) {
        const result = await this._dispatchAsPromise(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for the result.
     *
     * @param {TSender} sender The sender object.
     * @param {TArgs} args The argument object.
     *
     * @memberOf PromiseEventDispatcher
     */
    dispatchAsync(sender, args) {
        this._dispatchAsPromise(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.PromiseEventDispatcher = PromiseEventDispatcher;


/***/ }),

/***/ 238:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseEventList_1 = __webpack_require__(930);
/**
 * Extends objects with signal event handling capabilities.
 */
class PromiseEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new PromiseEventList_1.PromiseEventList());
    }
}
exports.PromiseEventHandlingBase = PromiseEventHandlingBase;


/***/ }),

/***/ 930:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventList = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseEventDispatcher_1 = __webpack_require__(933);
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class PromiseEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new EventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseEventDispatcher_1.PromiseEventDispatcher();
    }
}
exports.PromiseEventList = PromiseEventList;


/***/ }),

/***/ 129:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseEventList = exports.PromiseEventList = exports.PromiseEventHandlingBase = exports.PromiseEventDispatcher = void 0;
const PromiseEventDispatcher_1 = __webpack_require__(933);
Object.defineProperty(exports, "PromiseEventDispatcher", ({ enumerable: true, get: function () { return PromiseEventDispatcher_1.PromiseEventDispatcher; } }));
const PromiseEventHandlingBase_1 = __webpack_require__(238);
Object.defineProperty(exports, "PromiseEventHandlingBase", ({ enumerable: true, get: function () { return PromiseEventHandlingBase_1.PromiseEventHandlingBase; } }));
const PromiseEventList_1 = __webpack_require__(930);
Object.defineProperty(exports, "PromiseEventList", ({ enumerable: true, get: function () { return PromiseEventList_1.PromiseEventList; } }));
const NonUniformPromiseEventList_1 = __webpack_require__(253);
Object.defineProperty(exports, "NonUniformPromiseEventList", ({ enumerable: true, get: function () { return NonUniformPromiseEventList_1.NonUniformPromiseEventList; } }));


/***/ }),

/***/ 482:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 */
class PromiseSignalDispatcher extends ste_core_1.PromiseDispatcherBase {
    /**
     * Creates a new SignalDispatcher instance.
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the signal.
     *
     * @returns {IPropagationStatus} The status of the dispatch.
     *
     * @memberOf SignalDispatcher
     */
    async dispatch() {
        const result = await this._dispatchAsPromise(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the signal threaded.
     */
    dispatchAsync() {
        this._dispatchAsPromise(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.PromiseSignalDispatcher = PromiseSignalDispatcher;


/***/ }),

/***/ 948:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseSignalList_1 = __webpack_require__(758);
/**
 * Extends objects with signal event handling capabilities.
 */
class PromiseSignalHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new PromiseSignalList_1.PromiseSignalList());
    }
}
exports.PromiseSignalHandlingBase = PromiseSignalHandlingBase;


/***/ }),

/***/ 758:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalList = void 0;
const ste_core_1 = __webpack_require__(233);
const _1 = __webpack_require__(559);
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class PromiseSignalList extends ste_core_1.EventListBase {
    /**
     * Creates a new SignalList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new _1.PromiseSignalDispatcher();
    }
}
exports.PromiseSignalList = PromiseSignalList;


/***/ }),

/***/ 559:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Promise Signals
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalList = exports.PromiseSignalHandlingBase = exports.PromiseSignalDispatcher = void 0;
const PromiseSignalDispatcher_1 = __webpack_require__(482);
Object.defineProperty(exports, "PromiseSignalDispatcher", ({ enumerable: true, get: function () { return PromiseSignalDispatcher_1.PromiseSignalDispatcher; } }));
const PromiseSignalHandlingBase_1 = __webpack_require__(948);
Object.defineProperty(exports, "PromiseSignalHandlingBase", ({ enumerable: true, get: function () { return PromiseSignalHandlingBase_1.PromiseSignalHandlingBase; } }));
const PromiseSignalList_1 = __webpack_require__(758);
Object.defineProperty(exports, "PromiseSignalList", ({ enumerable: true, get: function () { return PromiseSignalList_1.PromiseSignalList; } }));


/***/ }),

/***/ 841:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseSimpleEventList = void 0;
const PromiseSimpleEventDispatcher_1 = __webpack_require__(377);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformPromiseSimpleEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher();
    }
}
exports.NonUniformPromiseSimpleEventList = NonUniformPromiseSimpleEventList;


/***/ }),

/***/ 377:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 *
 * @export
 * @class PromiseSimpleEventDispatcher
 * @extends {PromiseDispatcherBase<IPromiseSimpleEventHandler<TArgs>>}
 * @implements {IPromiseSimpleEvent<TArgs>}
 * @template TArgs
 */
class PromiseSimpleEventDispatcher extends ste_core_1.PromiseDispatcherBase {
    /**
     * Creates a new SimpleEventDispatcher instance.
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     * @param args The arguments object.
     * @returns {IPropagationStatus} The status of the dispatch.
     * @memberOf PromiseSimpleEventDispatcher
     */
    async dispatch(args) {
        const result = await this._dispatchAsPromise(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for it to complete.
     * @param args The argument object.
     * @memberOf PromiseSimpleEventDispatcher
     */
    dispatchAsync(args) {
        this._dispatchAsPromise(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.PromiseSimpleEventDispatcher = PromiseSimpleEventDispatcher;


/***/ }),

/***/ 511:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseSimpleEventList_1 = __webpack_require__(879);
/**
 * Extends objects with signal event handling capabilities.
 */
class PromiseSimpleEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new PromiseSimpleEventList_1.PromiseSimpleEventList());
    }
}
exports.PromiseSimpleEventHandlingBase = PromiseSimpleEventHandlingBase;


/***/ }),

/***/ 879:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventList = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseSimpleEventDispatcher_1 = __webpack_require__(377);
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class PromiseSimpleEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new SimpleEventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher();
    }
}
exports.PromiseSimpleEventList = PromiseSimpleEventList;


/***/ }),

/***/ 817:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseSimpleEventList = exports.PromiseSimpleEventList = exports.PromiseSimpleEventHandlingBase = exports.PromiseSimpleEventDispatcher = void 0;
const NonUniformPromiseSimpleEventList_1 = __webpack_require__(841);
Object.defineProperty(exports, "NonUniformPromiseSimpleEventList", ({ enumerable: true, get: function () { return NonUniformPromiseSimpleEventList_1.NonUniformPromiseSimpleEventList; } }));
const PromiseSimpleEventDispatcher_1 = __webpack_require__(377);
Object.defineProperty(exports, "PromiseSimpleEventDispatcher", ({ enumerable: true, get: function () { return PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher; } }));
const PromiseSimpleEventHandlingBase_1 = __webpack_require__(511);
Object.defineProperty(exports, "PromiseSimpleEventHandlingBase", ({ enumerable: true, get: function () { return PromiseSimpleEventHandlingBase_1.PromiseSimpleEventHandlingBase; } }));
const PromiseSimpleEventList_1 = __webpack_require__(879);
Object.defineProperty(exports, "PromiseSimpleEventList", ({ enumerable: true, get: function () { return PromiseSimpleEventList_1.PromiseSimpleEventList; } }));


/***/ }),

/***/ 275:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 *
 * @export
 * @class SignalDispatcher
 * @extends {DispatcherBase<ISignalHandler>}
 * @implements {ISignal}
 */
class SignalDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Dispatches the signal.
     *
     * @returns {IPropagationStatus} The status of the signal.
     *
     * @memberOf SignalDispatcher
     */
    dispatch() {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the signal without waiting for the result.
     *
     * @memberOf SignalDispatcher
     */
    dispatchAsync() {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISignal} The signal.
     *
     * @memberOf SignalDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.SignalDispatcher = SignalDispatcher;


/***/ }),

/***/ 36:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const _1 = __webpack_require__(350);
/**
 * Extends objects with signal event handling capabilities.
 *
 * @export
 * @abstract
 * @class SignalHandlingBase
 * @extends {HandlingBase<ISignalHandler, SignalDispatcher, SignalList>}
 * @implements {ISignalHandling}
 */
class SignalHandlingBase extends ste_core_1.HandlingBase {
    /**
     * Creates an instance of SignalHandlingBase.
     *
     * @memberOf SignalHandlingBase
     */
    constructor() {
        super(new _1.SignalList());
    }
}
exports.SignalHandlingBase = SignalHandlingBase;


/***/ }),

/***/ 80:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = void 0;
const ste_core_1 = __webpack_require__(233);
const _1 = __webpack_require__(350);
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 *
 * @export
 * @class SignalList
 * @extends {EventListBase<SignalDispatcher>}
 */
class SignalList extends ste_core_1.EventListBase {
    /**
     * Creates an instance of SignalList.
     *
     * @memberOf SignalList
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     *
     * @protected
     * @returns {SignalDispatcher}
     *
     * @memberOf SignalList
     */
    createDispatcher() {
        return new _1.SignalDispatcher();
    }
}
exports.SignalList = SignalList;


/***/ }),

/***/ 350:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*!
 * Strongly Typed Events for TypeScript - Promise Signals
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = exports.SignalHandlingBase = exports.SignalDispatcher = void 0;
const SignalDispatcher_1 = __webpack_require__(275);
Object.defineProperty(exports, "SignalDispatcher", ({ enumerable: true, get: function () { return SignalDispatcher_1.SignalDispatcher; } }));
const SignalHandlingBase_1 = __webpack_require__(36);
Object.defineProperty(exports, "SignalHandlingBase", ({ enumerable: true, get: function () { return SignalHandlingBase_1.SignalHandlingBase; } }));
const SignalList_1 = __webpack_require__(80);
Object.defineProperty(exports, "SignalList", ({ enumerable: true, get: function () { return SignalList_1.SignalList; } }));


/***/ }),

/***/ 335:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(120);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformSimpleEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SimpleEventDispatcher_1.SimpleEventDispatcher();
    }
}
exports.NonUniformSimpleEventList = NonUniformSimpleEventList;


/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 *
 * @export
 * @class SimpleEventDispatcher
 * @extends {DispatcherBase<ISimpleEventHandler<TArgs>>}
 * @implements {ISimpleEvent<TArgs>}
 * @template TArgs
 */
class SimpleEventDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of SimpleEventDispatcher.
     *
     * @memberOf SimpleEventDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TArgs} args The arguments object.
     * @returns {IPropagationStatus} The status of the event.
     *
     * @memberOf SimpleEventDispatcher
     */
    dispatch(args) {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for the result.
     *
     * @param {TArgs} args The arguments object.
     *
     * @memberOf SimpleEventDispatcher
     */
    dispatchAsync(args) {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISimpleEvent<TArgs>} The event.
     *
     * @memberOf SimpleEventDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.SimpleEventDispatcher = SimpleEventDispatcher;


/***/ }),

/***/ 229:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const SimpleEventList_1 = __webpack_require__(222);
/**
 * Extends objects with signal event handling capabilities.
 */
class SimpleEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new SimpleEventList_1.SimpleEventList());
    }
}
exports.SimpleEventHandlingBase = SimpleEventHandlingBase;


/***/ }),

/***/ 222:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventList = void 0;
const ste_core_1 = __webpack_require__(233);
const SimpleEventDispatcher_1 = __webpack_require__(120);
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class SimpleEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new SimpleEventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SimpleEventDispatcher_1.SimpleEventDispatcher();
    }
}
exports.SimpleEventList = SimpleEventList;


/***/ }),

/***/ 844:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = exports.SimpleEventList = exports.SimpleEventHandlingBase = exports.SimpleEventDispatcher = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(120);
Object.defineProperty(exports, "SimpleEventDispatcher", ({ enumerable: true, get: function () { return SimpleEventDispatcher_1.SimpleEventDispatcher; } }));
const SimpleEventHandlingBase_1 = __webpack_require__(229);
Object.defineProperty(exports, "SimpleEventHandlingBase", ({ enumerable: true, get: function () { return SimpleEventHandlingBase_1.SimpleEventHandlingBase; } }));
const NonUniformSimpleEventList_1 = __webpack_require__(335);
Object.defineProperty(exports, "NonUniformSimpleEventList", ({ enumerable: true, get: function () { return NonUniformSimpleEventList_1.NonUniformSimpleEventList; } }));
const SimpleEventList_1 = __webpack_require__(222);
Object.defineProperty(exports, "SimpleEventList", ({ enumerable: true, get: function () { return SimpleEventList_1.SimpleEventList; } }));


/***/ }),

/***/ 590:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

/*!
 * Strongly Typed Events for TypeScript
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.nz = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.FK = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
var ste_core_1 = __webpack_require__(233);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.Subscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherWrapper; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventListBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventManagement; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatchError; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseSubscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseDispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.HandlingBase; } });
var ste_events_1 = __webpack_require__(851);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.NonUniformEventList; } });
var ste_simple_events_1 = __webpack_require__(844);
Object.defineProperty(exports, "FK", ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.NonUniformSimpleEventList; } });
var ste_signals_1 = __webpack_require__(350);
Object.defineProperty(exports, "nz", ({ enumerable: true, get: function () { return ste_signals_1.SignalDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalList; } });
var ste_promise_events_1 = __webpack_require__(129);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.NonUniformPromiseEventList; } });
var ste_promise_signals_1 = __webpack_require__(559);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalList; } });
var ste_promise_simple_events_1 = __webpack_require__(817);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.NonUniformPromiseSimpleEventList; } });


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/deprecated.js


// A way to gracefully handle deprecation.
// Find and replace HTML Elements, Classes, and more after the DOM is loaded but before any other Javascript fires.

var Deprecated = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function Deprecated() {
    _classCallCheck(this, Deprecated);

    var deprecated;
    var replacement; // Checks for body-side class

    deprecated = document.querySelector(".body-side");

    if (deprecated) {
      this.warning(deprecated);
    } // Checks for backgroundImage class


    deprecated = document.querySelector(".backgroundImage");

    if (deprecated) {
      replacement = "background-image";
      this.replace(deprecated, replacement);
    } // Checks for backgroundImageOverlay class


    deprecated = document.querySelector(".backgroundImageOverlay");

    if (deprecated) {
      replacement = "background-image-overlay";
      this.replace(deprecated, replacement);
    }
  }

  _createClass(Deprecated, [{
    key: "warning",
    value: function warning(deprecated) {
      if (ENGrid.debug) console.log("Deprecated: '" + deprecated + "' was detected and nothing was done.");
    }
  }, {
    key: "replace",
    value: function replace(deprecated, replacement) {
      if (ENGrid.debug) console.log("Deprecated: '" + deprecated + "' was detected and replaced with '" + replacement + "'.");
      deprecated.classList.add(replacement);
      deprecated.classList.remove(deprecated);
    }
  }]);

  return Deprecated;
}()));
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/interfaces/options.js
var OptionsDefaults = {
  backgroundImage: '',
  MediaAttribution: true,
  applePay: false,
  CapitalizeFields: false,
  ClickToExpand: true,
  CurrencySymbol: '$',
  CurrencySeparator: '.',
  SkipToMainContentLink: true,
  SrcDefer: true,
  NeverBounceAPI: null,
  NeverBounceDateField: null,
  NeverBounceStatusField: null,
  ProgressBar: false,
  Debug: false
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/interfaces/upsell-options.js
var UpsellOptionsDefaults = {
  image: "https://picsum.photos/480/650",
  imagePosition: "left",
  title: "Will you change your gift to just {new-amount} a month to boost your impact?",
  paragraph: "Make a monthly pledge today to support us with consistent, reliable resources during emergency moments.",
  yesLabel: "Yes! Process My <br> {new-amount} monthly gift",
  noLabel: "No, thanks. Continue with my <br> {old-amount} one-time gift",
  otherAmount: true,
  otherLabel: "Or enter a different monthly amount:",
  upsellOriginalGiftAmountFieldName: '',
  amountRange: [{
    max: 10,
    suggestion: 5
  }, {
    max: 15,
    suggestion: 7
  }, {
    max: 20,
    suggestion: 8
  }, {
    max: 25,
    suggestion: 9
  }, {
    max: 30,
    suggestion: 10
  }, {
    max: 35,
    suggestion: 11
  }, {
    max: 40,
    suggestion: 12
  }, {
    max: 50,
    suggestion: 14
  }, {
    max: 100,
    suggestion: 15
  }, {
    max: 200,
    suggestion: 19
  }, {
    max: 300,
    suggestion: 29
  }, {
    max: 500,
    suggestion: "Math.ceil((amount / 12)/5)*5"
  }],
  canClose: true,
  submitOnClose: false
};
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function classCallCheck_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function createClass_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ../engrid-scripts/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
// EXTERNAL MODULE: ../engrid-scripts/packages/common/node_modules/strongly-typed-events/dist/index.js
var dist = __webpack_require__(590);
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/en-form.js




var EnForm = /*#__PURE__*/function () {
  function EnForm() {
    classCallCheck_classCallCheck(this, EnForm);

    this._onSubmit = new dist/* SignalDispatcher */.nz();
    this._onValidate = new dist/* SignalDispatcher */.nz();
    this._onError = new dist/* SignalDispatcher */.nz();
    this.submit = true;
    this.validate = true;
  }

  createClass_createClass(EnForm, [{
    key: "dispatchSubmit",
    value: function dispatchSubmit() {
      this._onSubmit.dispatch();

      if (engrid_ENGrid.debug) console.log("dispatchSubmit");
    }
  }, {
    key: "dispatchValidate",
    value: function dispatchValidate() {
      this._onValidate.dispatch();

      if (engrid_ENGrid.debug) console.log("dispatchValidate");
    }
  }, {
    key: "dispatchError",
    value: function dispatchError() {
      this._onError.dispatch();

      if (engrid_ENGrid.debug) console.log("dispatchError");
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
        if (engrid_ENGrid.debug) console.log("submitForm");
      }
    }
  }, {
    key: "onSubmit",
    get: function get() {
      // if(ENGrid.debug) console.log("onSubmit");
      return this._onSubmit.asEvent();
    }
  }, {
    key: "onError",
    get: function get() {
      // if(ENGrid.debug) console.log("onError");
      return this._onError.asEvent();
    }
  }, {
    key: "onValidate",
    get: function get() {
      // if(ENGrid.debug) console.log("onError");
      return this._onValidate.asEvent();
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!EnForm.instance) {
        EnForm.instance = new EnForm();
      }

      return EnForm.instance;
    }
  }]);

  return EnForm;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/donation-amount.js



var DonationAmount = /*#__PURE__*/function () {
  function DonationAmount() {
    var _this = this;

    var radios = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "transaction.donationAmt";
    var other = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "transaction.donationAmt.other";

    classCallCheck_classCallCheck(this, DonationAmount);

    this._onAmountChange = new dist/* SimpleEventDispatcher */.FK();
    this._amount = 0;
    this._radios = "";
    this._other = "";
    this._dispatch = true;
    this._other = other;
    this._radios = radios; // Watch Radios Inputs for Changes

    document.addEventListener("change", function (e) {
      var element = e.target;

      if (element && element.name == radios) {
        element.value = _this.removeCommas(element.value);
        _this.amount = parseFloat(element.value);
      }
    }); // Watch Other Amount Field

    var otherField = document.querySelector("[name='".concat(this._other, "']"));

    if (otherField) {
      otherField.addEventListener("keyup", function (e) {
        otherField.value = _this.removeCommas(otherField.value);
        _this.amount = parseFloat(otherField.value);
      });
    }
  }

  createClass_createClass(DonationAmount, [{
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
    } // Set amount var with currently selected amount

  }, {
    key: "load",
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

      // Run only if it is a Donation Page with a Donation Amount field
      if (!document.getElementsByName(this._radios).length) {
        return;
      } // Set dispatch to be checked by the SET method


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
    } // Remove commas

  }, {
    key: "removeCommas",
    value: function removeCommas(v) {
      // replace 5,00 with 5.00
      if (v.length > 3 && v.charAt(v.length - 3) == ',') {
        v = v.substr(0, v.length - 3) + "." + v.substr(v.length - 2, 2);
      } else if (v.length > 2 && v.charAt(v.length - 2) == ',') {
        v = v.substr(0, v.length - 2) + "." + v.substr(v.length - 1, 1);
      } // replace any remaining commas


      return v.replace(/,/g, '');
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      var radios = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "transaction.donationAmt";
      var other = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "transaction.donationAmt.other";

      if (!DonationAmount.instance) {
        DonationAmount.instance = new DonationAmount(radios, other);
      }

      return DonationAmount.instance;
    }
  }]);

  return DonationAmount;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/engrid.js



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var engrid_ENGrid = /*#__PURE__*/function () {
  function ENGrid() {
    classCallCheck_classCallCheck(this, ENGrid);

    if (!ENGrid.enForm) {
      throw new Error('Engaging Networks Form Not Found!');
    }
  }

  createClass_createClass(ENGrid, null, [{
    key: "enForm",
    get: function get() {
      return document.querySelector("form.en__component");
    }
  }, {
    key: "debug",
    get: function get() {
      return !!this.getOption('Debug');
    } // Return any parameter from the URL

  }, {
    key: "getUrlParameter",
    value: function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    } // Return the field value from its name. It works on any field type.
    // Multiple values (from checkboxes or multi-select) are returned as single string
    // Separated by ,

  }, {
    key: "getFieldValue",
    value: function getFieldValue(name) {
      return new FormData(this.enForm).getAll(name).join(',');
    } // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value

  }, {
    key: "setFieldValue",
    value: function setFieldValue(name, value) {
      document.getElementsByName(name).forEach(function (field) {
        if ('type' in field) {
          switch (field.type) {
            case 'select-one':
            case 'select-multiple':
              var _iterator = _createForOfIteratorHelper(field.options),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var option = _step.value;

                  if (option.value == value) {
                    option.selected = true;
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              break;

            case 'checkbox':
            case 'radio':
              // @TODO: Try to trigger the onChange event
              if (field.value == value) {
                field.checked = true;
              }

              break;

            case 'textarea':
            case 'text':
            default:
              field.value = value;
          }
        }
      });
      this.enParseDependencies();
      return;
    } // Trigger EN Dependencies

  }, {
    key: "enParseDependencies",
    value: function enParseDependencies() {
      var _a, _b, _c, _d, _e;

      if (window.EngagingNetworks && typeof ((_e = (_d = (_c = (_b = (_a = window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.require) === null || _b === void 0 ? void 0 : _b._defined) === null || _c === void 0 ? void 0 : _c.enDependencies) === null || _d === void 0 ? void 0 : _d.dependencies) === null || _e === void 0 ? void 0 : _e.parseDependencies) === "function") {
        window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(window.EngagingNetworks.dependencies);

        if (ENGrid.getOption('Debug')) console.trace('EN Dependencies Triggered');
      }
    } // Return the status of the gift process (true if a donation has been made, otherwise false)

  }, {
    key: "getGiftProcess",
    value: function getGiftProcess() {
      if ('pageJson' in window) return window.pageJson.giftProcess;
      return null;
    } // Return the page count

  }, {
    key: "getPageCount",
    value: function getPageCount() {
      if ('pageJson' in window) return window.pageJson.pageCount;
      return null;
    } // Return the current page number

  }, {
    key: "getPageNumber",
    value: function getPageNumber() {
      if ('pageJson' in window) return window.pageJson.pageNumber;
      return null;
    } // Return the current page ID

  }, {
    key: "getPageID",
    value: function getPageID() {
      if ('pageJson' in window) return window.pageJson.campaignPageId;
      return 0;
    } // Return the current page type

  }, {
    key: "getPageType",
    value: function getPageType() {
      if ('pageJson' in window && 'pageType' in window.pageJson) {
        switch (window.pageJson.pageType) {
          case "e-card":
            return "ECARD";
            break;

          case "otherdatacapture":
            return "SURVEY";
            break;

          case "emailtotarget":
          case "advocacypetition":
            return "ADVOCACY";
            break;

          case "emailsubscribeform":
            return "SUBSCRIBEFORM";
            break;

          default:
            return "DONATION";
        }
      } else {
        return "DONATION";
      }
    } // Set body engrid data attributes

  }, {
    key: "setBodyData",
    value: function setBodyData(dataName, value) {
      var body = document.querySelector('body');
      body.setAttribute("data-engrid-".concat(dataName), value);
    } // Get body engrid data attributes

  }, {
    key: "getBodyData",
    value: function getBodyData(dataName) {
      var body = document.querySelector('body');
      return body.getAttribute("data-engrid-".concat(dataName));
    } // Return the option value

  }, {
    key: "getOption",
    value: function getOption(key) {
      return window.EngridOptions[key] || null;
    } // Load an external script

  }, {
    key: "loadJS",
    value: function loadJS(url) {
      var onload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var head = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var scriptTag = document.createElement('script');
      scriptTag.src = url;
      scriptTag.onload = onload;

      if (head) {
        document.getElementsByTagName("head")[0].appendChild(scriptTag);
        return;
      }

      document.getElementsByTagName("body")[0].appendChild(scriptTag);
      return;
    }
  }]);

  return ENGrid;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/donation-frequency.js




var DonationFrequency = /*#__PURE__*/function () {
  function DonationFrequency() {
    var _this = this;

    classCallCheck_classCallCheck(this, DonationFrequency);

    this._onFrequencyChange = new dist/* SimpleEventDispatcher */.FK();
    this._frequency = "onetime";
    this._recurring = "n";
    this._dispatch = true; // Watch the Radios for Changes

    document.addEventListener("change", function (e) {
      var element = e.target;

      if (element && element.name == "transaction.recurrpay") {
        _this.recurring = element.value; // When this element is a radio, that means you're between onetime and monthly only

        if (element.type == 'radio') {
          _this.frequency = element.value.toLowerCase() == 'n' ? 'onetime' : 'monthly'; // This field is hidden when transaction.recurrpay is radio

          engrid_ENGrid.setFieldValue('transaction.recurrfreq', _this.frequency.toUpperCase());
        }
      }

      if (element && element.name == "transaction.recurrfreq") {
        _this.frequency = element.value;
      }
    });
  }

  createClass_createClass(DonationFrequency, [{
    key: "frequency",
    get: function get() {
      return this._frequency;
    } // Every time we set a frequency, trigger the onFrequencyChange event
    ,
    set: function set(value) {
      this._frequency = value.toLowerCase() || 'onetime';
      if (this._dispatch) this._onFrequencyChange.dispatch(this._frequency);
      engrid_ENGrid.setBodyData('transaction-recurring-frequency', this._frequency);
    }
  }, {
    key: "recurring",
    get: function get() {
      return this._recurring;
    },
    set: function set(value) {
      this._recurring = value.toLowerCase() || 'n';
      engrid_ENGrid.setBodyData('transaction-recurring', this._recurring);
    }
  }, {
    key: "onFrequencyChange",
    get: function get() {
      return this._onFrequencyChange.asEvent();
    } // Set amount var with currently selected amount

  }, {
    key: "load",
    value: function load() {
      this.frequency = engrid_ENGrid.getFieldValue('transaction.recurrfreq');
      this.recurring = engrid_ENGrid.getFieldValue('transaction.recurrpay'); // ENGrid.enParseDependencies();
    } // Force a new recurrency

  }, {
    key: "setRecurrency",
    value: function setRecurrency(recurr) {
      var dispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // Run only if it is a Donation Page with a Recurrency
      if (!document.getElementsByName("transaction.recurrpay").length) {
        return;
      } // Set dispatch to be checked by the SET method


      this._dispatch = dispatch;
      engrid_ENGrid.setFieldValue("transaction.recurrpay", recurr.toUpperCase()); // Revert dispatch to default value (true)

      this._dispatch = true;
    } // Force a new frequency

  }, {
    key: "setFrequency",
    value: function setFrequency(freq) {
      var dispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // Run only if it is a Donation Page with a Frequency
      if (!document.getElementsByName("transaction.recurrfreq").length) {
        return;
      } // Set dispatch to be checked by the SET method


      this._dispatch = dispatch; // Search for the current amount on radio boxes

      var found = Array.from(document.querySelectorAll('input[name="transaction.recurrfreq"]')).filter(function (el) {
        return el instanceof HTMLInputElement && el.value == freq.toUpperCase();
      }); // We found the amount on the radio boxes, so check it

      if (found.length) {
        var freqField = found[0];
        freqField.checked = true;
        this.frequency = freq.toLowerCase();

        if (this.frequency === 'onetime') {
          this.setRecurrency("N", dispatch);
        } else {
          this.setRecurrency("Y", dispatch);
        }
      } // Revert dispatch to default value (true)


      this._dispatch = true;
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!DonationFrequency.instance) {
        DonationFrequency.instance = new DonationFrequency();
      }

      return DonationFrequency.instance;
    }
  }]);

  return DonationFrequency;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/processing-fees.js





var ProcessingFees = /*#__PURE__*/function () {
  function ProcessingFees() {
    var _this = this;

    classCallCheck_classCallCheck(this, ProcessingFees);

    this._onFeeChange = new dist/* SimpleEventDispatcher */.FK();
    this._amount = DonationAmount.getInstance();
    this._form = EnForm.getInstance();
    this._fee = 0;
    this._field = document.querySelector('input[name="supporter.processing_fees"]'); // console.log('%c Processing Fees Constructor', 'font-size: 30px; background-color: #000; color: #FF0');
    // Run only if it is a Donation Page with a Donation Amount field

    if (!document.getElementsByName("transaction.donationAmt").length) {
      return;
    } // Watch the Radios for Changes


    if (this._field instanceof HTMLInputElement) {
      // console.log('%c Processing Fees Start', 'font-size: 30px; background-color: #000; color: #FF0');
      this._field.addEventListener("change", function (e) {
        if (_this._field instanceof HTMLInputElement && _this._field.checked && !_this._subscribe) {
          _this._subscribe = _this._form.onSubmit.subscribe(function () {
            return _this.addFees();
          });
        }

        _this._onFeeChange.dispatch(_this.fee); // // console.log('%c Processing Fees Script Applied', 'font-size: 30px; background-color: #000; color: #FF0');

      });
    } // this._amount = amount;

  }

  createClass_createClass(ProcessingFees, [{
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
  }, {
    key: "calculateFees",
    value: function calculateFees() {
      if (this._field instanceof HTMLInputElement && this._field.checked && "dataset" in this._field) {
        var fees = Object.assign({
          processingfeepercentadded: "0",
          processingfeefixedamountadded: "0"
        }, this._field.dataset);
        var processing_fee = parseFloat(fees.processingfeepercentadded) / 100 * this._amount.amount + parseFloat(fees.processingfeefixedamountadded);
        return Math.round(processing_fee * 100) / 100;
      }

      return 0;
    } // Add Fees to Amount

  }, {
    key: "addFees",
    value: function addFees() {
      if (this._form.submit) {
        this._amount.setAmount(this._amount.amount + this.fee, false);
      }
    } // Remove Fees From Amount

  }, {
    key: "removeFees",
    value: function removeFees() {
      this._amount.setAmount(this._amount.amount - this.fee);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!ProcessingFees.instance) {
        ProcessingFees.instance = new ProcessingFees();
      }

      return ProcessingFees.instance;
    }
  }]);

  return ProcessingFees;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/index.js




;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/app.js






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var App = /*#__PURE__*/function (_ENGrid) {
  _inherits(App, _ENGrid);

  var _super = _createSuper(App);

  function App(options) {
    var _this;

    classCallCheck_classCallCheck(this, App);

    _this = _super.call(this); // Events

    _this._form = EnForm.getInstance();
    _this._fees = ProcessingFees.getInstance();
    _this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
    _this._frequency = DonationFrequency.getInstance();

    _this.shouldScroll = function () {
      // If you find a error, scroll
      if (document.querySelector('.en__errorHeader')) {
        return true;
      } // Try to match the iframe referrer URL by testing valid EN Page URLs


      var referrer = document.referrer;
      var enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/); // Scroll if the Regex matches, don't scroll otherwise

      return enURLPattern.test(referrer);
    };

    _this.options = Object.assign(Object.assign({}, OptionsDefaults), options); // Add Options to window

    window.EngridOptions = _this.options; // Document Load

    if (document.readyState !== "loading") {
      _this.run();
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        _this.run();
      });
    } // Window Load


    window.onload = function () {
      _this.onLoad();
    }; // Window Resize


    window.onresize = function () {
      _this.onResize();
    };

    return _this;
  }

  createClass_createClass(App, [{
    key: "run",
    value: function run() {
      var _this2 = this;

      // Enable debug if available is the first thing
      if (this.options.Debug || App.getUrlParameter('debug') == 'true') App.setBodyData('debug', ''); // IE Warning

      new IE(); // Page Background

      new PageBackground(); // TODO: Abstract everything to the App class so we can remove custom-methods

      inputPlaceholder();
      watchInmemField();
      watchGiveBySelectField();
      SetEnFieldOtherAmountRadioStepValue();
      simpleUnsubscribe();
      contactDetailLabels();
      easyEdit();
      enInput.init();
      new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
      new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
      new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-"); // Controls if the Theme has a the "Debug Bar"
      // legacy.debugBar();
      // Client onSubmit and onError functions

      this._form.onSubmit.subscribe(function () {
        return _this2.onSubmit();
      });

      this._form.onError.subscribe(function () {
        return _this2.onError();
      });

      this._form.onValidate.subscribe(function () {
        return _this2.onValidate();
      }); // Event Listener Examples


      this._amount.onAmountChange.subscribe(function (s) {
        return console.log("Live Amount: ".concat(s));
      });

      this._frequency.onFrequencyChange.subscribe(function (s) {
        return console.log("Live Frequency: ".concat(s));
      });

      this._form.onSubmit.subscribe(function (s) {
        return console.log('Submit: ', s);
      });

      this._form.onError.subscribe(function (s) {
        return console.log('Error:', s);
      });

      window.enOnSubmit = function () {
        _this2._form.dispatchSubmit();

        return _this2._form.submit;
      };

      window.enOnError = function () {
        _this2._form.dispatchError();
      };

      window.enOnValidate = function () {
        _this2._form.dispatchValidate();

        return _this2._form.validate;
      }; // iFrame Logic


      this.loadIFrame(); // Live Variables

      new LiveVariables(this.options); // Dynamically set Recurrency Frequency

      new setRecurrFreq(); // Upsell Lightbox

      new UpsellLightbox(); // On the end of the script, after all subscribers defined, let's load the current value

      this._amount.load();

      this._frequency.load(); // Simple Country Select


      new SimpleCountrySelect(); // Add Image Attribution

      if (this.options.MediaAttribution) new MediaAttribution(); // Apple Pay

      if (this.options.applePay) new ApplePay(); // Capitalize Fields

      if (this.options.CapitalizeFields) new CapitalizeFields(); // Click To Expand

      if (this.options.ClickToExpand) new ClickToExpand();
      if (this.options.SkipToMainContentLink) new SkipToMainContentLink();
      if (this.options.SrcDefer) new SrcDefer(); // Progress Bar

      if (this.options.ProgressBar) new ProgressBar();
      if (this.options.NeverBounceAPI) new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField);
      this.setDataAttributes();
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      if (this.options.onLoad) {
        this.options.onLoad();
      }

      if (this.inIframe()) {
        // Scroll to top of iFrame
        if (App.debug) console.log("iFrame Event - window.onload");
        sendIframeHeight();
        window.parent.postMessage({
          scroll: this.shouldScroll()
        }, "*"); // On click fire the resize event

        document.addEventListener("click", function (e) {
          if (App.debug) console.log("iFrame Event - click");
          setTimeout(function () {
            sendIframeHeight();
          }, 100);
        });
      }
    }
  }, {
    key: "onResize",
    value: function onResize() {
      if (this.options.onResize) {
        this.options.onResize();
      }

      if (this.inIframe()) {
        if (App.debug) console.log("iFrame Event - window.onload");
        sendIframeHeight();
      }
    }
  }, {
    key: "onValidate",
    value: function onValidate() {
      if (this.options.onValidate) {
        if (App.debug) console.log("Client onValidate Triggered");
        this.options.onValidate();
      }
    }
  }, {
    key: "onSubmit",
    value: function onSubmit() {
      if (this.options.onSubmit) {
        if (App.debug) console.log("Client onSubmit Triggered");
        this.options.onSubmit();
      }

      if (this.inIframe()) {
        sendIframeFormStatus('submit');
      }
    }
  }, {
    key: "onError",
    value: function onError() {
      if (this.options.onError) {
        if (App.debug) console.log("Client onError Triggered");
        this.options.onError();
      }
    }
  }, {
    key: "inIframe",
    value: function inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
  }, {
    key: "loadIFrame",
    value: function loadIFrame() {
      if (this.inIframe()) {
        // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
        App.setBodyData("embedded", ""); // Fire the resize event

        if (App.debug) console.log("iFrame Event - First Resize");
        sendIframeHeight();
      }
    } // Use this function to add any Data Attributes to the Body tag

  }, {
    key: "setDataAttributes",
    value: function setDataAttributes() {
      // Add a body banner data attribute if it's empty
      if (!document.querySelector('.body-banner img')) {
        App.setBodyData('body-banner', 'empty');
      }
    }
  }]);

  return App;
}(engrid_ENGrid);
// EXTERNAL MODULE: ../engrid-scripts/node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(256);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/apple-pay.js




var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};



/*global window */

var ApplePaySession = window.ApplePaySession;
var merchantIdentifier = window.merchantIdentifier;
var merchantDomainName = window.merchantDomainName;
var merchantDisplayName = window.merchantDisplayName;
var merchantSessionIdentifier = window.merchantSessionIdentifier;
var merchantNonce = window.merchantNonce;
var merchantEpochTimestamp = window.merchantEpochTimestamp;
var merchantSignature = window.merchantSignature;
var merchantCountryCode = window.merchantCountryCode;
var merchantCurrencyCode = window.merchantCurrencyCode;
var merchantSupportedNetworks = window.merchantSupportedNetworks;
var merchantCapabilities = window.merchantCapabilities;
var merchantTotalLabel = window.merchantTotalLabel;
var ApplePay = /*#__PURE__*/function () {
  function ApplePay() {
    classCallCheck_classCallCheck(this, ApplePay);

    this.applePay = document.querySelector('.en__field__input.en__field__input--radio[value="applepay"]');
    this._amount = DonationAmount.getInstance();
    this._form = EnForm.getInstance();
    this.checkApplePay();
  }

  createClass_createClass(ApplePay, [{
    key: "checkApplePay",
    value: function checkApplePay() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regenerator_default().mark(function _callee() {
        var _this = this;

        var pageform, promise, applePayEnabled, applePayWrapper;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                pageform = document.querySelector("form.en__component--page");

                if (!(!this.applePay || !window.hasOwnProperty('ApplePaySession'))) {
                  _context.next = 4;
                  break;
                }

                if (engrid_ENGrid.debug) console.log('Apple Pay DISABLED');
                return _context.abrupt("return", false);

              case 4:
                promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
                applePayEnabled = false;
                _context.next = 8;
                return promise.then(function (canMakePayments) {
                  applePayEnabled = canMakePayments;

                  if (canMakePayments) {
                    var input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", "PkPaymentToken");
                    input.setAttribute("id", "applePayToken");
                    pageform.appendChild(input);

                    _this._form.onSubmit.subscribe(function () {
                      return _this.onPayClicked();
                    });
                  }
                });

              case 8:
                if (engrid_ENGrid.debug) console.log('applePayEnabled', applePayEnabled);
                applePayWrapper = this.applePay.closest('.en__field__item');

                if (applePayEnabled) {
                  // Set Apple Pay Class
                  applePayWrapper === null || applePayWrapper === void 0 ? void 0 : applePayWrapper.classList.add('applePayWrapper');
                } else {
                  // Hide Apple Pay Wrapper
                  if (applePayWrapper) applePayWrapper.style.display = 'none';
                }

                return _context.abrupt("return", applePayEnabled);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "performValidation",
    value: function performValidation(url) {
      return new Promise(function (resolve, reject) {
        var merchantSession = {};
        merchantSession.merchantIdentifier = merchantIdentifier;
        merchantSession.merchantSessionIdentifier = merchantSessionIdentifier;
        merchantSession.nonce = merchantNonce;
        merchantSession.domainName = merchantDomainName;
        merchantSession.epochTimestamp = merchantEpochTimestamp;
        merchantSession.signature = merchantSignature;
        var validationData = "&merchantIdentifier=" + merchantIdentifier + "&merchantDomain=" + merchantDomainName + "&displayName=" + merchantDisplayName;
        var validationUrl = '/ea-dataservice/rest/applepay/validateurl?url=' + url + validationData;
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
          var data = JSON.parse(this.responseText);
          if (engrid_ENGrid.debug) console.log('Apple Pay Validation', data);
          resolve(data);
        };

        xhr.onerror = reject;
        xhr.open('GET', validationUrl);
        xhr.send();
      });
    }
  }, {
    key: "log",
    value: function log(name, msg) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/ea-dataservice/rest/applepay/log?name=' + name + '&msg=' + msg);
      xhr.send();
    }
  }, {
    key: "sendPaymentToken",
    value: function sendPaymentToken(token) {
      return new Promise(function (resolve, reject) {
        resolve(true);
      });
    }
  }, {
    key: "onPayClicked",
    value: function onPayClicked() {
      var enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
      var applePayToken = document.getElementById("applePayToken");
      var formClass = this._form; // Only work if Payment Type is Apple Pay

      if (enFieldPaymentType.value == 'applepay' && applePayToken.value == '') {
        try {
          var donationAmount = this._amount.amount;
          var request = {
            supportedNetworks: merchantSupportedNetworks,
            merchantCapabilities: merchantCapabilities,
            countryCode: merchantCountryCode,
            currencyCode: merchantCurrencyCode,
            total: {
              label: merchantTotalLabel,
              amount: donationAmount
            }
          };
          var session = new ApplePaySession(1, request);
          var thisClass = this;

          session.onvalidatemerchant = function (event) {
            thisClass.performValidation(event.validationURL).then(function (merchantSession) {
              if (engrid_ENGrid.debug) console.log('Apple Pay merchantSession', merchantSession);
              session.completeMerchantValidation(merchantSession);
            });
          };

          session.onpaymentauthorized = function (event) {
            thisClass.sendPaymentToken(event.payment.token).then(function (success) {
              if (engrid_ENGrid.debug) console.log('Apple Pay Token', event.payment.token);
              document.getElementById("applePayToken").value = JSON.stringify(event.payment.token);
              formClass.submitForm();
            });
          };

          session.oncancel = function (event) {
            if (engrid_ENGrid.debug) console.log('Cancelled', event);
            alert("You cancelled. Sorry it didn't work out.");
            formClass.dispatchError();
          };

          session.begin();
          this._form.submit = false;
          return false;
        } catch (e) {
          alert("Developer mistake: '" + e.message + "'");
          formClass.dispatchError();
        }
      }

      this._form.submit = true;
      return true;
    }
  }]);

  return ApplePay;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/capitalize-fields.js




var CapitalizeFields = /*#__PURE__*/function () {
  function CapitalizeFields() {
    var _this = this;

    classCallCheck_classCallCheck(this, CapitalizeFields);

    this._form = EnForm.getInstance();

    this._form.onSubmit.subscribe(function () {
      return _this.capitalizeFields('en__field_supporter_firstName', 'en__field_supporter_lastName', 'en__field_supporter_address1', 'en__field_supporter_city');
    });
  }

  createClass_createClass(CapitalizeFields, [{
    key: "capitalizeFields",
    value: function capitalizeFields() {
      var _this2 = this;

      for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      fields.forEach(function (f) {
        return _this2.capitalize(f);
      });
    }
  }, {
    key: "capitalize",
    value: function capitalize(f) {
      var field = document.getElementById(f);

      if (field) {
        field.value = field.value.replace(/\w\S*/g, function (w) {
          return w.replace(/^\w/, function (c) {
            return c.toUpperCase();
          });
        });
        if (engrid_ENGrid.debug) console.log('Capitalized', field.value);
      }

      return true;
    }
  }]);

  return CapitalizeFields;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/click-to-expand.js

// Depends on engrid-click-to-expand.scss to work
 // Works when the user has adds ".click-to-expand" as a class to any field

var ClickToExpand = function ClickToExpand() {
  classCallCheck_classCallCheck(this, ClickToExpand);

  this.clickToExpandWrapper = document.querySelectorAll('div.click-to-expand');

  if (this.clickToExpandWrapper.length) {
    this.clickToExpandWrapper.forEach(function (element) {
      var content = element.innerHTML;
      var wrapper_html = '<div class="click-to-expand-cta"></div><div class="click-to-expand-text-wrapper" tabindex="0">' + content + '</div>';
      element.innerHTML = wrapper_html;
      element.addEventListener("click", function (event) {
        if (event) {
          if (engrid_ENGrid.debug) console.log("A click-to-expand div was clicked");
          element.classList.add("expanded");
        }
      });
      element.addEventListener("keydown", function (event) {
        if (event.key === 'Enter') {
          if (engrid_ENGrid.debug) console.log("A click-to-expand div had the 'Enter' key pressed on it");
          element.classList.add("expanded");
        } else if (event.key === ' ') {
          if (engrid_ENGrid.debug) console.log("A click-to-expand div had the 'Spacebar' key pressed on it");
          element.classList.add("expanded");
          event.preventDefault(); // Prevents the page from scrolling

          event.stopPropagation(); // Prevent a console error generated by LastPass https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
        }
      });
    });
  }
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/custom-methods.js

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
    /* @TODO Review Engaging Networks to see if this is still needed */

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
  }; // Occurs when the web browser autofills a form fields
  // REF: engrid-autofill.scss
  // REF: https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7


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
var removeClassesByPrefix = function removeClassesByPrefix(el, prefix) {
  for (var i = el.classList.length - 1; i >= 0; i--) {
    if (el.classList[i].startsWith(prefix)) {
      el.classList.remove(el.classList[i]);
    }
  }
};
var debugBar = function debugBar() {
  if (window.location.href.indexOf("debug") != -1 || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
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
        _buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' + '<button id="fancy-errors-toggle" type="button">Toggle Fancy Errors</button>');
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

    if (document.getElementById("layout-toggle")) {
      var _debugTemplateButton = document.getElementById("layout-toggle");

      if (_debugTemplateButton) {
        _debugTemplateButton.addEventListener("click", function () {
          layoutToggle();
        }, false);
      }
    }

    if (document.getElementById("page-edit")) {
      var _debugTemplateButton2 = document.getElementById("page-edit");

      if (_debugTemplateButton2) {
        _debugTemplateButton2.addEventListener("click", function () {
          pageEdit();
        }, false);
      }
    }

    if (document.getElementById("debug-close")) {
      var _debugTemplateButton3 = document.getElementById("debug-close");

      if (_debugTemplateButton3) {
        _debugTemplateButton3.addEventListener("click", function () {
          debugClose();
        }, false);
      }
    }

    var fancyErrorsToggle = function fancyErrorsToggle() {
      if (enGrid) {
        enGrid.classList.toggle("fancy-errors");
      }
    };

    var pageEdit = function pageEdit() {
      window.location.href = window.location.href + "?edit";
    };

    var layoutToggle = function layoutToggle() {
      if (enGrid) {
        if (enGrid.classList.contains("layout-centercenter1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerright1col");
        } else if (enGrid.classList.contains("layout-centerright1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerleft1col");
        } else if (enGrid.classList.contains("layout-centerleft1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-embedded");
        } else if (enGrid.classList.contains("layout-embedded")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col");
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
  }
};
var inputPlaceholder = function inputPlaceholder() {
  // FIND ALL COMMON INPUT FIELDS
  var enFieldDonationAmt = document.querySelector(".en__field--donationAmt.en__field--withOther .en__field__input--other");
  var enFieldFirstName = document.querySelector("input#en__field_supporter_firstName");
  var enFieldLastName = document.querySelector("input#en__field_supporter_lastName");
  var enFieldEmailAddress = document.querySelector("input#en__field_supporter_emailAddress");
  var enFieldPhoneNumber = document.querySelector("#inputen__field_supporter_phoneNumber");
  var enFieldPhoneNumber2 = document.querySelector("input#en__field_supporter_phoneNumber2");
  var enFieldCountry = document.querySelector("input#en__field_supporter_country");
  var enFieldAddress1 = document.querySelector("input#en__field_supporter_address1");
  var enFieldAddress2 = document.querySelector("input#en__field_supporter_address2");
  var enFieldCity = document.querySelector("input#en__field_supporter_city"); // let enFieldRegion = document.querySelector("input#en__field_supporter_region") as HTMLInputElement

  var enFieldPostcode = document.querySelector("input#en__field_supporter_postcode");
  var enFieldHonname = document.querySelector("input#en__field_transaction_honname");
  var enFieldInfname = document.querySelector("input#en__field_transaction_infname");
  var enFieldInfemail = document.querySelector("input#en__field_transaction_infemail");
  var enFieldInfcountry = document.querySelector("input#en__field_transaction_infcountry");
  var enFieldInfadd1 = document.querySelector("input#en__field_transaction_infadd1");
  var enFieldInfadd2 = document.querySelector("input#en__field_transaction_infadd2");
  var enFieldInfcity = document.querySelector("input#en__field_transaction_infcity");
  var enFieldInfpostcd = document.querySelector("input#en__field_transaction_infpostcd");
  var enFieldGftrsn = document.querySelector("input#en__field_transaction_gftrsn");
  var enFieldCcnumber = document.querySelector("input#en__field_transaction_ccnumber");
  var enFieldCcexpire = document.querySelector("input#en__field_transaction_ccexpire");
  var enFieldCcvv = document.querySelector("input#en__field_transaction_ccvv");
  var enFieldBankAccountNumber = document.querySelector("input#en__field_supporter_bankAccountNumber");
  var enFieldBankRoutingNumber = document.querySelector("input#en__field_supporter_bankRoutingNumber"); // CHANGE FIELD INPUT TYPES

  if (enFieldDonationAmt) {
    enFieldDonationAmt.setAttribute("inputmode", "numeric");
  } // ADD FIELD PLACEHOLDERS


  var enAddInputPlaceholder = document.querySelector("[data-engrid-add-input-placeholders]");

  if (enAddInputPlaceholder && enFieldDonationAmt) {
    enFieldDonationAmt.placeholder = "Other Amount";
  }

  if (enAddInputPlaceholder && enFieldFirstName) {
    enFieldFirstName.placeholder = "First Name";
  }

  if (enAddInputPlaceholder && enFieldLastName) {
    enFieldLastName.placeholder = "Last Name";
  }

  if (enAddInputPlaceholder && enFieldEmailAddress) {
    enFieldEmailAddress.placeholder = "Email Address";
  }

  if (enAddInputPlaceholder && enFieldPhoneNumber) {
    enFieldPhoneNumber.placeholder = "Phone Number";
  }

  if (enAddInputPlaceholder && enFieldPhoneNumber2) {
    enFieldPhoneNumber2.placeholder = "000-000-0000 (Optional)";
  }

  if (enAddInputPlaceholder && enFieldCountry) {
    enFieldCountry.placeholder = "Country";
  }

  if (enAddInputPlaceholder && enFieldAddress1) {
    enFieldAddress1.placeholder = "Street Address";
  }

  if (enAddInputPlaceholder && enFieldAddress2) {
    enFieldAddress2.placeholder = "Apt., ste., bldg.";
  }

  if (enAddInputPlaceholder && enFieldCity) {
    enFieldCity.placeholder = "City";
  } // if (enAddInputPlaceholder && enFieldRegion){enFieldRegion.placeholder = "TBD";}


  if (enAddInputPlaceholder && enFieldPostcode) {
    enFieldPostcode.placeholder = "Postal Code";
  }

  if (enAddInputPlaceholder && enFieldHonname) {
    enFieldHonname.placeholder = "Honoree Name";
  }

  if (enAddInputPlaceholder && enFieldInfname) {
    enFieldInfname.placeholder = "Recipient Name";
  }

  if (enAddInputPlaceholder && enFieldInfemail) {
    enFieldInfemail.placeholder = "Recipient Email Address";
  }

  if (enAddInputPlaceholder && enFieldInfcountry) {
    enFieldInfcountry.placeholder = "TBD";
  }

  if (enAddInputPlaceholder && enFieldInfadd1) {
    enFieldInfadd1.placeholder = "Recipient Street Address";
  }

  if (enAddInputPlaceholder && enFieldInfadd2) {
    enFieldInfadd2.placeholder = "Recipient Apt., ste., bldg.";
  }

  if (enAddInputPlaceholder && enFieldInfcity) {
    enFieldInfcity.placeholder = "Recipient City";
  }

  if (enAddInputPlaceholder && enFieldInfpostcd) {
    enFieldInfpostcd.placeholder = "Recipient Postal Code";
  }

  if (enAddInputPlaceholder && enFieldGftrsn) {
    enFieldGftrsn.placeholder = "Reason for your gift";
  }

  if (enAddInputPlaceholder && enFieldCcnumber) {
    enFieldCcnumber.placeholder = "•••• •••• •••• ••••";
  }

  if (enAddInputPlaceholder && enFieldCcexpire) {
    enFieldCcexpire.placeholder = "MM / YY";
  }

  if (enAddInputPlaceholder && enFieldCcvv) {
    enFieldCcvv.placeholder = "CVV";
  }

  if (enAddInputPlaceholder && enFieldBankAccountNumber) {
    enFieldBankAccountNumber.placeholder = "Bank Account Number";
  }

  if (enAddInputPlaceholder && enFieldBankRoutingNumber) {
    enFieldBankRoutingNumber.placeholder = "Bank Routing Number";
  }
};
var watchInmemField = function watchInmemField() {
  var enFieldTransactionInmem = document.getElementById("en__field_transaction_inmem");

  var handleEnFieldTransactionInmemChange = function handleEnFieldTransactionInmemChange(e) {
    if (enGrid) {
      if (enFieldTransactionInmem.checked) {
        enGrid.classList.add("has-give-in-honor");
      } else {
        enGrid.classList.remove("has-give-in-honor");
      }
    }
  }; // Check Give In Honor State on Page Load


  if (enFieldTransactionInmem && enGrid) {
    // Run on page load
    if (enFieldTransactionInmem.checked) {
      enGrid.classList.add("has-give-in-honor");
    } else {
      enGrid.classList.remove("has-give-in-honor");
    } // Run on change


    enFieldTransactionInmem.addEventListener("change", handleEnFieldTransactionInmemChange);
  }
}; // @TODO Refactor (low priority)

var watchGiveBySelectField = function watchGiveBySelectField() {
  var enFieldGiveBySelect = document.querySelector(".en__field--give-by-select");
  var transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
  var enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
  var enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
  var prefix = "has-give-by-";

  var handleEnFieldGiveBySelect = function handleEnFieldGiveBySelect(e) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
    console.log("enFieldGiveBySelectCurrentValue:", enFieldGiveBySelectCurrentValue);

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-card");
      } // enFieldPaymentType.value = "card";


      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "ach") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-ach");
      }

      enFieldPaymentType.value = "ach";
      enFieldPaymentType.value = "ACH";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-paypal");
      }

      enFieldPaymentType.value = "paypal";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "applepay") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-applepay");
      }

      enFieldPaymentType.value = "applepay";
    }
  }; // Check Giving Frequency on page load


  if (enFieldGiveBySelect) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-card");
      } // enFieldPaymentType.value = "card";


      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "ach") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-check");
      }

      enFieldPaymentType.value = "ach";
      enFieldPaymentType.value = "ACH";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-paypal");
      }

      enFieldPaymentType.value = "paypal";
      enFieldPaymentType.value = "Paypal";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "applepay") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-applepay");
      }

      enFieldPaymentType.value = "applepay";
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
/* The Donation Other Giving Amount is a "Number" type input field.
   It also has its step value set to .01 so it increments up/down by once whole cent.
   This step also client-side prevents users from entering a fraction of a penny.
   And it has a min set to 5 so nothing less can be submitted
*/

var SetEnFieldOtherAmountRadioStepValue = function SetEnFieldOtherAmountRadioStepValue() {
  var enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt .en__field__input--other");

  if (enFieldOtherAmountRadio) {
    enFieldOtherAmountRadio.setAttribute("step", ".01");
    enFieldOtherAmountRadio.setAttribute("type", "number");
    enFieldOtherAmountRadio.setAttribute("min", "5");
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
      return false;

    case "1":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "2":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "3":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-amex");
      return "amex";

    case "4":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-visa");
      return "visa";

    case "5":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-mastercard");
      return "mastercard";

    case "6":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-discover");
      return "discover";

    case "7":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "8":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "9":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    default:
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-na");
      return false;
  }
};
/*
 * Handlers
 */


var handleCCUpdate = function handleCCUpdate() {
  var card_type = getCardType(field_credit_card.value);
  var card_values = {
    amex: ['amex', 'american express', 'americanexpress', 'amx', 'ax'],
    visa: ['visa', 'vi'],
    mastercard: ['mastercard', 'master card', 'mc'],
    discover: ['discover', 'di']
  };
  var payment_text = field_payment_type.options[field_payment_type.selectedIndex].text;

  if (card_type && payment_text != card_type) {
    field_payment_type.value = Array.from(field_payment_type.options).filter(function (d) {
      return card_values[card_type].indexOf(d.value.toLowerCase());
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
}; // @TODO Adds a URL path "/edit" that can be used to easily arrive at the editable version of the current page. Should automatically detect if the client is using us.e-activist or e-activist and adjust accoridngly. Should also pass in page number and work for all page types without each needing to be specified.
// @TODO Remove hard coded client values

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
// @TODO Should this be expanded where if a select only has one option it's always hidden?

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
} // @TODO "Footer in Viewport Check" should be made its own TS file


var contentFooter = document.querySelector(".content-footer");

var isInViewport = function isInViewport(e) {
  var distance = e.getBoundingClientRect(); // console.log("Footer: ", distance);

  return distance.top >= 0 && distance.left >= 0 && distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) && distance.right <= (window.innerWidth || document.documentElement.clientWidth);
}; // Checks to see if the page is so short, the footer is above the fold. If the footer is above the folde we'll use this class to ensure at a minimum the page fills the full viewport height.


if (contentFooter && isInViewport(contentFooter)) {
  document.getElementsByTagName("BODY")[0].setAttribute("data-engrid-footer-above-fold", "");
} else {
  document.getElementsByTagName("BODY")[0].setAttribute("data-engrid-footer-below-fold", "");
}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/cookie.js
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
      var name = parts[0].replace(rdecode, decodeURIComponent);
      result[name] = cookie.replace(rdecode, decodeURIComponent);
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
  document.cookie = encode(name, value, Object.assign({
    path: "/"
  }, attributes));
}
function remove(name, attributes) {
  set(name, "", Object.assign(Object.assign({}, attributes), {
    expires: -1
  }));
}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/ie.js



var IE = /*#__PURE__*/function () {
  function IE() {
    classCallCheck_classCallCheck(this, IE);

    this.debug = false;
    this.overlay = document.createElement("div");

    var isIE = function isIE() {
      return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
    }; // If it's not IE, get out!


    if (!isIE()) return;
    var markup = "\n    <div class=\"ieModal-container\">\n        <a href=\"#\" class=\"button-close\"></a>\n        <div id=\"ieModalContent\">\n        <strong>Attention: </strong>\n        Your browser is no longer supported and will not receive any further security updates. Websites may no longer display or behave correctly as they have in the past. \n        Please transition to using <a href=\"https://www.microsoft.com/edge\">Microsoft Edge</a>, Microsoft's latest browser, to continue enjoying the modern web.\n        </div>\n    </div>";
    var overlay = document.createElement("div");
    overlay.id = "ieModal";
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
    this.open();
  }

  createClass_createClass(IE, [{
    key: "open",
    value: function open() {
      var hideModal = get("hide_ieModal"); // Get cookie
      // If we have a cookie AND no Debug, get out

      if (hideModal && !this.debug) return; // Show Modal

      this.overlay.classList.remove("is-hidden");
    }
  }, {
    key: "close",
    value: function close(e) {
      e.preventDefault();
      set("hide_ieModal", "1", {
        expires: 1
      }); // Create one day cookie

      this.overlay.classList.add("is-hidden");
    }
  }]);

  return IE;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/iframe.js

var sendIframeHeight = function sendIframeHeight() {
  var height = document.body.offsetHeight;
  console.log("Sending iFrame height of: ", height, "px"); // check the message is being sent correctly

  window.parent.postMessage({
    frameHeight: height,
    pageNumber: engrid_ENGrid.getPageNumber(),
    pageCount: engrid_ENGrid.getPageCount(),
    giftProcess: engrid_ENGrid.getGiftProcess()
  }, "*");
};
var sendIframeFormStatus = function sendIframeFormStatus(status) {
  window.parent.postMessage({
    status: status,
    pageNumber: engrid_ENGrid.getPageNumber(),
    pageCount: engrid_ENGrid.getPageCount(),
    giftProcess: engrid_ENGrid.getGiftProcess()
  }, "*");
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/media-attribution.js


/*
  Looks for specially crafted <img> links and will transform its markup to display an attribution overlay on top of the image
  Depends on "_engrid-media-attribution.scss" for styling
  
  Example Image Input
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="© Jane Doe 1">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="© John Doe 2" data-attribution-source-link="https://www.google.com/">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="© Max Doe 3" data-attribution-source-link="https://www.google.com/" data-attribution-hide-overlay>

  Example Video Input (Doesn't currently visually display)
  @TODO Video tags are processed but their <figcaption> is not visually displayed. Need to update "_engrid-media-attribution.scss"
  <video poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-attribution-source="© Jane Doe 1" data-attribution-source-link="https://www.google.com/"> <source data-src="https://player.vimeo.com/external/123456789.hd.mp4?s=987654321&amp;profile_id=123" type="video/mp4"></video>

  Example Image Output
  <figure class="media-with-attribution"><img src="https://via.placeholder.com/300x300" data-src="https://via.placeholder.com/300x300" data-attribution-source="Jane Doe 1"><figattribution class="attribution-bottomright">Jane Doe 1</figattribution></figure>
*/

var MediaAttribution = function MediaAttribution() {
  classCallCheck_classCallCheck(this, MediaAttribution);

  // Find all images with attribution but not with the "data-attribution-hide-overlay" attribute
  this.mediaWithAttribution = document.querySelectorAll("img[data-attribution-source]:not([data-attribution-hide-overlay]), video[data-attribution-source]:not([data-attribution-hide-overlay])");
  this.mediaWithAttribution.forEach(function (element) {
    if (engrid_ENGrid.debug) console.log("The following image was found with data attribution fields on it. It's markup will be changed to add caption support.", element); // Creates the wapping <figure> element

    var figure = document.createElement('figure');
    figure.classList.add("media-with-attribution"); // Moves the <img> inside its <figure> element

    var mediaWithAttributionParent = element.parentNode;

    if (mediaWithAttributionParent) {
      mediaWithAttributionParent.insertBefore(figure, element);
      figure.appendChild(element);
      var mediaWithAttributionElement = element; // Append the <figcaption> element after the <img> and conditionally add the Source's Link to it

      var attributionSource = mediaWithAttributionElement.dataset.attributionSource;

      if (attributionSource) {
        var attributionSourceLink = mediaWithAttributionElement.dataset.attributionSourceLink;

        if (attributionSourceLink) {
          mediaWithAttributionElement.insertAdjacentHTML('afterend', '<figattribution><a href="' + decodeURIComponent(attributionSourceLink) + '" target="_blank" tabindex="-1">' + attributionSource + '</a></figure>');
        } else {
          mediaWithAttributionElement.insertAdjacentHTML('afterend', '<figattribution>' + attributionSource + '</figure>');
        }
      }
    }
  });
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/live-variables.js




var LiveVariables = /*#__PURE__*/function () {
  function LiveVariables(options) {
    var _this = this;

    classCallCheck_classCallCheck(this, LiveVariables);

    var _a;

    this._amount = DonationAmount.getInstance();
    this._fees = ProcessingFees.getInstance();
    this._frequency = DonationFrequency.getInstance();
    this._form = EnForm.getInstance();
    this.multiplier = 1 / 12;
    this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
    this.submitLabel = ((_a = document.querySelector(".en__submit button")) === null || _a === void 0 ? void 0 : _a.innerHTML) || "Donate";

    this._amount.onAmountChange.subscribe(function () {
      return _this.changeSubmitButton();
    });

    this._amount.onAmountChange.subscribe(function () {
      return _this.changeLiveAmount();
    });

    this._amount.onAmountChange.subscribe(function () {
      return _this.changeLiveUpsellAmount();
    });

    this._fees.onFeeChange.subscribe(function () {
      return _this.changeLiveAmount();
    });

    this._fees.onFeeChange.subscribe(function () {
      return _this.changeLiveUpsellAmount();
    });

    this._fees.onFeeChange.subscribe(function () {
      return _this.changeSubmitButton();
    });

    this._frequency.onFrequencyChange.subscribe(function () {
      return _this.swapAmounts();
    });

    this._frequency.onFrequencyChange.subscribe(function () {
      return _this.changeLiveFrequency();
    });

    this._frequency.onFrequencyChange.subscribe(function () {
      return _this.changeRecurrency();
    });

    this._frequency.onFrequencyChange.subscribe(function () {
      return _this.changeSubmitButton();
    });

    this._form.onSubmit.subscribe(function () {
      return _this.loadingSubmitButton();
    });

    this._form.onError.subscribe(function () {
      return _this.changeSubmitButton();
    }); // Watch the monthly-upsell links


    document.addEventListener("click", function (e) {
      var element = e.target;

      if (element) {
        if (element.classList.contains("monthly-upsell")) {
          _this.upsold(e);
        } else if (element.classList.contains("form-submit")) {
          e.preventDefault();

          _this._form.submitForm();
        }
      }
    });
  }

  createClass_createClass(LiveVariables, [{
    key: "getAmountTxt",
    value: function getAmountTxt() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var _a, _b;

      var symbol = (_a = this.options.CurrencySymbol) !== null && _a !== void 0 ? _a : '$';
      var separator = (_b = this.options.CurrencySeparator) !== null && _b !== void 0 ? _b : '.';
      var amountTxt = Number.isInteger(amount) ? symbol + amount : symbol + amount.toFixed(2).replace('.', separator);
      return amount > 0 ? amountTxt : "";
    }
  }, {
    key: "getUpsellAmountTxt",
    value: function getUpsellAmountTxt() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var amountTxt = this.options.CurrencySymbol + Math.ceil(amount / 5) * 5;
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
    value: function changeSubmitButton() {
      var submit = document.querySelector(".en__submit button");
      var amount = this.getAmountTxt(this._amount.amount + this._fees.fee);
      var frequency = this._frequency.frequency == "onetime" ? "" : this._frequency.frequency == "annual" ? "annually" : this._frequency.frequency;
      var label = this.submitLabel;

      if (amount) {
        label = label.replace("$AMOUNT", amount);
        label = label.replace("$FREQUENCY", frequency);
      } else {
        label = label.replace("$AMOUNT", '');
        label = label.replace("$FREQUENCY", '');
      }

      if (submit && label) {
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
        return elem.innerHTML = _this4._frequency.frequency == "onetime" ? "" : _this4._frequency.frequency;
      });
    }
  }, {
    key: "changeRecurrency",
    value: function changeRecurrency() {
      var recurrpay = document.querySelector("[name='transaction.recurrpay']");

      if (recurrpay && recurrpay.type != 'radio') {
        recurrpay.value = this._frequency.frequency == 'onetime' ? 'N' : 'Y';
        this._frequency.recurring = recurrpay.value;
        if (engrid_ENGrid.getOption('Debug')) console.log('Recurpay Changed!');
      }
    }
  }, {
    key: "swapAmounts",
    value: function swapAmounts() {
      if ("EngridAmounts" in window && this._frequency.frequency in window.EngridAmounts) {
        var loadEnAmounts = function loadEnAmounts(amountArray) {
          var ret = [];

          for (var amount in amountArray.amounts) {
            ret.push({
              selected: amountArray.amounts[amount] === amountArray["default"],
              label: amount,
              value: amountArray.amounts[amount].toString()
            });
          }

          return ret;
        };

        window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), {
          ignoreCurrentValue: !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed()
        });

        this._amount.load();

        if (engrid_ENGrid.getOption('Debug')) console.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
      }
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
        enFieldOtherAmount.value = this.getUpsellAmountRaw(this._amount.amount * this.multiplier);

        this._amount.load();

        this._frequency.load();

        if (enFieldOtherAmount.parentElement) {
          enFieldOtherAmount.parentElement.classList.remove("en__field__item--hidden");
        }
      }

      var target = e.target;

      if (target && target.classList.contains("form-submit")) {
        e.preventDefault(); // Form submit

        this._form.submitForm();
      }
    }
  }]);

  return LiveVariables;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/upsell-lightbox.js




var UpsellLightbox = /*#__PURE__*/function () {
  function UpsellLightbox() {
    var _this = this;

    classCallCheck_classCallCheck(this, UpsellLightbox);

    this.overlay = document.createElement("div");
    this._form = EnForm.getInstance();
    this._amount = DonationAmount.getInstance();
    this._frequency = DonationFrequency.getInstance();
    var options = "EngridUpsell" in window ? window.EngridUpsell : {};
    this.options = Object.assign(Object.assign({}, UpsellOptionsDefaults), options);

    if (!this.shouldRun()) {
      if (engrid_ENGrid.debug) console.log("Upsell script should NOT run"); // If we're not on a Donation Page, get out

      return;
    }

    this.overlay.id = "enModal";
    this.overlay.classList.add("is-hidden");
    this.overlay.classList.add("image-" + this.options.imagePosition);
    this.renderLightbox();

    this._form.onSubmit.subscribe(function () {
      return _this.open();
    });
  }

  createClass_createClass(UpsellLightbox, [{
    key: "renderLightbox",
    value: function renderLightbox() {
      var _this2 = this;

      var title = this.options.title.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
      var paragraph = this.options.paragraph.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
      var yes = this.options.yesLabel.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
      var no = this.options.noLabel.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
      var markup = "\n            <div class=\"upsellLightboxContainer\" id=\"goMonthly\">\n              <!-- ideal image size is 480x650 pixels -->\n              <div class=\"background\" style=\"background-image: url('".concat(this.options.image, "');\"></div>\n              <div class=\"upsellLightboxContent\">\n              ").concat(this.options.canClose ? "<span id=\"goMonthlyClose\"></span>" : "", "\n                <h1>\n                  ").concat(title, "\n                </h1>\n                ").concat(this.options.otherAmount ? "\n                <p>\n                  <span>".concat(this.options.otherLabel, "</span>\n                  <input href=\"#\" id=\"secondOtherField\" name=\"secondOtherField\" size=\"12\" type=\"number\" inputmode=\"numeric\" step=\"1\" value=\"\">\n                </p>\n                ") : "", "\n\n                <p>\n                  ").concat(paragraph, "\n                </p>\n                <!-- YES BUTTON -->\n                <div id=\"upsellYesButton\">\n                  <a href=\"#\">\n                    <div>\n                    <span class='loader-wrapper'><span class='loader loader-quart'></span></span>\n                    <span class='label'>").concat(yes, "</span>\n                    </div>\n                  </a>\n                </div>\n                <!-- NO BUTTON -->\n                <div id=\"upsellNoButton\">\n                  <button title=\"Close (Esc)\" type=\"button\">\n                    <div>\n                    <span class='loader-wrapper'><span class='loader loader-quart'></span></span>\n                    <span class='label'>").concat(no, "</span>\n                    </div>\n                  </button>\n                </div>\n              </div>\n            </div>\n            ");
      this.overlay.innerHTML = markup;
      var closeButton = this.overlay.querySelector("#goMonthlyClose");
      var yesButton = this.overlay.querySelector("#upsellYesButton a");
      var noButton = this.overlay.querySelector("#upsellNoButton button");
      yesButton.addEventListener("click", this["continue"].bind(this));
      noButton.addEventListener("click", this["continue"].bind(this));
      if (closeButton) closeButton.addEventListener("click", this.close.bind(this));
      this.overlay.addEventListener("click", function (e) {
        if (e.target instanceof Element && e.target.id == _this2.overlay.id && _this2.options.canClose) {
          _this2.close(e);
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.key === "Escape" && closeButton) {
          closeButton.click();
        }
      });
      document.body.appendChild(this.overlay);
      var otherField = document.querySelector("#secondOtherField");

      if (otherField) {
        otherField.addEventListener("keyup", this.popupOtherField.bind(this));
      }

      if (engrid_ENGrid.debug) console.log("Upsell script rendered");
    } // Should we run the script?

  }, {
    key: "shouldRun",
    value: function shouldRun() {
      // const hideModal = cookie.get("hideUpsell"); // Get cookie
      // if it's a first page of a Donation page
      return (// !hideModal &&
        'EngridUpsell' in window && !!window.pageJson && window.pageJson.pageNumber == 1 && window.pageJson.pageType == "donation"
      );
    }
  }, {
    key: "popupOtherField",
    value: function popupOtherField() {
      var _this3 = this;

      var _a, _b;

      var value = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
      var live_upsell_amount = document.querySelectorAll("#upsellYesButton .upsell_suggestion");

      if (!isNaN(value) && value > 0) {
        live_upsell_amount.forEach(function (elem) {
          return elem.innerHTML = "$" + value.toFixed(2);
        });
      } else {
        live_upsell_amount.forEach(function (elem) {
          return elem.innerHTML = "$" + _this3.getUpsellAmount().toFixed(2);
        });
      }
    }
  }, {
    key: "liveAmounts",
    value: function liveAmounts() {
      var _this4 = this;

      var live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
      var live_amount = document.querySelectorAll(".upsell_amount");
      var suggestedAmount = this.getUpsellAmount();
      live_upsell_amount.forEach(function (elem) {
        return elem.innerHTML = "$" + suggestedAmount.toFixed(2);
      });
      live_amount.forEach(function (elem) {
        return elem.innerHTML = "$" + _this4._amount.amount.toFixed(2);
      });
    } // Return the Suggested Upsell Amount

  }, {
    key: "getUpsellAmount",
    value: function getUpsellAmount() {
      var _a, _b;

      var amount = this._amount.amount;
      var otherAmount = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");

      if (otherAmount > 0) {
        return otherAmount;
      }

      var upsellAmount = 0;

      for (var i = 0; i < this.options.amountRange.length; i++) {
        var val = this.options.amountRange[i];

        if (upsellAmount == 0 && amount <= val.max) {
          upsellAmount = val.suggestion;

          if (typeof upsellAmount !== 'number') {
            var suggestionMath = upsellAmount.replace("amount", amount.toFixed(2));
            upsellAmount = parseFloat(Function('"use strict";return (' + suggestionMath + ')')());
          }

          break;
        }
      }

      return upsellAmount;
    }
  }, {
    key: "shouldOpen",
    value: function shouldOpen() {
      var freq = this._frequency.frequency;
      var upsellAmount = this.getUpsellAmount(); // If frequency is not onetime or
      // the modal is already opened or
      // there's no suggestion for this donation amount,
      // we should not open

      if (freq == "onetime" && !this.overlay.classList.contains("is-submitting") && upsellAmount > 0) {
        if (engrid_ENGrid.debug) {
          console.log("Upsell Frequency", this._frequency.frequency);
          console.log("Upsell Amount", this._amount.amount);
          console.log("Upsell Suggested Amount", upsellAmount);
        }

        return true;
      }

      return false;
    }
  }, {
    key: "open",
    value: function open() {
      if (engrid_ENGrid.debug) console.log("Upsell Script Triggered");

      if (!this.shouldOpen()) {
        // In the circumstance when the form fails to validate via server-side validation, the page will reload
        // When that happens, we should place the original amount saved in sessionStorage into the upsell original amount field
        var original = window.sessionStorage.getItem('original');

        if (original && document.querySelectorAll('.en__errorList .en__error').length > 0) {
          this.setOriginalAmount(original);
        } // Returning true will give the "go ahead" to submit the form


        this._form.submit = true;
        return true;
      }

      this.liveAmounts();
      this.overlay.classList.remove("is-hidden");
      this._form.submit = false;
      return false;
    } // Set the original amount into a hidden field using the upsellOriginalGiftAmountFieldName, if provided

  }, {
    key: "setOriginalAmount",
    value: function setOriginalAmount(original) {
      if (this.options.upsellOriginalGiftAmountFieldName) {
        var enFieldUpsellOriginalAmount = document.querySelector(".en__field__input.en__field__input--hidden[name='" + this.options.upsellOriginalGiftAmountFieldName + "']");

        if (!enFieldUpsellOriginalAmount) {
          var pageform = document.querySelector("form.en__component--page");

          if (pageform) {
            var input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", this.options.upsellOriginalGiftAmountFieldName);
            input.classList.add('en__field__input', 'en__field__input--hidden');
            pageform.appendChild(input);
            enFieldUpsellOriginalAmount = document.querySelector('.en__field__input.en__field__input--hidden[name="' + this.options.upsellOriginalGiftAmountFieldName + '"]');
          }
        }

        if (enFieldUpsellOriginalAmount) {
          // save it to a session variable just in case this page reloaded due to server-side validation error
          window.sessionStorage.setItem('original', original);
          enFieldUpsellOriginalAmount.setAttribute("value", original);
        }
      }
    } // Proceed to the next page (upsold or not)

  }, {
    key: "continue",
    value: function _continue(e) {
      var _a;

      e.preventDefault();

      if (e.target instanceof Element && ((_a = document.querySelector("#upsellYesButton")) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
        if (engrid_ENGrid.debug) console.log("Upsold");
        this.setOriginalAmount(this._amount.amount.toString());
        var upsoldAmount = this.getUpsellAmount();

        this._frequency.setFrequency("monthly");

        this._amount.setAmount(upsoldAmount);
      } else {
        this.setOriginalAmount('');
        window.sessionStorage.removeItem('original');
      }

      this._form.submitForm();
    } // Close the lightbox (no cookies)

  }, {
    key: "close",
    value: function close(e) {
      e.preventDefault(); // cookie.set("hideUpsell", "1", { expires: 1 }); // Create one day cookie

      this.overlay.classList.add("is-hidden");

      if (this.options.submitOnClose) {
        this._form.submitForm();
      } else {
        this._form.dispatchError();
      }
    }
  }]);

  return UpsellLightbox;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/show-hide-radio-checkboxes.js


var ShowHideRadioCheckboxes = /*#__PURE__*/function () {
  function ShowHideRadioCheckboxes(elements, classes) {
    var _this = this;

    classCallCheck_classCallCheck(this, ShowHideRadioCheckboxes);

    this.elements = document.getElementsByName(elements);
    this.classes = classes;
    this.hideAll();

    var _loop = function _loop(i) {
      var element = _this.elements[i];

      if (element.checked) {
        _this.show(element);
      }

      element.addEventListener("change", function (e) {
        _this.hideAll();

        _this.show(element);
      });
    };

    for (var i = 0; i < this.elements.length; i++) {
      _loop(i);
    }
  } // Hide All Divs


  createClass_createClass(ShowHideRadioCheckboxes, [{
    key: "hideAll",
    value: function hideAll() {
      var _this2 = this;

      this.elements.forEach(function (item, index) {
        if (item instanceof HTMLInputElement) _this2.hide(item);
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

  return ShowHideRadioCheckboxes;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/simple-country-select.js


// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
var SimpleCountrySelect = /*#__PURE__*/function () {
  function SimpleCountrySelect() {
    var _this = this;

    classCallCheck_classCallCheck(this, SimpleCountrySelect);

    var _a;

    this.countryWrapper = document.querySelector('.simple_country_select');
    this.countrySelect = document.querySelector('#en__field_supporter_country');

    if (this.countrySelect) {
      var countrySelecLabel = this.countrySelect.options[this.countrySelect.selectedIndex].innerHTML;
      var countrySelecValue = this.countrySelect.options[this.countrySelect.selectedIndex].value;

      if (countrySelecValue == "US") {
        countrySelecValue = " US";
      }

      if (countrySelecLabel == "United States") {
        countrySelecLabel = "the United States";
      }

      var countryWrapper = document.querySelector('.simple_country_select');

      if (countryWrapper) {
        // Remove Country Select tab index
        this.countrySelect.tabIndex = -1; // Find the address label

        var addressLabel = document.querySelector('.en__field--address1 label');
        var addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement; // EN does not enforce a labels on fields so we have to check for it

        if (addressLabel) {
          // Wrap the address label in a div to break out of the flexbox
          this.wrap(addressLabel, document.createElement('div')); // Add our link after the address label
          // Includes both long form and short form variants

          var newEl = document.createElement('span');
          newEl.innerHTML = ' <label id="en_custom_field_simple_country_select_long" class="en__field__label"><a href="javascript:void(0)">(Outside ' + countrySelecLabel + '?)</a></label><label id="en_custom_field_simple_country_select_short" class="en__field__label"><a href="javascript:void(0)">(Outside ' + countrySelecValue + '?)</a></label>';
          newEl.querySelectorAll("a").forEach(function (el) {
            el.addEventListener("click", _this.showCountrySelect.bind(_this));
          });
          this.insertAfter(newEl, addressLabel);
        }
      }
    }
  } // Helper function to insert HTML after a node


  createClass_createClass(SimpleCountrySelect, [{
    key: "insertAfter",
    value: function insertAfter(el, referenceNode) {
      var parentElement = referenceNode.parentNode;
      parentElement.insertBefore(el, referenceNode.nextSibling);
    } // Helper function to wrap a target in a new element

  }, {
    key: "wrap",
    value: function wrap(el, wrapper) {
      var parentElement = el.parentNode;
      parentElement.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  }, {
    key: "showCountrySelect",
    value: function showCountrySelect(e) {
      var _a;

      e.preventDefault();
      this.countryWrapper.classList.add("country-select-visible");
      var addressLabel = document.querySelector('.en__field--address1 label');
      var addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
      addressWrapper.classList.add("country-select-visible");
      this.countrySelect.focus(); // Reinstate Country Select tab index

      this.countrySelect.removeAttribute("tabIndex");
    }
  }]);

  return SimpleCountrySelect;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/skip-link.js


// Javascript that adds an accessible "Skip Link" button after the <body> opening that jumps to
// the first <title> or <h1> field in a "body-" section, or the first <h1> if none are found
// in those sections
// Depends on _engrid-skip-link.scss

var SkipToMainContentLink = /*#__PURE__*/function () {
  function SkipToMainContentLink() {
    classCallCheck_classCallCheck(this, SkipToMainContentLink);

    var firstTitleInEngridBody = document.querySelector("div[class*='body-'] title");
    var firstH1InEngridBody = document.querySelector("div[class*='body-'] h1");
    var firstTitle = document.querySelector("title");
    var firstH1 = document.querySelector("h1");

    if (firstTitleInEngridBody && firstTitleInEngridBody.parentElement) {
      firstTitleInEngridBody.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else if (firstH1InEngridBody && firstH1InEngridBody.parentElement) {
      firstH1InEngridBody.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else if (firstTitle && firstTitle.parentElement) {
      firstTitle.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else if (firstH1 && firstH1.parentElement) {
      firstH1.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else {
      if (engrid_ENGrid.debug) console.log("This page contains no <title> or <h1> and a 'Skip to main content' link was not added");
    }
  }

  createClass_createClass(SkipToMainContentLink, [{
    key: "insertSkipLinkSpan",
    value: function insertSkipLinkSpan() {
      document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#skip-link">Skip to main content</a>');
    }
  }]);

  return SkipToMainContentLink;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/src-defer.js

// Build Notes: Add the vanilla Javascript version inline inside the page template right before </body>
// In the event the vanilla javascript is not inlined we should still process any assets with a data-src still defined on it. Plus we only process background video via this JS file as to not block the page with a large video file downloading.
// // 4Site's simplified image lazy loader
// var srcDefer = document.querySelectorAll("img[data-src]");
// window.addEventListener('DOMContentLoaded', (event) => {
//   for (var i = 0; i < srcDefer.length; i++) {
//     let dataSrc = srcDefer[i].getAttribute("data-src");
//     if (dataSrc) {
//       srcDefer[i].setAttribute("decoding", "async"); // Gets image processing off the main working thread
//       srcDefer[i].setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
//       srcDefer[i].setAttribute("src", dataSrc); // Sets the src which will cause the browser to retrieve the asset
//       srcDefer[i].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
//       srcDefer[i].removeAttribute("data-src"); // Removes the data-source
//     }
//   }
// });
var SrcDefer = function SrcDefer() {
  classCallCheck_classCallCheck(this, SrcDefer);

  // Find all images and videos with a data-src defined
  this.imgSrcDefer = document.querySelectorAll("img[data-src]");
  this.videoBackground = document.querySelectorAll("video");
  this.videoBackgroundSource = document.querySelectorAll("video source"); // Process images

  for (var i = 0; i < this.imgSrcDefer.length; i++) {
    var img = this.imgSrcDefer[i];

    if (img) {
      img.setAttribute("decoding", "async"); // Gets image processing off the main working thread, and decodes the image asynchronously to reduce delay in presenting other content

      img.setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded using it's native lazy loading

      var imgDataSrc = img.getAttribute("data-src");

      if (imgDataSrc) {
        img.setAttribute("src", imgDataSrc); // Sets the src which will cause the browser to retrieve the asset
      }

      img.setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid

      img.removeAttribute("data-src"); // Removes the data-source
    }
  } // Process video


  for (var _i = 0; _i < this.videoBackground.length; _i++) {
    var video = this.videoBackground[_i];
    video.setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
    // Process one or more defined sources in the <video> tag

    var videoBackgroundSource = video.querySelectorAll("source");

    var videoBackgroundSourcedDataSrc = this.videoBackgroundSource[_i].getAttribute("data-src");

    if (videoBackgroundSource) {
      for (var _i2 = 0; _i2 < this.videoBackgroundSource.length; _i2++) {
        // Construct the <video> tags new <source>
        if (videoBackgroundSourcedDataSrc) {
          this.videoBackgroundSource[_i2].setAttribute("src", videoBackgroundSourcedDataSrc);

          this.videoBackgroundSource[_i2].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid


          this.videoBackgroundSource[_i2].removeAttribute("data-src"); // Removes the data-source

        } // To get the browser to request the video asset defined we need to remove the <video> tag and re-add it


        var videoBackgroundParent = video.parentNode; // Determine the parent of the <video> tag

        var copyOfVideoBackground = video; // Copy the <video> tag

        if (videoBackgroundParent && copyOfVideoBackground) {
          videoBackgroundParent.replaceChild(copyOfVideoBackground, this.videoBackground[_i2]); // Replace the <video> with the copy of itself
          // Update the video to auto play, mute, loop

          video.muted = true; // Mute the video by default

          video.controls = false; // Hide the browser controls

          video.loop = true; // Loop the video

          video.playsInline = true; // Encourage the user agent to display video content within the element's playback area

          video.play(); // Plays the video
        }
      }
    }
  }
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/set-recurr-freq.js



var setRecurrFreq = function setRecurrFreq() {
  var _this = this;

  classCallCheck_classCallCheck(this, setRecurrFreq);

  this._frequency = DonationFrequency.getInstance();
  this.linkClass = 'setRecurrFreq-';
  this.checkboxName = 'engrid.recurrfreq'; // Watch the links that starts with linkClass

  document.querySelectorAll("a[class^=\"".concat(this.linkClass, "\"]")).forEach(function (element) {
    element.addEventListener("click", function (e) {
      // Get the right class
      var setRecurrFreqClass = element.className.split(' ').filter(function (linkClass) {
        return linkClass.startsWith(_this.linkClass);
      });
      if (engrid_ENGrid.debug) console.log(setRecurrFreqClass);

      if (setRecurrFreqClass.length) {
        e.preventDefault();
        engrid_ENGrid.setFieldValue('transaction.recurrfreq', setRecurrFreqClass[0].substring(_this.linkClass.length).toUpperCase());

        _this._frequency.load();
      }
    });
  }); // Watch checkboxes with the name checkboxName

  document.getElementsByName(this.checkboxName).forEach(function (element) {
    element.addEventListener("change", function () {
      if (element.checked) {
        engrid_ENGrid.setFieldValue('transaction.recurrfreq', element.value.toUpperCase());

        _this._frequency.load();
      }
    });
  }); // Uncheck the checkbox when frequency != checkbox value

  this._frequency.onFrequencyChange.subscribe(function () {
    var freq = _this._frequency.frequency.toUpperCase();

    document.getElementsByName(_this.checkboxName).forEach(function (element) {
      if (element.checked && element.value != freq) {
        element.checked = false;
      }
    });
  });
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/page-background.js



var PageBackground = /*#__PURE__*/function () {
  function PageBackground() {
    classCallCheck_classCallCheck(this, PageBackground);

    // @TODO: Change page-backgroundImage to page-background
    this.pageBackground = document.querySelector(".page-backgroundImage"); // Finds any <img> added to the "backgroundImage" ENGRid section and sets it as the "--engrid__page-backgroundImage_url" CSS Custom Property

    if (this.pageBackground) {
      var pageBackgroundImg = this.pageBackground.querySelector("img");
      var pageBackgroundImgDataSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.getAttribute("data-src");
      var pageBackgroundImgSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.src;

      if (this.pageBackground && pageBackgroundImgDataSrc) {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was found with a data-src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgDataSrc);
        pageBackgroundImgDataSrc = "url('" + pageBackgroundImgDataSrc + "')";
        this.pageBackground.style.setProperty('--engrid__page-backgroundImage_url', pageBackgroundImgDataSrc);
      } else if (this.pageBackground && pageBackgroundImgSrc) {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was found with a src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgSrc);
        pageBackgroundImgSrc = "url('" + pageBackgroundImgSrc + "')";
        this.pageBackground.style.setProperty('--engrid__page-backgroundImage_url', pageBackgroundImgSrc);
      } else if (pageBackgroundImg) {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was found but without a data-src or src value, no action taken", pageBackgroundImg);
      } else {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
      }
    } else {
      if (engrid_ENGrid.debug) console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
    }

    this.setDataAttributes();
  }

  createClass_createClass(PageBackground, [{
    key: "setDataAttributes",
    value: function setDataAttributes() {
      if (this.hasVideoBackground()) return engrid_ENGrid.setBodyData('page-background', 'video');
      if (this.hasImageBackground()) return engrid_ENGrid.setBodyData('page-background', 'image');
      return engrid_ENGrid.setBodyData('page-background', 'empty');
    }
  }, {
    key: "hasVideoBackground",
    value: function hasVideoBackground() {
      return !!this.pageBackground.querySelector('video');
    }
  }, {
    key: "hasImageBackground",
    value: function hasImageBackground() {
      return !this.hasVideoBackground() && !!this.pageBackground.querySelector('img');
    }
  }]);

  return PageBackground;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/neverbounce.js




var NeverBounce = /*#__PURE__*/function () {
  function NeverBounce(apiKey) {
    var _this = this;

    var dateField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var statusField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    classCallCheck_classCallCheck(this, NeverBounce);

    this.apiKey = apiKey;
    this.dateField = dateField;
    this.statusField = statusField;
    this.form = EnForm.getInstance();
    this.emailField = null;
    this.emailWrapper = document.querySelector(".en__field--emailAddress");
    this.nbDate = null;
    this.nbStatus = null;
    window._NBSettings = {
      apiKey: this.apiKey,
      autoFieldHookup: false,
      inputLatency: 500,
      displayPoweredBy: false,
      loadingMessage: "Validating...",
      softRejectMessage: "Invalid email",
      acceptedMessage: "Email validated!",
      feedback: false
    };
    engrid_ENGrid.loadJS('https://cdn.neverbounce.com/widget/dist/NeverBounce.js');
    this.init();
    this.form.onValidate.subscribe(function () {
      return _this.form.validate = _this.validate();
    });
  }

  createClass_createClass(NeverBounce, [{
    key: "init",
    value: function init() {
      this.emailField = document.getElementById("en__field_supporter_emailAddress");
      if (this.dateField && document.getElementsByName(this.dateField).length) this.nbDate = document.querySelector("[name='" + this.dateField + "']");
      if (this.statusField && document.getElementsByName(this.statusField).length) this.nbStatus = document.querySelector("[name='" + this.statusField + "']");

      if (!this.emailField) {
        if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found');
        return;
      }

      if (!this.emailField) {
        if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found', this.emailField);
        return;
      }

      if (engrid_ENGrid.debug) console.log('Engrid Neverbounce External Script Loaded');
      this.wrap(this.emailField, document.createElement("div"));
      var parentNode = this.emailField.parentNode;
      parentNode.id = "nb-wrapper"; // Define HTML structure for a Custom NB Message and insert it after Email field

      var nbCustomMessageHTML = document.createElement("div");
      nbCustomMessageHTML.innerHTML = '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
      this.insertAfter(nbCustomMessageHTML, this.emailField);
      var NBClass = this;
      window.addEventListener("load", function () {
        document.getElementsByTagName("body")[0].addEventListener("nb:registered", function (event) {
          var field = document.querySelector('[data-nb-id="' + event.detail.id + '"]'); // Never Bounce: Do work when input changes or when API responds with an error

          field.addEventListener("nb:clear", function (e) {
            NBClass.setEmailStatus("clear");
            if (NBClass.nbDate) NBClass.nbDate.value = "";
            if (NBClass.nbStatus) NBClass.nbStatus.value = "";
          }); // Never Bounce: Do work when results have an input that does not look like an email (i.e. missing @ or no .com/.net/etc...)

          field.addEventListener("nb:soft-result", function (e) {
            NBClass.setEmailStatus("soft-result");
            if (NBClass.nbDate) NBClass.nbDate.value = "";
            if (NBClass.nbStatus) NBClass.nbStatus.value = "";
          }); // Never Bounce: When results have been received

          field.addEventListener("nb:result", function (e) {
            if (e.detail.result.is(window._nb.settings.getAcceptedStatusCodes())) {
              NBClass.setEmailStatus("valid");
              if (NBClass.nbDate) NBClass.nbDate.value = new Date().toLocaleDateString();
            } else {
              NBClass.setEmailStatus("invalid");
              if (NBClass.nbDate) NBClass.nbDate.value = "";
            }
          });
        }); // Never Bounce: Register field with the widget and broadcast nb:registration event

        window._nb.fields.registerListener(NBClass.emailField, true);
      });
    }
  }, {
    key: "clearStatus",
    value: function clearStatus() {
      if (!this.emailField) {
        if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found');
        return;
      }

      this.emailField.classList.remove("rm-error"); // Search page for the NB Wrapper div and set as variable

      var nb_email_field_wrapper = document.getElementById("nb-wrapper"); // Search page for the NB Feedback div and set as variable

      var nb_email_feedback_field = document.getElementById("nb-feedback");
      nb_email_field_wrapper.className = "";
      nb_email_feedback_field.className = "en__field__error nb-hidden";
      nb_email_feedback_field.innerHTML = "";
      this.emailWrapper.classList.remove("en__field--validationFailed");
    }
  }, {
    key: "deleteENFieldError",
    value: function deleteENFieldError() {
      var errorField = document.querySelector(".en__field--emailAddress>div.en__field__error");
      if (errorField) errorField.remove();
    }
  }, {
    key: "setEmailStatus",
    value: function setEmailStatus(status) {
      if (engrid_ENGrid.debug) console.log("Neverbounce Status:", status);

      if (!this.emailField) {
        if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found');
        return;
      } // Search page for the NB Wrapper div and set as variable


      var nb_email_field_wrapper = document.getElementById("nb-wrapper"); // Search page for the NB Feedback div and set as variable

      var nb_email_feedback_field = document.getElementById("nb-feedback"); // classes to add or remove based on neverbounce results

      var nb_email_field_wrapper_success = "nb-success";
      var nb_email_field_wrapper_error = "nb-error";
      var nb_email_feedback_hidden = "nb-hidden";
      var nb_email_feedback_loading = "nb-loading";
      var nb_email_field_error = "rm-error";

      if (!nb_email_feedback_field) {
        var nbWrapperDiv = nb_email_field_wrapper.querySelector('div');
        if (nbWrapperDiv) nbWrapperDiv.innerHTML = '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
      }

      if (status == "valid") {
        this.clearStatus();
      } else {
        nb_email_field_wrapper.classList.remove(nb_email_field_wrapper_success);
        nb_email_field_wrapper.classList.add(nb_email_field_wrapper_error);

        switch (status) {
          case "required":
            // special case status that we added ourselves -- doesn't come from NB
            this.deleteENFieldError();
            nb_email_feedback_field.innerHTML = "A valid email is required";
            nb_email_feedback_field.classList.remove(nb_email_feedback_loading);
            nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
            this.emailField.classList.add(nb_email_field_error);
            break;

          case "soft-result":
            if (this.emailField.value) {
              this.deleteENFieldError();
              nb_email_feedback_field.innerHTML = "Invalid email";
              nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
              this.emailField.classList.add(nb_email_field_error);
            } else {
              this.clearStatus();
            }

            break;

          case "invalid":
            this.deleteENFieldError();
            nb_email_feedback_field.innerHTML = "Invalid email";
            nb_email_feedback_field.classList.remove(nb_email_feedback_loading);
            nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
            this.emailField.classList.add(nb_email_field_error);
            break;

          case "loading":
          case "clear":
          default:
            this.clearStatus();
            break;
        }
      }
    } // Function to insert HTML after a DIV

  }, {
    key: "insertAfter",
    value: function insertAfter(el, referenceNode) {
      var _a;

      (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, referenceNode.nextSibling);
    } //  to insert HTML before a DIV

  }, {
    key: "insertBefore",
    value: function insertBefore(el, referenceNode) {
      var _a;

      (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, referenceNode);
    } //  to Wrap HTML around a DIV

  }, {
    key: "wrap",
    value: function wrap(el, wrapper) {
      var _a;

      (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  }, {
    key: "validate",
    value: function validate() {
      var _a;

      if (!this.emailField) {
        if (engrid_ENGrid.debug) console.log('Engrid Neverbounce validate(): E-mail Field Not Found. Returning true.');
        return true;
      }

      if (this.nbStatus) {
        this.nbStatus.value = engrid_ENGrid.getFieldValue("nb-result");
      }

      if (!['catchall', 'valid'].includes(engrid_ENGrid.getFieldValue('nb-result'))) {
        this.setEmailStatus("required");
        (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
        return false;
      }

      return true;
    }
  }]);

  return NeverBounce;
}();
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/progress-bar.js


var ProgressBar = function ProgressBar() {
  classCallCheck_classCallCheck(this, ProgressBar);

  var _a, _b;

  var progressIndicator = document.querySelector("span[data-engrid-progress-indicator]");
  var pageCount = engrid_ENGrid.getPageCount();
  var pageNumber = engrid_ENGrid.getPageNumber();

  if (!progressIndicator || !pageCount || !pageNumber) {
    return;
  }

  var maxValue = (_a = progressIndicator.getAttribute("max")) !== null && _a !== void 0 ? _a : 100;
  if (typeof maxValue === 'string') maxValue = parseInt(maxValue);
  var amountValue = (_b = progressIndicator.getAttribute("amount")) !== null && _b !== void 0 ? _b : 0;
  if (typeof amountValue === 'string') amountValue = parseInt(amountValue);
  var prevPercentage = pageNumber === 1 ? 0 : Math.ceil((pageNumber - 1) / pageCount * maxValue);
  var percentage = pageNumber === 1 ? 0 : Math.ceil(pageNumber / pageCount * maxValue);
  var scalePrev = prevPercentage / 100;
  var scale = percentage / 100;

  if (amountValue) {
    percentage = Math.ceil(amountValue) > Math.ceil(maxValue) ? maxValue : amountValue;
    scale = percentage / 100;
  }

  progressIndicator.innerHTML = "\n\t\t\t<div class=\"indicator__wrap\">\n\t\t\t\t<span class=\"indicator__progress\" style=\"transform: scaleX(".concat(scalePrev, ");\"></span>\n\t\t\t\t<span class=\"indicator__percentage\">").concat(percentage, "<span class=\"indicator__percentage-sign\">%</span></span>\n\t\t\t</div>");

  if (percentage !== prevPercentage) {
    var progress = document.querySelector(".indicator__progress");
    requestAnimationFrame(function () {
      progress.style.transform = "scaleX(".concat(scale, ")");
    });
  }
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/index.js
 // Runs first so it can change the DOM markup before any markup dependent code fires























;// CONCATENATED MODULE: ./src/index.ts
// import { Options, App } from "@4site/engrid-common"; // Uses ENGrid via NPM
 // Uses ENGrid via Visual Studio Workspace


var options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: '$',
  CurrencySeparator: '.',
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  // ProgressBar: true,
  Debug: App.getUrlParameter('debug') == 'true' ? true : false,
  onLoad: function onLoad() {
    return console.log("Starter Theme Loaded");
  },
  onResize: function onResize() {
    return console.log("Starter Theme Window Resized");
  }
};
new App(options);
})();

/******/ })()
;