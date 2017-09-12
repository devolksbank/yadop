import {ReturnType} from './returnType';
import {ParamType} from './paramType';

export interface Method {
    description?: string;
    deprecated: boolean;
    name: string;
    params?: ParamType[];
    returns?: ReturnType;
}

