import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { loadDicom, getImageMetadata } from "./dicomLoader";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

const cornerstone = window.cornerstone;

export default function DicomViewOnly(props) {
  const [loaded, setLoaded] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    var e = document.getElementById("dicomViewImage");
    setElement(e);
    setLoaded(false);
    if (element) {
      cornerstone.enable(element);
      loadDicom(props.img_url, props.img_source, displayImage);
    }
  }, [element,props.img_url]);

  function displayImage(image) {
    var viewport = cornerstone.getDefaultViewportForImage(element, image);
    cornerstone.displayImage(element, image, viewport);
    setLoaded(true);
  }

  return (
    <div className="dicomImage-div" style={{ width: props.width }}>
      {!loaded && (
        <div className="loading-dicom">
          <Spin indicator={LoadingIcon} />
          <br />
          <span style={{ fontSize: "medium" }}>Loading ...</span>
        </div>
      )}
      <div
        id="dicomViewImage"
        className="dicomImage"
        style={{ height: props.height, width: props.width }}
      />
    </div>
  );
}
