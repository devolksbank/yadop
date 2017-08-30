import Configuration from './configuration';
import * as glob from 'glob';
import * as espree from 'espree';
import * as doctrine from 'doctrine';
import * as path from 'path';
import * as fs from 'fs-extra';

/** Docs processor. */
class Processor {
    private DEFAULT_CWD = process.cwd();
    private DEFAULT_PATTERN = '**/*.js';
    private DEFAULT_IGNORE: string[] = [];
    private ESPREE_PARSE_OPTIONS: espree.ParseOptions = {
        comments: true,
        attachComment: true,
    };

    private pattern: string;
    private options: any;

    /**
     * Constructor.
     * @param configuration The configuraton object.
     */
    constructor(private configuration: Configuration) {
        this.pattern = configuration.pattern || this.DEFAULT_PATTERN;

        this.options = {
            cwd: configuration.cwd || this.DEFAULT_CWD,
            ignore: configuration.ignore || this.DEFAULT_IGNORE,
            nodir: true,
            nosort: true
        };
    }

    /**
     * Process all matching files and return the comments.s
     * @return {[Comment,Comment,Comment,Comment,Comment]}
     */
    process(): doctrine.Comment[] {
        return glob
            .sync(this.pattern, this.options)
            .map(this._toEspreeComments)
            .reduce(this._concatComments)
            .map(this._toDoctrineComments);
    }

    /**
     * Reads and parses the provided file using espree.
     * @param file The file
     * @return {Comment[]} comments The comments from the provided file.
     * @private
     */
    private _toEspreeComments = (file: string): espree.Comment[] => {
        const filename = path.join(this.options.cwd, file);
        const code = fs.readFileSync(filename);
        return espree.parse(code, this.ESPREE_PARSE_OPTIONS).comments;
    };

    /**
     * Merge the comments.
     * @param previousComments The list of previous comments.
     * @param currentComments The list of current comments.
     */
    private _concatComments = (previousComments: espree.Comment[],
                               currentComments: espree.Comment[]): espree.Comment[] =>
        previousComments.concat(currentComments);

    /**
     * Converts the espree comments to doctrine comments.
     * @param comment The comment.
     * @private
     */
    private _toDoctrineComments = (comment: espree.Comment): doctrine.Comment =>
        doctrine.parse(comment.value, { unwrap: true });
}

export default Processor;
