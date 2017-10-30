import Processor from '../../processor';
import * as doctrine from 'doctrine';
import {tags} from '../tags';

/** Ngdoc comment processor. */
class NgdocProcessor extends Processor {

    /** {@inheritDoc} */
    process(): doctrine.Annotation[] {
        return super.process()
            .filter(comment =>
                comment.tags.filter(tags.annotations.ngdoc).length > 0
            );
    }
}

export default NgdocProcessor;
