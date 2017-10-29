import NgdocProcessor from './processor/processor';
import NgdocMapper from './mapper/mapper';
import {Module} from './model/module';

(() => {
    describe('an angular module', () => {
        let module: Module;
        beforeEach(() => {
            let comments = new NgdocProcessor({
                cwd: __dirname,
                pattern: '*.e2e.spec.js'
            }).process();
            let modules = new NgdocMapper().map(comments);
            module = modules[0];

        });

        /**
         * @yadop module
         * @name myModule
         *
         * @description
         * A module is a collection of entities
         *
         * @deprecated
         * An entire module can be made deprecated
         */
        it('maps the module', () => {
            expect(module.name).toEqual('myModule');
            expect(module.description).toEqual('A module is a collection of entities');
            expect(module.deprecated).toEqual('An entire module can be made deprecated');
        });

        /**
         * @yadop component
         * @name myComponent
         * @module myModule
         *
         * @description
         * A component entity has bindings
         *
         * @param {boolean} [parameter=true] @
         * An optional parameter
         *
         * @param {string[]} list <
         * A required list to use
         *
         * @param {function} onChange &
         * Callback function to signal change. Called with `{parameter:<boolean>}`
         *
         * @deprecated
         * Do not use this component anymore
         */
        /**
         * @yadop method
         * @name myControllerMethod
         * @methodOf myComponent
         *
         * @description
         * A method of a controller belonging to a component
         *
         * @param {boolean} [parameter=true]
         * A parameter of the method
         *
         * @returns {boolean}
         * true if the parameter is true, false otherwise
         */
        it('maps the component', () => {
            expect(module.entities[0]).toEqual({
                name: 'myComponent',
                description: 'A component entity has bindings',
                deprecated: 'Do not use this component anymore',
                type: 'component',
                attributes: [{
                    name: 'parameter',
                    optional: true,
                    description: 'An optional parameter',
                    type: 'boolean',
                    defaultValue: 'true',
                    binding: '@'
                }, {
                    name: 'list',
                    optional: false,
                    description: 'A required list to use',
                    binding: '<'
                }, {
                    name: 'onChange',
                    optional: false,
                    description: 'Callback function to signal change. Called with `{parameter:<boolean>}`',
                    binding: '&'
                }],
                requires: [],
                methods: [{
                    name: 'myControllerMethod',
                    description: 'A method of a controller belonging to a component',
                    returns: {name: 'true if the parameter is true, false otherwise', type: 'boolean'},
                    params: [{
                        name: 'parameter',
                        optional: true,
                        description: 'A parameter of the method',
                        type: 'boolean',
                        defaultValue: 'true'
                    }]
                }]
            });
        });

        /**
         * @yadop directive
         * @name myDirective
         * @module myModule
         *
         * @description
         * An attribute directive, used as validator
         *
         * @deprecated
         * Old code which has been replaced
         */
        it('maps the directive', () => {
            expect(module.entities[1]).toEqual({
                name: 'myDirective',
                description: 'An attribute directive, used as validator',
                deprecated: 'Old code which has been replaced',
                type: 'directive',
                attributes: [],
                requires: [],
                methods: []
            });
        });

        /**
         * @yadop service
         * @name myService
         * @module myModule
         *
         * @description
         * A service or factory or provider can have configuration
         *
         * @config {boolean} [configuration=true]
         * A way to modify the behavior of the service
         *
         * @deprecated
         * Old code which has been replaced
         */
        /**
         * @yadop method
         * @name myServiceMethod
         * @methodOf myService
         *
         * @description
         * A service method
         *
         * @param {boolean} [parameter=true]
         * A parameter of the method
         *
         * @returns {boolean}
         * true if the parameter is true, false otherwise
         *
         * @deprecated
         * Old code which has been replaced
         */
        it('maps the service', () => {
            expect(module.entities[2]).toEqual({
                name: 'myService',
                description: 'A service or factory or provider can have configuration',
                deprecated: 'Old code which has been replaced',
                type: 'service',
                attributes: [],
                requires: [],
                methods: [{
                    name: 'myServiceMethod',
                    description: 'A service method',
                    deprecated: 'Old code which has been replaced',
                    returns: {
                        name: 'true if the parameter is true, false otherwise',
                        type: 'boolean'
                    },
                    params: [{
                        name: 'parameter',
                        optional: true,
                        description: 'A parameter of the method',
                        type: 'boolean',
                        defaultValue: 'true'
                    }]
                }]
            });
        });
        /**
         * @yadop foobar
         * @name myFoobar
         * @module myModule
         *
         * @description
         * A custom entity type
         *
         * @deprecated
         * Old code which has been replaced
         */
        it('maps the customElement', () => {
            expect(module.entities[3]).toEqual({
                name: 'myFoobar',
                description: 'A custom entity type',
                deprecated: 'Old code which has been replaced',
                type: 'foobar',
                attributes: [],
                requires: [],
                methods: []
            });
        });
    });
})();
