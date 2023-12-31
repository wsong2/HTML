interface ISimRec {
    simId: number,
    simName: string,
    simDate: string,
    categ: string,
    descr: string,
    qty: number,
    price: number,
    dttm: string,
    op?: string,
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
