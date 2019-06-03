export default class SearchResultItem {
    private _path: string

    public get path(): string {
        return this._path;
    }

    public set path (value: string) {
        this._path = value;
    }

    public get watchUrl (): string {
        return `/watch/${encodeURIComponent(this.path)}`;
    }

    public constructor (path: string) {
        this._path = path;
    };
}