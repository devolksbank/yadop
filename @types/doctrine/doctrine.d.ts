// d.ts file for doctrine.
// Only the bare minimal has been declared here.
declare namespace doctrine {
    export interface Comment {
        description: string;
        tags: Tag[];
    }

    export interface Tag {
        title: string;
        description: string;
        type: Type;
    }

    export interface Type {
        type: string;
        name: string;
    }
}

declare module 'doctrine' {
    export function parse(code: string | Buffer, options: any): Comment;
}
export = doctrine;
