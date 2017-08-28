# yadop
Yadop (Yet Another Doc Parser) is a [JSDoc](http://usejsdoc.org) parser that uses [Espree](https://github.com/eslint/espree) and [Doctrine](https://github.com/eslint/doctrine) to process your sources.

## Installation

You can install Yadop using [npm](https://npmjs.com):

```
$ npm install yadop --save-dev
```

## Usage

Require yadop inside of your JavaScript:

```js
var yadop = require("yadop");
```

#### JSDoc

In order to process the jsdoc you can execute the following:

```js
yadop.jsdoc.processor({
    cwd: 'directory/containing/sources', // the source directory
    pattern: '*/*.js' // the pattern
}).process();
```

#### NGDoc

In order to process the ngdoc you can execute the following:

```js
var comments = yadop.ngdoc.processor({
    cwd: 'directory/containing/sources', // the source directory
    pattern: '*/*.js' // the pattern
}).process();

var results = yadop.ngdoc.mapper().map(comments);
```

## Configuration

Both the yadop.jsdoc.processor and the yadop.ngdoc.processor are called with a configuration object.
This object contains the following attributes:

##### cwd
Type: `string`
Default: current working directory
Mandatory: false

The current working directory.

##### pattern
Type: `string`
Default: **/*.js
Mandatory: false

The file pattern.

##### ignore
Type: `string`
Default: []
Mandatory: false

The ignore patterns.

### Example

```js
{
    cwd: 'directory/containing/sources', // the source directory
    pattern: '*/*.js' // the pattern
}
```

## Available functions

#### yadop.jsdoc.processor
Type: `Function`
Param: `Configuration` The configuration object as seen above.
Returns: [doctrine](https://github.com/eslint/doctrine)Comment[]

Processes jsdoc for each file in the specified cwd.

#### yadop.ngdoc.processor
Type: `Function`
Param: `Configuration`
Returns: [doctrine](https://github.com/eslint/doctrine)Comment[]

Processes jsdoc for each file in the specified cwd but only containing the ngdoc tags.

#### yadop.ngdoc.mapper
Type: `Function`
Param: [doctrine](https://github.com/eslint/doctrine)`Comment[]` 
Returns: [yadop](blob/initial/lib/ngdoc/model/module.ts)Module[]

Processes a [doctrine](https://github.com/eslint/doctrine)Comment[] and returns a [yadop](blob/initial/lib/ngdoc/model/module.ts)module[]. 

## Example
```json
[{ "name": "my-module" }, {
    "name": "another-module",
    "entities": [{
        "name": "my-component",
        "type": "component",
        "attributes": [{
            "name": "items",
            "optional": false,
            "description": "Some attribute",
            "type": "Object[]"
        }, {
            "name": "items[].name",
            "optional": true,
            "description": "The (optional) name of the item",
            "type": "string"
        }, {
            "name": "items[].value",
            "optional": false,
            "description": "The value of the item",
            "type": "number"
        }]
    }, {
        "name": "SomeService",
        "type": "service",
        "methods": [{
            "name": "SomeService#sayWhat",
            "description": "Says what.",
            "params": [{ "name": "who", "description": "Who said it", "type": "string" }, {
                "name": "when",
                "description": "When to say"
            }]
        }, {
            "name": "SomeService#welcome",
            "description": "Say welcome",
            "returns": { "name": "message The message", "type": "object" }
        }]
    }, { "name": "AnotherService", "type": "service" }]
}]
```