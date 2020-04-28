/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

// var DOMProperty = require('./DOMProperty');
var EventPluginHub = require('../event/EventPluginHub');
var EventPluginUtils = require('../event/EventPluginUtils');
var ReactComponentEnvironment = require('./ReactComponentEnvironment');
// var ReactEmptyComponent = require('./ReactEmptyComponent');
var ReactBrowserEventEmitter = require('../event/ReactBrowserEventEmitter');
var ReactHostComponent = require('./ReactHostComponent');
var ReactUpdates = require('../ReactUpdates');
var ReactInjection = {
  Component: ReactComponentEnvironment.injection,
  // DOMProperty: DOMProperty.injection,
  // EmptyComponent: ReactEmptyComponent.injection,
  EventPluginHub: EventPluginHub.injection,
  EventPluginUtils: EventPluginUtils.injection,
  EventEmitter: ReactBrowserEventEmitter.injection,
  HostComponent: ReactHostComponent.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;