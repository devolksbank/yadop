import Configuration from './lib/configuration';
import Processor from './lib/processor';
import NgdocProcessor from './lib/ngdoc/ngdocProcessor';
import NgdocMapper from './lib/ngdoc/ngdocMapper';

(() => {
    'use strict';

    module.exports = {
        jsdoc: {
            processor: (configuration: Configuration) => {
                return new Processor(configuration);
            }
        },
        ngdoc: {
            processor: (configuration: Configuration) => {
                return new NgdocProcessor(configuration);
            },
            mapper: () => {
                return new NgdocMapper()
            }
        }
    }
})();
