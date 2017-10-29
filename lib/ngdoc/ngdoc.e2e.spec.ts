import NgdocProcessor from './processor/processor';
import NgdocMapper from './mapper/mapper';
import {Module} from './model/module';
import {Entity} from "./model/entity";

(() => {
    describe('an angular module', () => {
        let module: Module;
        let component: Entity;
        let directive: Entity;
        let service: Entity;
        let customized: Entity;

        beforeEach(() => {
            // all comments in this spec file are parsed
            // the relevant code blocks are described by the unit tests below
            let comments = new NgdocProcessor({
                cwd: __dirname,
                pattern: '*.e2e.spec.js'
            }).process();
            let modules = new NgdocMapper().map(comments);
            module = modules[0];
            component = module.entities[0];
            directive = module.entities[1];
            service = module.entities[2];
            customized = module.entities[3];
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
            expect(module.entities.length).toEqual(4);
        });

        describe('component', function () {
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
            it('maps the basics', () => {
                expect(component.name).toEqual('myComponent');
                expect(component.description).toEqual('A component entity has bindings');
                expect(component.deprecated).toEqual('Do not use this component anymore');
                expect(component.type).toEqual('component');
            });
            it('maps the bindings', () => {
                expect(component.attributes[0]).toEqual({
                    name: 'parameter',
                    optional: true,
                    description: 'An optional parameter',
                    type: 'boolean',
                    defaultValue: 'true',
                    binding: '@'
                });
                expect(component.attributes[1]).toEqual({
                    name: 'list',
                    optional: false,
                    description: 'A required list to use',
                    binding: '<'
                });
                expect(component.attributes[2]).toEqual({
                    name: 'onChange',
                    optional: false,
                    description: 'Callback function to signal change. Called with `{parameter:<boolean>}`',
                    binding: '&'
                })
            });
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
            it('maps the methods', () => {
                let methods = component.methods;
                expect(methods[0]).toEqual({
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
                });
            });
        });
        describe('directive', function () {
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
            it('maps the entity', () => {
                expect(directive).toEqual({
                    name: 'myDirective',
                    description: 'An attribute directive, used as validator',
                    deprecated: 'Old code which has been replaced',
                    type: 'directive',
                    attributes: [],
                    requires: [],
                    methods: []
                });
            });
        });
        describe('service', function () {
            /**
             * @yadop service
             * @name myService
             * @module myModule
             *
             * @description
             * A service, factory or provider can have configuration
             *
             * @param {boolean} [configuration=true]
             * A way to modify the behavior of the service
             *
             * @deprecated
             * Old code which has been replaced
             */
            it('maps the entity', () => {
                expect(service.name).toEqual('myService');
                expect(service.description).toEqual('A service, factory or provider can have configuration');
                expect(service.deprecated).toEqual('Old code which has been replaced');
                expect(service.type).toEqual('service');
            });
            it('maps the configuration parameters', () => {
                expect(service.attributes[0]).toEqual({
                    name: 'configuration',
                    optional: true,
                    description: 'A way to modify the behavior of the service',
                    type: 'boolean',
                    defaultValue: 'true'
                });
            });
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
            it('maps the methods', () => {
                expect(service.methods[0]).toEqual({
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
                });
            });
        });
        describe('customized', function () {
            /**
             * @yadop customized
             * @name myCustomized
             * @module myModule
             *
             * @description
             * A custom entity type
             *
             * @deprecated
             * Old code which has been replaced
             */
            it('maps the customElement', () => {
                expect(customized).toEqual({
                    name: 'myCustomized',
                    description: 'A custom entity type',
                    deprecated: 'Old code which has been replaced',
                    type: 'customized',
                    attributes: [],
                    requires: [],
                    methods: []
                });
            });
        })
    });
})();
