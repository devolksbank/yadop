import * as doctrine from 'doctrine';

export namespace tags {
    export namespace annotations {

        /**
         * Indicates if the tag is contains a @description tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function description(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['description', 'desc']);
        }

        /**
         * Indicates if the tag is contains a @deprecated tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function deprecated(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['deprecated']);
        }

        /**
         * Indicates if the tag is contains a @methodOf tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function methodOfTag(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['methodOf']);
        }

        /**
         * Indicates if the tag is contains a @module tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function module(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['module']);
        }

        /**
         * Indicates if the tag is contains a @name tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function name(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['name']);
        }

        /**
         * Indicates if the tag is contains a @ngdoc tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function ngdoc(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['ngdoc', 'yadop']);
        }

        /**
         * Indicates if the tag is contains a @param tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function param(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['param', 'arg', 'argument']);
        }

        /**
         * Indicates if the tag is contains a @requires tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function requires(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['requires']);
        }

        /**
         * Indicates if the tag is contains a @return tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function returns(tag: doctrine.Tag): boolean {
            return _onlyAtTags(tag, ['returns', 'return']);
        }

        /**
         * Indicates if the tag is contains a @name tag.
         * @param tag The tag.
         * @param tagNames List of tag name aliases
         * @return {boolean} indicator The indicator.
         * @private
         */
        export function _onlyAtTags(tag: doctrine.Tag, tagNames: string[]): boolean {
            return tagNames.some(tagName => tag.title === tagName);
        }
    }

    export namespace values {
        /**
         * Indicates if the tag is contains a @method tag.
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function method(tag: doctrine.Tag): boolean {
            return ['function', 'func', 'method'].some(tagName => tag.description === tagName)
        }

        /**
         * Indicates if the has description module. -> @ngdoc module
         * @param tag The tag.
         * @return {boolean} indicator The indicator.
         */
        export function module(tag: doctrine.Tag): boolean {
            return tag.description === 'module';
        }

    }
}
