import React from 'react'
import { Importer, ImporterField } from 'react-csv-importer';

import 'react-csv-importer/dist/index.css';

import '../assets/css/Imports.css'

export default function ImportPage() {

    return (
        <div className='imports'>
            <h1>
                hello from Import Page.
            </h1>
            <Importer
                dataHandler={async (rows) => {
                    const updatedData = [...rows];
                    localStorage.setItem('importedRows', JSON.stringify(updatedData));
                    for (const row of rows) {
                        console.log('Row Data:', row);
                    }
                }}
                onComplete={() => {
                    console.log('CSV Import Completed!');
                }}
                onClose={() => {
                    console.log('Importer Closed');
                }}
            >
                <ImporterField name="DataTime" label="DataTime" />
                <ImporterField name="longitude" label="Longitude" />
                <ImporterField name="latitude" label="Latitude" />
                <ImporterField name="altitude" label="Altitude" />
            </Importer>

            <button className="analysis-button">Ready For Analysis</button>

        </div>
    )
}
