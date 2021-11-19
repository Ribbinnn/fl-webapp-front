import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Tooltip,
  Slider,
  Switch,
  Input,
  Checkbox,
  Spin,
  Table,
} from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  DragOutlined,
  ColumnHeightOutlined,
  BorderOutlined,
  StarOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getDicomByAccessionNo } from "../../api/image";
import { loadDicom } from "../../component/dicom-viewer/dicomLoader";

const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

export default function AnnotationPanel(props) {
  const [tool, setTool] = useState();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dicomElement, setDicomElement] = useState();
  const [columns, setColumns] = useState([
    {
      title: "Finding",
      dataIndex: "finding",
      key: "finding",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" icon={<DeleteOutlined />} onClick={() => deleteLayer(record.key)}/>
      ),
    },
  ]);
  const [layer, setLayer] = useState([]);
  const [currentLayer, setCurrentLayer] = useState();
  const [viewerState, setViewerState] = useState({
    windowWidth: 0,
    windowLevel: 0,
    zoom: 1,
    invert: false,
    showInfo: true,
  });

  useEffect(() => {
    loadDicom(
      getDicomByAccessionNo(props.accession_no ?? "74"),
      "wado",
      displayImage
    );
    addNewLayer();
  }, []);

  function displayImage(image) {
    // var img_ratio = { height: image.height, width: image.width };
    var element = document.getElementById("annotate-dicom-image");
    /* if (img_ratio.height / img_ratio.width > 640 / 750) {
      element.style.width = `${(img_ratio.width / img_ratio.height) * 640}px`;
    } else if (img_ratio.height / img_ratio.width < 640 / 750) {
      element.style.height = `${(img_ratio.height / img_ratio.width) * 750}px`;
    } */
    cornerstone.enable(element);
    var viewport = cornerstone.getDefaultViewportForImage(element, image);
    console.log(viewport);
    cornerstone.displayImage(element, image, viewport);
    setViewerState({
      ...viewerState,
      windowLevel: viewport.voi.windowCenter,
      windowWidth: viewport.voi.windowWidth,
      defaultWindowLevel: viewport.voi.windowCenter,
      defaultWindowWidth: viewport.voi.windowWidth,
      defaultZoom: viewport.scale,
    });
    cornerstoneTools.mouseInput.enable(element);
    cornerstoneTools.freehand.enable(element);
    cornerstoneTools.length.enable(element);
    cornerstoneTools.rectangleRoi.enable(element);
    cornerstoneTools.pan.enable(element);
    console.log(cornerstoneTools);
    setDicomElement(element);
    setImgLoaded(true);
  }

  function selectTool(prop) {
    deactivateTools();
    cornerstoneTools[prop].activate(dicomElement, 1);
    setTool(prop);
  }

  function deactivateTools() {
    cornerstoneTools.pan.deactivate(dicomElement, 1);
    cornerstoneTools.length.deactivate(dicomElement, 1);
    cornerstoneTools.rectangleRoi.deactivate(dicomElement, 1);
    cornerstoneTools.freehand.deactivate(dicomElement, 1);
  }

  const imageOnClick = () => {
    if (!tool || tool === "pan") return;
    var lengthToolData = cornerstoneTools.getToolState(dicomElement, "length");
    var rectangleRoiToolData = cornerstoneTools.getToolState(
      dicomElement,
      "rectangleRoi"
    );
    var freehandToolData = cornerstoneTools.getToolState(
      dicomElement,
      "freehand"
    );
    let currentToolData = cornerstoneTools.getToolState(dicomElement, tool);
    console.log(tool);
    console.log(lengthToolData);
    console.log(rectangleRoiToolData);
    console.log(freehandToolData);
    console.log(layer);
    if (
      tool !== "length" &&
      lengthToolData &&
      lengthToolData.data.length > 0 &&
      currentToolData
    ) {
      updateLayer(currentLayer, tool, lengthToolData.data[0]);
      addNewLayer();
      cornerstoneTools.removeToolState(
        dicomElement,
        "length",
        lengthToolData.data[0]
      );
      cornerstone.updateImage(dicomElement);
      return;
    }
    if (
      tool !== "rectangleRoi" &&
      rectangleRoiToolData &&
      rectangleRoiToolData.data.length > 0 &&
      currentToolData
    ) {
      updateLayer(currentLayer, tool, rectangleRoiToolData.data[0]);
      addNewLayer();
      cornerstoneTools.removeToolState(
        dicomElement,
        "rectangleRoi",
        rectangleRoiToolData.data[0]
      );
      cornerstone.updateImage(dicomElement);
      return;
    }
    if (
      tool !== "freehand" &&
      freehandToolData &&
      freehandToolData.data.length > 0 &&
      currentToolData
    ) {
      updateLayer(currentLayer, tool, freehandToolData.data[0]);
      addNewLayer();
      cornerstoneTools.removeToolState(
        dicomElement,
        "freehand",
        freehandToolData.data[0]
      );
      cornerstone.updateImage(dicomElement);
      return;
    }
    if (currentToolData && currentToolData.data.length > 1) {
      if (tool === "freehand" && currentToolData.data[1].active) {
        return;
      }

      currentToolData.data[0].visible = true;
      updateLayer(currentLayer, tool, currentToolData.data[0]);
      addNewLayer();
      cornerstoneTools.removeToolState(
        dicomElement,
        tool,
        currentToolData.data[0]
      );

      cornerstone.updateImage(dicomElement);
      return;
    }
    if (
      tool === "freehand" &&
      currentToolData.data.length === 1 &&
      !currentToolData.data[0].active
    ) {
      updateLayer(currentLayer, tool, currentToolData.data[0]);
    }
    if (tool !== "freehand" && currentToolData.data.length === 1) {
      updateLayer(currentLayer, tool, currentToolData.data[0]);
    }
  };

  const onViewerChange = (prop, value) => (e) => {
    let viewport = cornerstone.getViewport(dicomElement);
    console.log(viewport);
    if (prop === "zoomin") {
      if (viewerState.zoom >= 3) return;
      value = viewerState.zoom + 0.25;
      viewport.scale = value * viewerState.defaultZoom;
      cornerstone.setViewport(dicomElement, viewport);
      prop = "zoom";
    }
    if (prop === "zoomout") {
      if (viewerState.zoom <= 0.25) return;
      value = viewerState.zoom - 0.25;
      viewport.scale = value * viewerState.defaultZoom;
      cornerstone.setViewport(dicomElement, viewport);
      prop = "zoom";
    }
    if (prop === "invert") {
      e = e.target.checked;
      viewport.invert = e;
      cornerstone.setViewport(dicomElement, viewport);
    }
    if (prop === "windowWidth" || prop === "windowLevel") {
      if (typeof e !== "number") {
        if (e.target.value === "") e = 0;
        else if (e.target.value) e = parseInt(e.target.value);
        else return;
      }
      viewport.voi[prop === "windowLevel" ? "windowCenter" : prop] = e;
      cornerstone.setViewport(dicomElement, viewport);
    }
    setViewerState({ ...viewerState, [prop]: value || e });
  };

  const onSwitchChange = (checked) => {
    onViewerChange("showInfo", checked);
    console.log(`${checked ? "Show" : "Hide"} Bounding Box Info`);
  };

  const addNewLayer = () => {
    let key = layer.length > 0 ? layer[layer.length-1].key + 1 : 1;
    let timeStamp = new Date();
    let user = JSON.parse(sessionStorage.getItem("user")).id;
    let newLayer = {
      finding: `New Finding ${key}`,
      key: key,
      createdAt: timeStamp,
      createdBy: user,
      updatedAt: timeStamp,
      updatedBy: user,
    };
    setLayer([...layer, newLayer]);
    setCurrentLayer(newLayer.key);
    console.log(newLayer);
  };

  const deleteLayer = key => {
    // let decreased_layer = layer.filter((item) => {
    //     return item.key !== key
    //   });
    // if (decreased_layer.length === 0) {
    //     addNewLayer();
    //     return
    // }
    // if (currentLayer === key) {
    //     layerOnSelect(decreased_layer[0].key);
    // }
    // setLayer(decreased_layer);
  }

  const updateLayer = (key, tool, data) => {
    let updated_layer = layer.map((item) => {
      return item.key === key ? { ...item, data: data, updatedAt: new Date(), tool: tool } : item;
    });
    setLayer(updated_layer);
  };

  const layerOnSelect = key => {
      console.log(layer)
      let selected_layer = layer.filter((item) => {
        return item.key === key
      })[0];
      console.log(selected_layer)
      let current_layer = layer.filter((item) => {
        return item.key === currentLayer
      })[0];
      console.log(current_layer)
      if (!current_layer.data){
        let currentToolData = cornerstoneTools.getToolState(dicomElement, tool);
        updateLayer(currentLayer, tool, currentToolData.data[0]);
        current_layer["tool"] = tool;
        current_layer["data"] = currentToolData.data[0];
      }

      cornerstoneTools.removeToolState(
        dicomElement,
        current_layer.tool,
        current_layer.data
      );
      cornerstoneTools.addToolState(
        dicomElement,
        selected_layer.tool,
        selected_layer.data
      );
      cornerstone.updateImage(dicomElement);
      setCurrentLayer(key)
  }

  return (
    <div>
      <Row>
        <Col
          span={16}
          justify="center"
          align="middle"
          style={{ paddingRight: "18px", height: "640px" }}
        >
          {!imgLoaded && (
            <div className="loading-dicom" style={{ textAlign: "center" }}>
              <Spin indicator={LoadingIcon} />
              <br />
              <br />
              <span style={{ fontSize: "medium" }}>Loading ...</span>
            </div>
          )}
          <div
            id="annotate-dicom-image"
            className="dicomImage"
            onClick={imageOnClick}
            style={{ display: "relative", width: "750px", height: "640px" }}
          />
        </Col>
        <Col span={8}>
          <Col>
            <Row>
              <label className="annotate-tool-label"> Window Level </label>
            </Row>
            <Row>
              <Col span={20}>
                <Slider
                  min={
                    viewerState.defaultWindowLevel > 2000
                      ? viewerState.defaultWindowLevel - 2000
                      : 0
                  }
                  max={viewerState.defaultWindowLevel + 2000}
                  onChange={onViewerChange("windowLevel")}
                  value={viewerState.windowLevel}
                />
              </Col>
              <Col span={4}>
                <Input
                  className="input-text smaller"
                  style={{ height: "30px" }}
                  value={viewerState.windowLevel}
                  onChange={onViewerChange("windowLevel")}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <label className="annotate-tool-label"> Window Width </label>
            </Row>
            <Row>
              <Col span={20}>
                <Slider
                  min={
                    viewerState.defaultWindowWidth > 2000
                      ? viewerState.defaultWindowWidth - 2000
                      : 0
                  }
                  max={viewerState.defaultWindowWidth + 2000}
                  onChange={onViewerChange("windowWidth")}
                  value={viewerState.windowWidth}
                />
              </Col>
              <Col span={4}>
                <Input
                  className="input-text smaller"
                  style={{ height: "30px" }}
                  onChange={onViewerChange("windowWidth")}
                  value={viewerState.windowWidth}
                />
              </Col>
            </Row>
          </Col>
          <Row
            align="middle"
            justify="space-between"
            style={{ marginTop: "10px" }}
          >
            <Col span={6} justify="center" align="start">
              <Checkbox onChange={onViewerChange("invert")}>Invert</Checkbox>
            </Col>
            <Col span={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <label
                  className="annotate-tool-label"
                  style={{ marginRight: "5px" }}
                >
                  Zoom
                </label>

                <Button
                  className="zoom-btn"
                  icon={<ZoomOutOutlined />}
                  onClick={onViewerChange("zoomout")}
                />

                <Input
                  className="input-text smaller"
                  style={{ height: "30px", width: "70px" }}
                  value={`${viewerState.zoom * 100}%`}
                />

                <Button
                  className="zoom-btn"
                  icon={<ZoomInOutlined />}
                  onClick={onViewerChange("zoomin")}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: "15px", marginBottom: "15px" }}>
            <Col span={12} className="annotate-tool-btn-ctn">
              <Button
                className={`annotate-tool-btn ${
                  tool === "pan" ? "selected-tool" : ""
                }`}
                onClick={() => {
                  selectTool("pan");
                }}
              >
                Pan {<DragOutlined />}
              </Button>
            </Col>
            <Col span={12} className="annotate-tool-btn-ctn">
              <Button
                className={`annotate-tool-btn ${
                  tool === "length" ? "selected-tool" : ""
                }`}
                onClick={() => {
                  selectTool("length");
                }}
              >
                Ruler {<ColumnHeightOutlined />}
              </Button>
            </Col>
            <Col span={12} className="annotate-tool-btn-ctn">
              <Button
                className={`annotate-tool-btn ${
                  tool === "rectangleRoi" ? "selected-tool" : ""
                }`}
                onClick={() => {
                  selectTool("rectangleRoi");
                }}
              >
                Rectangle {<BorderOutlined />}
              </Button>
            </Col>
            <Col span={12} className="annotate-tool-btn-ctn">
              <Button
                className={`annotate-tool-btn ${
                  tool === "freehand" ? "selected-tool" : ""
                }`}
                onClick={() => {
                  selectTool("freehand");
                }}
              >
                Polygon {<StarOutlined />}
              </Button>
            </Col>
          </Row>
          <Row justify="start" align="middle">
            <Switch defaultChecked={false} onChange={onSwitchChange} />
            <label
              className="annotate-tool-label"
              style={{ marginLeft: "5px" }}
            >
              Bounding Box Info
            </label>
          </Row>
          <Row>
            <Col span={24} align="start" style={{ marginTop: "10px" }}>
              <label
                className="annotate-tool-label"
                style={{ marginLeft: "5px" }}
              >
                Bounding Boxes
              </label>
              {/* <Button
                className="add-layer-btn"
                icon={<PlusCircleOutlined />}
                onClick={addNewLayer}
              /> */}
            </Col>
            <Table
              className="annotate-table clickable-table"
              rowClassName={(record, index) =>
                record.key === currentLayer ? "selected-layer" : ""
              }
              columns={columns}
              dataSource={layer}
              showHeader={false}
              pagination={false}
              size="small"
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    layerOnSelect(record.key)
                    //setCurrentLayer(record.key);
                  }, // click row
                };
              }}
            />
          </Row>
          <Row justify="end" style={{ marginTop: "25px" }}>
            {false && (
              <Button className="primary-btn smaller" onClick={() => {}}>
                Close
              </Button>
            )}

            {true && (
              <Button
                className="primary-btn smaller"
                style={{ marginRight: "10px" }}
                onClick={() => {}}
              >
                Cancel
              </Button>
            )}
            {true && (
              <Button className="primary-btn smaller" onClick={() => {}}>
                Save
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
