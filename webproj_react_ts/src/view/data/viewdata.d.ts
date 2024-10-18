interface ISimRec {
    simId: number,
    simName: string,
    simDate: string,
    caterory: string,
    desc: string,
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
    caterory: IColumnInfo,
    desc: IColumnInfo,
    qty: IColumnInfo,
    price: IColumnInfo,
    dttm: IColumnInfo
}
