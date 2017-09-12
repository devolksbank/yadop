import * as doctrine from 'doctrine';
import NgdocMapper from './ngdocMapper';
import {Module} from './model/module';
import {Entity} from './model/entity';
import {Method} from './model/method';

(() => {
    describe('ngdoc mapper', () => {
        let mapper: NgdocMapper;

        const comments: doctrine.Comment[] = [{
            tags: [
                { title: 'ngdoc', description: 'module' },
                { title: 'name', description: null, name: 'my-module' }
            ]
        } as doctrine.Comment, {
            tags: [
                { title: 'description', description: 'something' } // just a comment
            ]
        } as doctrine.Comment, {
            tags: [
                { title: 'ngdoc', description: 'module' },
                { title: 'name', description: null, name: 'another-module' }
            ]
        } as doctrine.Comment, {
            tags: [
                { title: 'ngdoc', description: 'component' },
                { title: 'module', description: null, type: null, name: 'another-module' },
                { title: 'name', description: null, name: 'my-component' },
                { title: 'description', description: 'This component does something for me' },
                {
                    title: 'param', description: 'Some attribute',
                    type: {
                        type: 'TypeApplication', expression: { type: 'NameExpression', name: 'Array' },
                        applications: [{ type: 'NameExpression', name: 'Object' }]
                    },
                    name: 'items'
                }, {
                    title: 'param', description: 'The (optional) name of the item',
                    type: {
                        type: 'OptionalType',
                        expression: {
                            type: 'NameExpression',
                            name: 'string'
                        }
                    },
                    name: 'items[].name'
                },
                {
                    title: 'param', description: 'The value of the item',
                    type: {
                        type: 'NameExpression',
                        name: 'number'
                    },
                    name: 'items[].value'
                },
            ]
        }  as doctrine.Comment, { // an entity
            tags: [
                { title: 'ngdoc', description: 'service' },
                { title: 'module', description: null, type: null, name: 'another-module' },
                { title: 'name', description: null, name: 'SomeService' },
                { title: 'description', description: 'Some service' },
                { title: 'requires', description: null, name: 'SomeOtherService' },
                { title: 'requires', description: null, name: 'AnotherService' }
            ]
        }  as doctrine.Comment, { // another entity
            tags: [
                { title: 'ngdoc', description: 'service' },
                { title: 'module', description: null, type: null, name: 'another-module' },
                { title: 'name', description: null, name: 'AnotherService' },
                { title: 'requires', description: null, name: 'SomeService' },
                { title: 'deprecated', description: 'Use some other service.' },
            ]
        }  as doctrine.Comment, { // another entity, but does not match a valid entity type
            tags: [
                { title: 'ngdoc', description: 'invalid-type' },
                { title: 'module', description: null, type: null, name: 'another-module' },
                { title: 'name', description: null, name: 'another-component' },
                { title: 'description', description: 'This component does something for someone else' }
            ]
        }  as doctrine.Comment, { // an entity method
            tags: [
                { title: 'ngdoc', description: 'method' },
                { title: 'methodOf', description: 'SomeService' },
                { title: 'name', description: null, name: 'SomeService#sayWhat' },
                { title: 'description', description: 'Says what.' },
                {
                    title: 'param', description: 'Who said it', name: 'who',
                    type: { type: 'NameExpression', name: 'string' }
                },
                { title: 'param', description: 'When to say', name: 'when', 'type': null } // no type
            ]
        } as doctrine.Comment, { // another entity method
            tags: [
                { title: 'ngdoc', description: 'method' },
                { title: 'methodOf', description: 'SomeService' },
                { title: 'name', description: null, name: 'SomeService#welcome' },
                { title: 'description', description: 'Say welcome' },
                {
                    title: 'return', description: 'message The message',
                    type: { type: 'NameExpression', name: 'object' }
                }
            ]
        } as doctrine.Comment];


        beforeEach(() => {
            mapper = new NgdocMapper();
        });

        describe('map', () => {
            it('maps', () => {
                const actual: Module[] = mapper.map(comments);
                const expected = [{ name: 'my-module', entities: [] }, {
                    name: 'another-module',
                    entities: [{
                        name: 'my-component',
                        type: 'component',
                        description: 'This component does something for me',
                        methods: [],
                        attributes: [{
                            name: 'items',
                            optional: false,
                            description: 'Some attribute',
                            type: 'Object[]'
                        }, {
                            name: 'items[].name',
                            optional: true,
                            description: 'The (optional) name of the item',
                            type: 'string'
                        }, {
                            name: 'items[].value',
                            optional: false,
                            description: 'The value of the item',
                            type: 'number'
                        }],
                        requires: []
                    }, {
                        name: 'SomeService',
                        type: 'service',
                        description: 'Some service',
                        methods: [{
                            name: 'SomeService#sayWhat',
                            description: 'Says what.',
                            params: [{ name: 'who', description: 'Who said it', type: 'string' }, {
                                name: 'when',
                                description: 'When to say'
                            }]
                        }, {
                            name: 'SomeService#welcome',
                            description: 'Say welcome',
                            returns: { name: 'message The message', type: 'object' }
                        }],
                        attributes: [],
                        requires: [
                            'SomeOtherService',
                            'AnotherService'
                        ]
                    }, {
                        name: 'AnotherService',
                        type: 'service',
                        deprecated: 'Use some other service.',
                        methods: [],
                        attributes: [],
                        requires: ['SomeService']
                    }]
                }];
                expect(actual).toEqual(expected)
            });
        });

        describe('getModules', () => {
            it('gets the modules', () => {
                const modules: Module[] = mapper.getModules(comments);
                expect(modules.length).toBe(2);
                expect(modules[0]).toEqual({ name: 'my-module' });
                expect(modules[1]).toEqual({ name: 'another-module' });
            });
        });

        describe('getEntities', () => {
            it('gets the valid entities', () => {
                const entities: Entity[] = mapper.getEntities(comments, { name: 'another-module' });
                expect(entities.length).toBe(3);
                expect(entities[0]).toEqual({
                    name: 'my-component',
                    type: 'component',
                    description: 'This component does something for me',
                    attributes: [{
                        name: 'items',
                        optional: false,
                        description: 'Some attribute',
                        type: 'Object[]'
                    }, {
                        name: 'items[].name',
                        optional: true,
                        description: 'The (optional) name of the item',
                        type: 'string'
                    }, {
                        name: 'items[].value',
                        optional: false,
                        description: 'The value of the item',
                        type: 'number'
                    }],
                    requires: []
                });
                expect(entities[1]).toEqual({
                    name: 'SomeService',
                    type: 'service',
                    description: 'Some service',
                    attributes: [],
                    requires: ['SomeOtherService', 'AnotherService']
                });
                expect(entities[2]).toEqual({
                    name: 'AnotherService',
                    type: 'service',
                    deprecated: 'Use some other service.',
                    attributes: [],
                    requires: ['SomeService']
                });
            });
        });

        describe('getMethod', () => {
            it('gets the methods', () => {
                const serviceMethod: Method[] = mapper.getMethods(comments, {
                    name: 'SomeService',
                    type: 'service',
                    requires: [],
                    attributes: []
                });
                expect(serviceMethod.length).toBe(2);
                expect(serviceMethod[0]).toEqual({
                    name: 'SomeService#sayWhat', description: 'Says what.',
                    params: [
                        { name: 'who', description: 'Who said it', type: 'string' }, // with a type
                        { name: 'when', description: 'When to say' } // without type (not specified)
                    ] // no return type
                });
                expect(serviceMethod[1]).toEqual({
                    name: 'SomeService#welcome',
                    description: 'Say welcome',
                    returns: { name: 'message The message', type: 'object' }
                });
            });
        });
    });
})();
