import React from "react";
import SelectXRayImage from "../diagnosis/SelectXRayImage";

function Annotate() {
    return(
        <div className="content">
            <SelectXRayImage mode="annotate" />
        </div>
    );
}

export default Annotate;