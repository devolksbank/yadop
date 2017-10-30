import Configuration from './lib/configuration';
import Processor from './lib/processor';
import NgdocProcessor from './lib/ngdoc/processor/processor';
import NgdocMapper from './lib/ngdoc/mapper/mapper';

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
