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
    categ: IColumnInfo,
    descr: IColumnInfo,
    qty: IColumnInfo,
    price: IColumnInfo,
    dttm: IColumnInfo
}

export interface ISimRec {
    simId: number,
    simName: string,
    simDate: string,
    categ: string,
    descr: string,
    qty: number,
    price: number,
    dttm: string,
    op?: string
}


const VIEW_SIZE = 10;

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

	public shiftView(bFwd:boolean, setViewRows: () => void): boolean
	{
		let iStart, changed;
		
		if (bFwd) {
			iStart = this.mStart + VIEW_SIZE - 1;
			changed = (iStart + VIEW_SIZE <= this.mGridRows.length);
		} else {
			iStart = this.mStart - (VIEW_SIZE - 1);
			changed = (iStart >= 0);
		}	
		if (!changed && this.mGridRows.length >= VIEW_SIZE) {
			iStart = this.mGridRows.length - VIEW_SIZE;
			changed = bFwd ? (iStart > this.mStart) : (iStart < this.mStart);
		}
		if (!changed)	return false;
		
		this.mStart = iStart;
		setViewRows();
		return true;
	}

	public addRec(rec: ISimRec):ISimRec {
		let row : ISimRec = {...rec};
		this.mGridRows.push(row);
		return row;
	}
	
    public reload = (rows: ISimRec[]) => {this.mGridRows = [...rows]};

	public removeRow(rIndex:number):void {
		this.mGridRows.splice(this.mStart + rIndex, 1);
	}

	public updateRow(rIndex:number, rec: ISimRec):void {
        let row: ISimRec = this.mGridRows[this.mStart + rIndex];
		row = {...rec};
	}

    public categOptions = () => Object.keys(appCategOptions);

    public categText = (opt: string) => appCategOptions[opt];

	public typeByID(nm:string):string {
		if (nm === 'dttm')		return 'datetime-local';
		if (nm === 'simDate')	return 'date';
		if (nm === 'categ')		return 'select';
		return 'text';
	};
	
}
