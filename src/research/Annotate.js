import React, { useState } from "react";
import SelectXRayImage from "../diagnosis/SelectXRayImage";

function Annotate() {
    const [loading, setLoading] = useState(false);
    return(
        <div className={loading ? "content loading" : "content"}>
            <SelectXRayImage mode="annotate" setLoading={setLoading} />
        </div>
    );
}

export default Annotate;