'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var isUnknownObject = function isUnknownObject(raw) {
  return raw !== null && _typeof(raw) === 'object';
};
var isPromise = function isPromise(raw) {
  return isUnknownObject(raw) && typeof raw.then === 'function';
}; // We are using types to enforce the `stripe` prop in this lib,
// but in an untyped integration `stripe` could be anything, so we need
// to do some sanity validation to prevent type errors.

var isStripe = function isStripe(raw) {
  return isUnknownObject(raw) && typeof raw.elements === 'function' && typeof raw.createToken === 'function' && typeof raw.createPaymentMethod === 'function' && typeof raw.confirmCardPayment === 'function';
};

var PLAIN_OBJECT_STR = '[object Object]';
var isEqual = function isEqual(left, right) {
  if (!isUnknownObject(left) || !isUnknownObject(right)) {
    return left === right;
  }

  var leftArray = Array.isArray(left);
  var rightArray = Array.isArray(right);
  if (leftArray !== rightArray) return false;
  var leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
  var rightPlainObject = Object.prototype.toString.call(right) === PLAIN_OBJECT_STR;
  if (leftPlainObject !== rightPlainObject) return false;
  if (!leftPlainObject && !leftArray) return false;
  var leftKeys = Object.keys(left);
  var rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  var keySet = {};

  for (var i = 0; i < leftKeys.length; i += 1) {
    keySet[leftKeys[i]] = true;
  }

  for (var _i = 0; _i < rightKeys.length; _i += 1) {
    keySet[rightKeys[_i]] = true;
  }

  var allKeys = Object.keys(keySet);

  if (allKeys.length !== leftKeys.length) {
    return false;
  }

  var l = left;
  var r = right;

  var pred = function pred(key) {
    return isEqual(l[key], r[key]);
  };

  return allKeys.every(pred);
};

var usePrevious = function usePrevious(value) {
  var ref = React.useRef(value);
  React.useEffect(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
};

var INVALID_STRIPE_ERROR = 'Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.'; // We are using types to enforce the `stripe` prop in this lib, but in a real
// integration `stripe` could be anything, so we need to do some sanity
// validation to prevent type errors.

var validateStripe = function validateStripe(maybeStripe) {
  if (maybeStripe === null || isStripe(maybeStripe)) {
    return maybeStripe;
  }

  throw new Error(INVALID_STRIPE_ERROR);
};

var parseStripeProp = function parseStripeProp(raw) {
  if (isPromise(raw)) {
    return {
      tag: 'async',
      stripePromise: Promise.resolve(raw).then(validateStripe)
    };
  }

  var stripe = validateStripe(raw);

  if (stripe === null) {
    return {
      tag: 'empty'
    };
  }

  return {
    tag: 'sync',
    stripe: stripe
  };
};

var ElementsContext = /*#__PURE__*/React.createContext(null);
ElementsContext.displayName = 'ElementsContext';
var parseElementsContext = function parseElementsContext(ctx, useCase) {
  if (!ctx) {
    throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(useCase, " in an <Elements> provider."));
  }

  return ctx;
};
/**
 * The `Elements` provider allows you to use [Element components](https://stripe.com/docs/stripe-js/react#element-components) and access the [Stripe object](https://stripe.com/docs/js/initializing) in any nested component.
 * Render an `Elements` provider at the root of your React app so that it is available everywhere you need it.
 *
 * To use the `Elements` provider, call `loadStripe` from `@stripe/stripe-js` with your publishable key.
 * The `loadStripe` function will asynchronously load the Stripe.js script and initialize a `Stripe` object.
 * Pass the returned `Promise` to `Elements`.
 *
 * @docs https://stripe.com/docs/stripe-js/react#elements-provider
 */

var Elements = function Elements(_ref) {
  var rawStripeProp = _ref.stripe,
      options = _ref.options,
      children = _ref.children;

  var _final = React.useRef(false);

  var isMounted = React.useRef(true);
  var parsed = React.useMemo(function () {
    return parseStripeProp(rawStripeProp);
  }, [rawStripeProp]);

  var _React$useState = React.useState(function () {
    return {
      stripe: null,
      elements: null
    };
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      ctx = _React$useState2[0],
      setContext = _React$useState2[1];

  var prevStripe = usePrevious(rawStripeProp);
  var prevOptions = usePrevious(options);

  if (prevStripe !== null) {
    if (prevStripe !== rawStripeProp) {
      console.warn('Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.');
    }

    if (!isEqual(options, prevOptions)) {
      console.warn('Unsupported prop change on Elements: You cannot change the `options` prop after setting the `stripe` prop.');
    }
  }

  if (!_final.current) {
    if (parsed.tag === 'sync') {
      _final.current = true;
      setContext({
        stripe: parsed.stripe,
        elements: parsed.stripe.elements(options)
      });
    }

    if (parsed.tag === 'async') {
      _final.current = true;
      parsed.stripePromise.then(function (stripe) {
        if (stripe && isMounted.current) {
          // Only update Elements context if the component is still mounted
          // and stripe is not null. We allow stripe to be null to make
          // handling SSR easier.
          setContext({
            stripe: stripe,
            elements: stripe.elements(options)
          });
        }
      });
    }
  }

  React.useEffect(function () {
    return function () {
      isMounted.current = false;
    };
  }, []);
  React.useEffect(function () {
    var anyStripe = ctx.stripe;

    if (!anyStripe || !anyStripe._registerWrapper || !anyStripe.registerAppInfo) {
      return;
    }

    anyStripe._registerWrapper({
      name: 'react-stripe-js',
      version: "1.4.1"
    });

    anyStripe.registerAppInfo({
      name: 'react-stripe-js',
      version: "1.4.1",
      url: 'https://stripe.com/docs/stripe-js/react'
    });
  }, [ctx.stripe]);
  return /*#__PURE__*/React.createElement(ElementsContext.Provider, {
    value: ctx
  }, children);
};
Elements.propTypes = {
  stripe: PropTypes.any,
  options: PropTypes.object
};
var useElementsContextWithUseCase = function useElementsContextWithUseCase(useCaseMessage) {
  var ctx = React.useContext(ElementsContext);
  return parseElementsContext(ctx, useCaseMessage);
};
/**
 * @docs https://stripe.com/docs/stripe-js/react#useelements-hook
 */

var useElements = function useElements() {
  var _useElementsContextWi = useElementsContextWithUseCase('calls useElements()'),
      elements = _useElementsContextWi.elements;

  return elements;
};
/**
 * @docs https://stripe.com/docs/stripe-js/react#usestripe-hook
 */

var useStripe = function useStripe() {
  var _useElementsContextWi2 = useElementsContextWithUseCase('calls useStripe()'),
      stripe = _useElementsContextWi2.stripe;

  return stripe;
};
/**
 * @docs https://stripe.com/docs/stripe-js/react#elements-consumer
 */

var ElementsConsumer = function ElementsConsumer(_ref2) {
  var children = _ref2.children;
  var ctx = useElementsContextWithUseCase('mounts <ElementsConsumer>'); // Assert to satisfy the busted React.FC return type (it should be ReactNode)

  return children(ctx);
};
ElementsConsumer.propTypes = {
  children: PropTypes.func.isRequired
};

var useCallbackReference = function useCallbackReference(cb) {
  var ref = React.useRef(cb);
  React.useEffect(function () {
    ref.current = cb;
  }, [cb]);
  return function () {
    if (ref.current) {
      ref.current.apply(ref, arguments);
    }
  };
};

var extractUpdateableOptions = function extractUpdateableOptions(options) {
  if (!isUnknownObject(options)) {
    return {};
  }

  var _ = options.paymentRequest,
      rest = _objectWithoutProperties(options, ["paymentRequest"]);

  return rest;
};

var noop = function noop() {};

var capitalized = function capitalized(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var createElementComponent = function createElementComponent(type, isServer) {
  var displayName = "".concat(capitalized(type), "Element");

  var ClientElement = function ClientElement(_ref) {
    var id = _ref.id,
        className = _ref.className,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {} : _ref$options,
        _ref$onBlur = _ref.onBlur,
        onBlur = _ref$onBlur === void 0 ? noop : _ref$onBlur,
        _ref$onFocus = _ref.onFocus,
        onFocus = _ref$onFocus === void 0 ? noop : _ref$onFocus,
        _ref$onReady = _ref.onReady,
        onReady = _ref$onReady === void 0 ? noop : _ref$onReady,
        _ref$onChange = _ref.onChange,
        onChange = _ref$onChange === void 0 ? noop : _ref$onChange,
        _ref$onEscape = _ref.onEscape,
        onEscape = _ref$onEscape === void 0 ? noop : _ref$onEscape,
        _ref$onClick = _ref.onClick,
        onClick = _ref$onClick === void 0 ? noop : _ref$onClick;

    var _useElementsContextWi = useElementsContextWithUseCase("mounts <".concat(displayName, ">")),
        elements = _useElementsContextWi.elements;

    var elementRef = React.useRef(null);
    var domNode = React.useRef(null);
    var callOnReady = useCallbackReference(onReady);
    var callOnBlur = useCallbackReference(onBlur);
    var callOnFocus = useCallbackReference(onFocus);
    var callOnClick = useCallbackReference(onClick);
    var callOnChange = useCallbackReference(onChange);
    var callOnEscape = useCallbackReference(onEscape);
    React.useLayoutEffect(function () {
      if (elementRef.current == null && elements && domNode.current != null) {
        var element = elements.create(type, options);
        elementRef.current = element;
        element.mount(domNode.current);
        element.on('ready', function () {
          return callOnReady(element);
        });
        element.on('change', callOnChange);
        element.on('blur', callOnBlur);
        element.on('focus', callOnFocus);
        element.on('escape', callOnEscape); // Users can pass an an onClick prop on any Element component
        // just as they could listen for the `click` event on any Element,
        // but only the PaymentRequestButton will actually trigger the event.

        element.on('click', callOnClick);
      }
    });
    var prevOptions = React.useRef(options);
    React.useEffect(function () {
      if (prevOptions.current && prevOptions.current.paymentRequest !== options.paymentRequest) {
        console.warn('Unsupported prop change: options.paymentRequest is not a customizable property.');
      }

      var updateableOptions = extractUpdateableOptions(options);

      if (Object.keys(updateableOptions).length !== 0 && !isEqual(updateableOptions, extractUpdateableOptions(prevOptions.current))) {
        if (elementRef.current) {
          elementRef.current.update(updateableOptions);
          prevOptions.current = options;
        }
      }
    }, [options]);
    React.useLayoutEffect(function () {
      return function () {
        if (elementRef.current) {
          elementRef.current.destroy();
        }
      };
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      id: id,
      className: className,
      ref: domNode
    });
  }; // Only render the Element wrapper in a server environment.


  var ServerElement = function ServerElement(props) {
    // Validate that we are in the right context by calling useElementsContextWithUseCase.
    useElementsContextWithUseCase("mounts <".concat(displayName, ">"));
    var id = props.id,
        className = props.className;
    return /*#__PURE__*/React.createElement("div", {
      id: id,
      className: className
    });
  };

  var Element = isServer ? ServerElement : ClientElement;
  Element.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onReady: PropTypes.func,
    onClick: PropTypes.func,
    options: PropTypes.object
  };
  Element.displayName = displayName;
  Element.__elementType = type;
  return Element;
};

var isServer = typeof window === 'undefined';
/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 *
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var AuBankAccountElement = createElementComponent('auBankAccount', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var CardElement = createElementComponent('card', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var CardNumberElement = createElementComponent('cardNumber', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var CardExpiryElement = createElementComponent('cardExpiry', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var CardCvcElement = createElementComponent('cardCvc', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var FpxBankElement = createElementComponent('fpxBank', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var IbanElement = createElementComponent('iban', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var IdealBankElement = createElementComponent('idealBank', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var P24BankElement = createElementComponent('p24Bank', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var EpsBankElement = createElementComponent('epsBank', isServer);
var PaymentElement = createElementComponent('payment', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var PaymentRequestButtonElement = createElementComponent('paymentRequestButton', isServer);
/**
 * @docs https://stripe.com/docs/stripe-js/react#element-components
 */

var AfterpayClearpayMessageElement = createElementComponent('afterpayClearpayMessage', isServer);

exports.AfterpayClearpayMessageElement = AfterpayClearpayMessageElement;
exports.AuBankAccountElement = AuBankAccountElement;
exports.CardCvcElement = CardCvcElement;
exports.CardElement = CardElement;
exports.CardExpiryElement = CardExpiryElement;
exports.CardNumberElement = CardNumberElement;
exports.Elements = Elements;
exports.ElementsConsumer = ElementsConsumer;
exports.EpsBankElement = EpsBankElement;
exports.FpxBankElement = FpxBankElement;
exports.IbanElement = IbanElement;
exports.IdealBankElement = IdealBankElement;
exports.P24BankElement = P24BankElement;
exports.PaymentElement = PaymentElement;
exports.PaymentRequestButtonElement = PaymentRequestButtonElement;
exports.useElements = useElements;
exports.useStripe = useStripe;
