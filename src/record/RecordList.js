import React from "react";

function RecordList(props) {
    return(
        <div>
            <label style={{color: "#de5c8e"}}>
                Record Name: {props.record.rec_name}
            </label>
        </div>
    );
}

export default RecordList;