import Processor from '../processor';
import * as doctrine from 'doctrine';

/** Ngdoc comment processor. */
class NgdocProcessor extends Processor {

    /** {@inheritDoc} */
    process(): doctrine.Comment[] {
        return super.process()
            .filter(this._onCommentsContainingNgdoc);
    }

    /**
     * Filter only allows comments containing ngdoc.
     * @param comment The comment.
     * @return {boolean} match Indicator match.
     * @private
     */
    private _onCommentsContainingNgdoc = (comment: doctrine.Comment): boolean =>
        comment.tags.filter((tag) => tag.title === 'ngdoc').length > 0;
}

export default NgdocProcessor;
