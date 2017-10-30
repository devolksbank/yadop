import * as doctrine from 'doctrine';
import NgdocMapper from './mapper';
import {Module} from '../model/module';
import {Entity} from '../model/entity';
import {Method} from '../model/method';

(() => {
    describe('ngdoc mapper', () => {
        let mapper: NgdocMapper;

        const comments: doctrine.Annotation[] = [{
            tags: [
                {title: 'ngdoc', description: 'module'},
                {title: 'name', description: null, name: 'my-module'}
            ]
        } as doctrine.Annotation, {
            tags: [
                {title: 'description', description: 'something'} // just a comment
            ]
        } as doctrine.Annotation, {
            tags: [
                {title: 'ngdoc', description: 'module'},
                {title: 'name', description: null, name: 'another-module'}
            ]
        } as doctrine.Annotation, {
            tags: [
                {title: 'ngdoc', description: 'component'},
                {title: 'module', description: null, type: null, name: 'another-module'},
                {title: 'name', description: null, name: 'my-component'},
                {title: 'description', description: 'This component does something for me'},
                {
                    title: 'param', description: 'Some attribute',
                    type: {
                        type: 'TypeApplication', expression: {type: 'NameExpression', name: 'Array'},
                        applications: [{type: 'NameExpression', name: 'Object'}]
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
        }  as doctrine.Annotation, { // an entity
            tags: [
                {title: 'ngdoc', description: 'service'},
                {title: 'module', description: null, type: null, name: 'another-module'},
                {title: 'name', description: null, name: 'SomeService'},
                {title: 'description', description: 'Some service'},
                {title: 'requires', description: null, name: 'SomeOtherService'},
                {title: 'requires', description: null, name: 'AnotherService'}
            ]
        }  as doctrine.Annotation, { // another entity
            tags: [
                {title: 'ngdoc', description: 'service'},
                {title: 'module', description: null, type: null, name: 'another-module'},
                {title: 'name', description: null, name: 'AnotherService'},
                {title: 'requires', description: null, name: 'SomeService'},
                {title: 'deprecated', description: 'Use some other service.'},
            ]
        }  as doctrine.Annotation, { // another entity, but does not match a valid entity type
            tags: [
                {title: 'ngdoc', description: 'invalid-type'},
                {title: 'module', description: null, type: null, name: 'another-module'},
                {title: 'name', description: null, name: 'another-component'},
                {title: 'description', description: 'This component does something for someone else'}
            ]
        }  as doctrine.Annotation, { // an entity method
            tags: [
                {title: 'ngdoc', description: 'method'},
                {title: 'methodOf', description: 'SomeService'},
                {title: 'name', description: null, name: 'sayWhat'},
                {title: 'description', description: 'Says what.'},
                {
                    title: 'param', description: 'Who said it', name: 'who',
                    type: {type: 'NameExpression', name: 'string'}
                },
                {title: 'param', description: 'When to say', name: 'when', 'type': null}, // no type
                {
                    title: 'returns', description: 'message The message',
                    type: {type: 'NameExpression', name: 'object'}
                }
            ]
        } as doctrine.Annotation, { // another entity method
            tags: [
                {title: 'ngdoc', description: 'method'},
                {title: 'methodOf', description: 'SomeService'},
                {title: 'name', description: null, name: 'SomeService#welcome'},
                {title: 'description', description: 'Say welcome'},
                {
                    title: 'return', description: 'message The message',
                    type: {type: 'NameExpression', name: 'object'}
                }
            ]
        } as doctrine.Annotation];


        beforeEach(() => {
            mapper = new NgdocMapper();
        });

        describe('map', () => {
            it('maps', () => {
                const actual: Module[] = mapper.map(comments);
                const expected = [{name: 'my-module', entities: []}, {
                    name: 'another-module',
                    entities: [{
                        name: 'my-component',
                        description: 'This component does something for me',
                        type: 'component',
                        attributes: [{name: 'items', optional: false, description: 'Some attribute'}, {
                            name: 'items[].name',
                            optional: true,
                            description: 'The (optional) name of the item',
                            type: 'string',
                            defaultValue: undefined
                        }, {name: 'items[].value', optional: false, description: 'The value of the item'}],
                        requires: [],
                        methods: []
                    }, {
                        name: 'SomeService',
                        description: 'Some service',
                        type: 'service',
                        attributes: [],
                        requires: ['SomeOtherService', 'AnotherService'],
                        methods: [{
                            name: 'sayWhat',
                            description: 'Says what.',
                            returns: {name: 'message The message', type: 'object'},
                            params: [{name: 'who', optional: false, description: 'Who said it'}, {
                                name: 'when',
                                optional: false,
                                description: 'When to say'
                            }]
                        }, {
                            name: 'SomeService#welcome',
                            description: 'Say welcome',
                            returns: {name: 'message The message', type: 'object'}
                        }]
                    }, {
                        name: 'AnotherService',
                        deprecated: 'Use some other service.',
                        type: 'service',
                        attributes: [],
                        requires: ['SomeService'],
                        methods: []
                    }, {
                        name: 'another-component',
                        description: 'This component does something for someone else',
                        type: 'invalid-type',
                        attributes: [],
                        requires: [],
                        methods: []
                    }]
                }];
                expect(actual).toEqual(expected)
            });
        });

        describe('getModules', () => {
            it('gets the modules', () => {
                const modules: Module[] = mapper.getModules(comments);
                expect(modules.length).toBe(2);
                expect(modules[0]).toEqual({name: 'my-module'});
                expect(modules[1]).toEqual({name: 'another-module'});
            });
        });

        describe('getEntities', () => {
            it('gets the valid entities', () => {
                const entities: Entity[] = mapper.getEntities(comments, {name: 'another-module'});
                expect(entities.length).toBe(4);
                expect(entities[0]).toEqual({
                    name: 'my-component',
                    description: 'This component does something for me',
                    type: 'component',
                    attributes: [{name: 'items', optional: false, description: 'Some attribute'}, {
                        name: 'items[].name',
                        optional: true,
                        description: 'The (optional) name of the item',
                        type: 'string',
                        defaultValue: undefined
                    }, {name: 'items[].value', optional: false, description: 'The value of the item'}],
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
                expect(entities[3]).toEqual({
                    name: 'another-component',
                    description: 'This component does something for someone else',
                    type: 'invalid-type',
                    attributes: [],
                    requires: []
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
                    name: 'sayWhat',
                    description: 'Says what.',
                    returns: {name: 'message The message', type: 'object'},
                    params: [{name: 'who', optional: false, description: 'Who said it'}, {
                        name: 'when',
                        optional: false,
                        description: 'When to say'
                    }]
                });
                expect(serviceMethod[1]).toEqual({
                    name: 'SomeService#welcome',
                    description: 'Say welcome',
                    returns: {name: 'message The message', type: 'object'}
                });
            });
        });
    });
})();
