
import React from 'react'

export const DataGridLayout = (props) => {
    return (
        <div style={{ height: 500, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%', width:"100%", justifyContent:"center" }}>
                <div style={{ flexGrow: 1 }}>
                {props.children}
                </div>
            </div>
    </div>
    )
}