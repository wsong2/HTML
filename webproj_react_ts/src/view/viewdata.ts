import gridData from './data/grid_data_0.json';

export interface IColumnInfo {
    [caption: string]: string
}

export interface IColumnInfoSorting {
    [caption: string]: string,
    sorting: string
}

export interface IColumnRec {
    [simId:string]: IColumnInfo,
    simName: IColumnInfoSorting,
    simDate: IColumnInfoSorting,
    category: IColumnInfo,
    desc: IColumnInfo,
    qty: IColumnInfo,
    price: IColumnInfo,
    dttm: IColumnInfo
}

export interface ISimRec {
    simId: number,
    simName: string,
    simDate: string,
    category: string,
    desc: string,
    qty: number,
    price: number,
    dttm: string,
    op?: string
}

type CategOption = {
    [App: string]: string,
    Test: string
    Device: string
    Sim: string
    Product: string
}

const appCategOptions:CategOption = { 
	App: "App",
	Test: "Test",
	Device: "Device",
	Sim: "Sim",
	Product: "Product"
};

export class GridData {
	mStart: number = 0;
	mGridRows: ISimRec[] = gridData.rows;
	
    public keys = () => gridData.keys;

    public columnDfn(id: string): IColumnInfo {
        let cols:IColumnRec  = gridData.columns;
        return cols[id];
    }

    public rows = () => this.mGridRows;

	public addRec(rec: ISimRec):ISimRec {
		let row : ISimRec = {...rec};
		this.mGridRows.push(row);
		return row;
	}
	
    public reload = (rows: ISimRec[]) => {this.mGridRows = [...rows]};

	public updateRow(rIndex:number, rec: ISimRec):void {
		let actualIndex = this.mStart + rIndex;
		console.log('** updateRow Price: #' + rIndex + ' ' + JSON.stringify(rec));
        Object.assign(this.mGridRows[actualIndex], rec);
	}

	public removeRow(rIndex:number):void {
		this.mGridRows.splice(this.mStart + rIndex, 1);
	}

    public categOptions = () => Object.keys(appCategOptions);

    public categText = (opt: string) => appCategOptions[opt];
	
}
