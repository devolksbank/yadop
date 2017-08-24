import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as sinon from 'sinon';
import * as espree from 'espree';
import * as doctrine from 'doctrine';
import Configuration from '../configuration';
import NgdocProcessor from './ngdocProcessor';

(() => {
    describe('ngdoc processor', () => {
        let globSyncFn: sinon.SinonStub;
        let fsReadFileSyncFn: sinon.SinonStub;
        let espreeParseFn: sinon.SinonStub;
        let doctrineParseFn: sinon.SinonStub;

        let configuration: Configuration;
        let processor: NgdocProcessor;
        let result: doctrine.Comment[];

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
            doctrineParseFn.onCall(0).returns({
                description: 'one-doctrine',
                tags: [{ title: 'param', 'description': 'some param' }]
            });
            doctrineParseFn.onCall(1).returns({
                description: 'two-doctrine',
                tags: [{ title: 'param', 'description': 'some param' }]
            });
            doctrineParseFn.onCall(2).returns({
                description: 'another two-doctrine',
                tags: [{ title: 'ngdoc', 'description': 'some param' }]
            });
            doctrineParseFn.onCall(3).returns({
                description: 'three-doctrine',
                tags: [{ title: 'ngdoc', 'description': 'some param' }]
            });
        });

        describe('process', () => {
            beforeEach(() => {
                configuration = {};
                processor = new NgdocProcessor(configuration);
                result = processor.process();
            });

            it('returns the only the ngdoc doctrine comments', () => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual({
                    description: 'another two-doctrine',
                    tags: [{ title: 'ngdoc', 'description': 'some param' }]
                } as doctrine.Comment);
                expect(result[1]).toEqual({
                    description: 'three-doctrine',
                    tags: [{ title: 'ngdoc', 'description': 'some param' }]
                } as doctrine.Comment);
            });

            afterEach(() => {
                globSyncFn.reset();
                fsReadFileSyncFn.reset();
                espreeParseFn.reset();
                doctrineParseFn.reset();
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
