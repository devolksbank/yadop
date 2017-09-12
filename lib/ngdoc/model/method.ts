import {ReturnType} from './returnType';
import {ParamType} from './paramType';

export interface Method {
    description?: string;
    deprecated?: string;
    name: string;
    params?: ParamType[];
    returns?: ReturnType;
}

