import * as doctrine from 'doctrine';
import {Tag, type} from 'doctrine';
import {tags} from '../tags';
import {Module} from '../model/module';
import {Entity} from '../model/entity';
import {Method} from '../model/method';
import {AttributeType} from '../model/attributeType';
import {Yadop} from "../model/yadop";
import Syntax = type.Syntax;

/** Ngdoc comments mapper. */
class NgdocMapper {

    /**
     * Maps the comments to a workable output.
     * @param comments The comments.
     */
    map(comments: doctrine.Annotation[]): Module[] {
        const modules: Module[] = this.getModules(comments);
        modules.forEach((module: Module) => {
            module.entities = this.getEntities(comments, module);

            module.entities.forEach((entity: Entity) => {
                entity.methods = this.getMethods(comments, entity);
            });
        });
        return modules;
    }

    /**
     * Gets all the entities for the given module.
     * @param {doctrine.Annotation[]} comments The comments.
     * @param {Module} module The module.
     * @returns {Entity[]} entities The entities.
     */
    getEntities = (comments: doctrine.Annotation[], module: Module): Entity[] =>
        comments
            .filter((comment): boolean => comment.tags
                .filter(tags.annotations.module)
                .filter((tag: any) => tag.name === module.name) // match module name
                .length > 0)
            .map(this._toEntity);

    /**
     * Gets all the methods for the given entity.
     * @param {doctrine.Annotation[]} comments The comments.
     * @param {Entity} entity The entity.
     * @returns {Method[]} methods The methods.
     */
    getMethods = (comments: doctrine.Annotation[], entity: Entity): Method[] =>
        comments
            .filter((comment) => comment.tags
                .filter(tags.annotations.methodOfTag)
                .filter((tag: any) => tag.description === entity.name)
                .length > 0)
            .filter((comment) => comment.tags
                .filter(tags.values.method)
                .length > 0)
            .map(this._toMethod);

    /**
     * Gets all the modules.
     * @param {doctrine.Annotation[]} comments The comments.
     * @returns {Module[]} modules The modules.
     */
    getModules = (comments: doctrine.Annotation[]): Module[] =>
        comments
            .filter((comment) => comment.tags
                .filter(tags.values.module).length > 0)
            .map(this._toModule);

    /**
     * Gets the return if present.
     * @param {doctrine.Annotation} comment The entity.
     * @return {AttributeType} returnType The returnType.
     * @private
     */
    private _getReturn = (comment: doctrine.Annotation): AttributeType => {
        let returnType: AttributeType;

        const tag = comment.tags.find(tags.annotations.returns);
        if (tag) {
            returnType = {
                name: tag.description
            };
            if (tag.type) {
                returnType.type = (tag.type as any).name;
            }
        }
        return returnType;
    };

    /**
     * Gets the deprecated tag if present.
     * @param {doctrine.Annotation} comment The entity.
     * @return {doctrine.Tag} tag The tag.
     * @private
     */
    private _getDeprecated = (comment: doctrine.Annotation): doctrine.Tag =>
        comment.tags.find(tags.annotations.deprecated);

    private _getDescription = (comment: doctrine.Annotation): doctrine.Tag =>
        comment.tags.find(tags.annotations.description);

    /**
     * Gets all the requires for the given entity.
     * @param {doctrine.Annotation} comment The comment.
     * @returns {string[]} requires The requires.
     */
    private _getRequires = (comment: doctrine.Annotation): string[] =>
        comment.tags.filter(tags.annotations.requires).map((tag) => (tag as any).name);

    /**
     * Gets all the attributes for the given entity.
     * @param {doctrine.Annotation} comment The comment.
     * @returns {AttributeType[]} attributes The attributes.
     */
    private _getAttributes = (comment: doctrine.Annotation): AttributeType[] =>
        comment.tags
            .filter(tags.annotations.param)
            .map(this._toAttributeType);

    private _getBindings = (comment: doctrine.Annotation): AttributeType[] =>
        comment.tags
            .filter(tags.annotations.param)
            .map(this._toAttributeType)
            .map((attributeType: AttributeType) => {
                var binding = /([@&<=]+)/.exec(attributeType.description);
                if (binding) {
                    attributeType.description = attributeType.description
                        .replace(binding[0], '')
                        .replace(/^[\n\r]+/, '');
                    attributeType.binding = binding[0];
                }
                return attributeType;
            });

    private _toAttributeType = (tag: Tag): AttributeType => {
        const attributeType: AttributeType = {
            name: tag.name,
            optional: false
        };

        if (tag.description) {
            attributeType.description = tag.description.replace(/^[\n\r]+/, '');
        }
        attributeType.optional = !!tag.type && tag.type.type === Syntax.OptionalType;
        if (tag.type && tag.type.type === Syntax.OptionalType) {
            if (tag.type.expression.type === Syntax.NameExpression) {
                attributeType.type = tag.type.expression.name;
            }
            attributeType.defaultValue = tag['default'];
        }
        return attributeType;
    };

    /**
     * Converts the given comment to an Entity.
     * @param {doctrine.Annotation} comment The entity.
     * @return {Entity} entity The entity.
     * @private
     */
    private _toEntity = (comment: doctrine.Annotation): Entity => {
        const entity: Entity = this._createYadop(comment);
        var type = comment.tags.find(tags.annotations.ngdoc);
        if (type) {
            entity.type = type.description;
            if (entity.type === 'component') {
                entity.attributes = this._getBindings(comment);
            } else {
                entity.attributes = this._getAttributes(comment);
            }
        }
        entity.requires = this._getRequires(comment);
        return entity;
    };

    /**
     * Converts the given comment to a method.
     * @param {doctrine.Annotation} comment The entity.
     * @return {Method} method The method.
     * @private
     */
    private _toMethod = (comment: doctrine.Annotation): Method => {
        const method: Method = this._createYadop(comment);

        const returnType = this._getReturn(comment);
        if (returnType) {
            method.returns = returnType;
        }

        const params = this._getAttributes(comment);
        if (params.length > 0) {
            method.params = params;
        }
        return method;
    };

    /**
     * Converts the given comment to a Module.
     * @param {doctrine.Annotation} comment The comment.
     * @return {Module} module The module.
     * @private
     */
    private _toModule = (comment: doctrine.Annotation): Module => {
        return this._createYadop(comment);
    };

    private _createYadop = (comment: doctrine.Annotation): Yadop => {
        let yadop: Yadop = {
            name: (comment.tags.find((tag) => tag.title === 'name') as any).name
        };
        const description = this._getDescription(comment);
        if (description) {
            yadop.description = description.description;
        }

        const deprecated = this._getDeprecated(comment);
        if (deprecated) {
            yadop.deprecated = deprecated.description;
        }

        return yadop;
    };
}

export default NgdocMapper;
