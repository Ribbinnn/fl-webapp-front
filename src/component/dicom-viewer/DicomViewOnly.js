import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { loadDicom } from "./dicomLoader";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

const cornerstone = window.cornerstone;

export default function DicomViewOnly(props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadDicom(props.img_url, props.img_source, displayImage);
  }, [props.img_url]);

  function displayImage(image) {
    var img_ratio = { height: image.height, width: image.width };
    var element = document.getElementById("dicomViewImage");
    if (img_ratio.height > img_ratio.width) {
      element.style.width = `${(img_ratio.width / img_ratio.height) * props.size}px`;
      element.style.height = `${props.size}px`;
    } else if (img_ratio.height < img_ratio.width) {
      element.style.height = `${(img_ratio.height / img_ratio.width) * props.size}px`;
      element.style.width = `${props.size}px`;
    } else {
      element.style.height = `${props.size}px`;
      element.style.width = `${props.size}px`;
    }
    cornerstone.enable(element);
    var viewport = cornerstone.getDefaultViewportForImage(element, image);
    cornerstone.displayImage(element, image, viewport);
    setLoaded(true);
  }

  return (
    <div
      className="dicomImage-div"
      style={{ height: `${props.size}px`, width: `${props.size}px` }}
    >
      {!loaded && (
        <div className="loading-dicom" style={{ textAlign: "center" }}>
          <Spin indicator={LoadingIcon} />
          <br />
          <br />
          <span style={{ fontSize: "medium" }}>Loading ...</span>
        </div>
      )}
      <div
        id="dicomViewImage"
        className="dicomImage"
        style={{ display: "relative" }}
      />
    </div>
  );
}
