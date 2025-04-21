import React, {useCallback, useMemo, useState} from "react";
import type {ColDef} from 'ag-grid-community'; 
import {AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import {AgGridReact} from 'ag-grid-react';

ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
    button: any
}

const GridExample = () => {
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);

    const [rowData, setRowData] = useState([
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
        { make: "Mercedes", model: "EQA", price: 48890, electric: true },
        { make: "Fiat", model: "500", price: 15774, electric: false },
        { make: "Nissan", model: "Juke", price: 20675, electric: false },
        ]);

    const CustomButtonComponent = (props:any) => {
            return <button onClick={() => window.alert('clicked') }>Push Me!</button>;
     };
         
     const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { headerName: "Make & Model", valueGetter: p => p.data.make + ' ' + p.data.model},
        { field: "make" },
        { field: "model" },
        { field: "price", editable: true, valueFormatter: p => '£' + p.value.toLocaleString() },
        { field: "electric" },
        { field: "button", cellRenderer: CustomButtonComponent }
      ]);

    const defaultColDef: ColDef = {
        flex: 1,
    };

    let newCount = 1;

    const createNewRowData = () => {
        const newData = {
            make: "Toyota " + newCount,
            model: "Celica " + newCount,
            price: 35000 + newCount * 17,
            electric: false,
        };
        newCount++;
        return newData;
    }
    
    const addItems = useCallback((addIndex: number | undefined) => {
        const newItems = [
          createNewRowData(),
          createNewRowData(),
          createNewRowData(),
        ];
        //const res = gridRef.current!.api.applyTransaction({
        //  add: newItems,
        //  addIndex: addIndex,
        //})!;
        //printResult(res);
      }, []);
 
      return (
        <div style={containerStyle}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "4px" }}>
              <button onClick={() => addItems(undefined)}>Add Items</button>
            </div>
            <div style={{ flexGrow: "1" }}>
              <div style={{ height: 300 }}>
                <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef}
                />
              </div>
            </div>
          </div>
        </div>
      );
}

export default GridExample; 
