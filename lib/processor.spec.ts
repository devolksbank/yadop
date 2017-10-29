import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as sinon from 'sinon';
import Configuration from './configuration';
import Processor from './processor';
import * as espree from 'espree';
import * as doctrine from 'doctrine';
import * as path from 'path';

(() => {
    describe('processor', () => {
        let globSyncFn: sinon.SinonStub;
        let fsReadFileSyncFn: sinon.SinonStub;
        let espreeParseFn: sinon.SinonStub;
        let doctrineParseFn: sinon.SinonStub;

        let configuration: Configuration;
        let processor: Processor;
        let result: doctrine.Annotation[];

        const code = 'code';

        beforeEach(() => {
            globSyncFn = sinon.stub(glob, 'sync').callsFake(() => [
                'one', 'two', 'three'
            ]);
            fsReadFileSyncFn = sinon.stub(fs, 'readFileSync').callsFake((file) => file + '-content');

            espreeParseFn = sinon.stub(espree, 'parse');
            espreeParseFn.onCall(0).returns({ comments: [{ value: 'one' }] });
            espreeParseFn.onCall(1).returns({ comments: [{ value: 'two' }, { value: 'another two' }] });
            espreeParseFn.onCall(2).returns({ comments: [{ value: 'three' }] });

            doctrineParseFn = sinon.stub(doctrine, 'parse');
            doctrineParseFn.callsFake((comment, options) => ({
                description: comment + '-doctrine',
                tags: [{ title: 'param', 'description': 'some param' }]
            }));
        });

        describe('process', () => {
            describe('provided with configuration options', () => {
                beforeEach(() => {
                    configuration = {
                        cwd: 'cwd',
                        pattern: 'pattern',
                        ignore: ['ignore']
                    };
                    processor = new Processor(configuration);
                    result = processor.process();
                });

                it('processes the code from the provided configuration options', () => {
                    sinon.assert.calledWith(globSyncFn, 'pattern', { // provided pattern
                        cwd: 'cwd', // provided cwd
                        ignore: ['ignore'], // provided ignore
                        nodir: true,
                        nosort: true
                    });
                });

                it('processes each file using espree', () => {
                    sinon.assert.calledWith(espreeParseFn, path.join('cwd', 'one-content'));
                    sinon.assert.calledWith(espreeParseFn, path.join('cwd', 'two-content'));
                    sinon.assert.calledWith(espreeParseFn, path.join('cwd', 'three-content'));
                });

                it('processes each comment using doctrine', () => {
                    sinon.assert.calledWith(doctrineParseFn, 'one');
                    sinon.assert.calledWith(doctrineParseFn, 'two');
                    sinon.assert.calledWith(doctrineParseFn, 'another two');
                    sinon.assert.calledWith(doctrineParseFn, 'three');
                });

                it('returns the doctrine.Annotations', () => {
                    expect(result.length).toBe(4);
                    expect(result[0]).toEqual({
                        description: 'one-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                    expect(result[1]).toEqual({
                        description: 'two-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                    expect(result[2]).toEqual({
                        description: 'another two-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                    expect(result[3]).toEqual({
                        description: 'three-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                });

                afterEach(() => {
                    globSyncFn.reset();
                    fsReadFileSyncFn.reset();
                    espreeParseFn.reset();
                    doctrineParseFn.reset();
                });
            });

            describe('provided without configuration options', () => {
                beforeEach(() => {
                    configuration = {};
                    processor = new Processor(configuration);
                    result = processor.process();
                });

                it('processes the code from the default configuration options', () => {
                    sinon.assert.calledWith(globSyncFn, '**/*.js', { // default pattern
                        cwd: process.cwd(), // default cwd
                        ignore: [], // default ignore
                        nodir: true,
                        nosort: true
                    });
                });

                it('processes each file using espree', () => {
                    sinon.assert.calledWith(espreeParseFn, path.join(process.cwd(), 'one-content'));
                    sinon.assert.calledWith(espreeParseFn, path.join(process.cwd(), 'two-content'));
                    sinon.assert.calledWith(espreeParseFn, path.join(process.cwd(), 'three-content'));
                });

                it('processes each comment using doctrine', () => {
                    sinon.assert.calledWith(doctrineParseFn, 'one');
                    sinon.assert.calledWith(doctrineParseFn, 'two');
                    sinon.assert.calledWith(doctrineParseFn, 'another two');
                    sinon.assert.calledWith(doctrineParseFn, 'three');
                });

                it('returns the doctrine.Annotations', () => {
                    expect(result.length).toBe(4);
                    expect(result[0]).toEqual({
                        description: 'one-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                    expect(result[1]).toEqual({
                        description: 'two-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                    expect(result[2]).toEqual({
                        description: 'another two-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                    expect(result[3]).toEqual({
                        description: 'three-doctrine',
                        tags: [{ title: 'param', 'description': 'some param' }]
                    } as doctrine.Annotation);
                });

                afterEach(() => {
                    globSyncFn.reset();
                    fsReadFileSyncFn.reset();
                    espreeParseFn.reset();
                    doctrineParseFn.reset();
                });
            });
        });

        afterEach(() => {
            globSyncFn.restore();
            fsReadFileSyncFn.restore();
            espreeParseFn.restore();
            doctrineParseFn.restore();
        });
    });
})();
