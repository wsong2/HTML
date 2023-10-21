interface ISimRec {
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

interface IColumnInfo {
    caption: string,
    sorting?: string
}

interface IColumnRec {
    simId: IColumnInfo,
    simName: IColumnInfo,
    simDate: IColumnInfo,
    categ: IColumnInfo,
    descr: IColumnInfo,
    qty: IColumnInfo,
    price: IColumnInfo,
    dttm: IColumnInfo
}

type TypeSimRows = ISimRec[];

interface IGridData0 {
    keys: string[],
    columnDfn: (string) => IColumnInfo,
    rows: () => ISimRec[],
    add: (ISimRec) => ISimRec,
    reload: (TypeSimRows) => void,
    remove: (number) => void,
    update: (number, ISimRec) => void,
    shiftView: (boolean) => boolean,
    categOptions: string[],
    categText: (string) => string,
    typeByID: string
}
