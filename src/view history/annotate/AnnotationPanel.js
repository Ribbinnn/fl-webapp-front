import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Slider,
  Switch,
  Input,
  Checkbox,
  Spin,
  Table,
  Modal,
  Popconfirm
} from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  DragOutlined,
  ColumnHeightOutlined,
  BorderOutlined,
  StarOutlined,
  LoadingOutlined,
  RedoOutlined,
  SelectOutlined,
  DeleteOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import { getDicomByAccessionNo } from "../../api/image";
import { loadDicom } from "../../component/dicom-viewer/dicomLoader";
import Label from "./Label";

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
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" icon={<DeleteOutlined />} />
      ),
    },
  ]);
  const [labels, setLabels] = useState([]);
  const [labelList,setLabelList] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState();
  const [labelBuffer, setLabelBuffer] = useState();
  const [viewerState, setViewerState] = useState({
    windowWidth: 0,
    windowLevel: 0,
    zoom: 1,
    invert: false,
    showInfo: true,
    defaultWindowWidth: 0,
    defaultWindowLevel: 0,
  });

  useEffect(() => {
    loadDicom(
      getDicomByAccessionNo(props.accession_no ?? "74"),
      "wado",
      displayImage
    );
    //cornerstoneTools.toolColors.setToolColor('#4ad578');
    // Set color for active tools
    //cornerstoneTools.toolColors.setActiveColor('#58595b');
  }, []);

  useEffect(() => {
    console.log(labels)
    setColumns([
      {
        title: "Label",
        dataIndex: "label",
        key: "label",
        render: (text, record) => (
          <span className="label-tag">
          {record.tool === "length" && <ColumnHeightOutlined/> ||
          record.tool === "rectangleRoi" && <BorderOutlined/> ||
          record.tool === "freehand" && <StarOutlined/>}{record.label}
          </span>
        )
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Popconfirm
                  title="Delete this label?"
                  onConfirm={() => {
                    let update = labels;
                    let ind = update.findIndex((item) => item.key === record.key);
                    let target = cornerstoneTools.getToolState(
                      dicomElement,
                      record.tool
                    ).data[record.index];
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      record.tool,
                      target
                    );
                    cornerstone.updateImage(dicomElement);
                    update.splice(ind, 1);
                    update = update.reduce((current, item) => {
                      if (item.tool === record.tool && item.index > record.index) {
                        return [...current, {...item, index: item.index - 1}];
                      }
                      return [...current,item];
                    }, []);
                    setLabels(update);
                  }}
                  okButtonProps={{ className: "primary-btn popconfirm" }}
                  cancelButtonProps={{ style: { display: "none" } }}
                >
          <Button
            type="link"
            icon={<DeleteOutlined />}
          />
          </Popconfirm>
        ),
      },
    ]);
  }, [labels]);

  useEffect(() => {
    if (labelBuffer) {
      let newLabel = {
        ...labelBuffer,
        label: selectedLabel,
      };
      setLabels([...labels, newLabel]);
      setLabelBuffer();
      setSelectedLabel();
    }
  }, [labelBuffer]);

  function displayImage(image) {
    var element = document.getElementById("annotate-dicom-image");
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
    cornerstoneTools.mouseWheelInput.enable(element);
    // // Enable all tools we want to use with this element
    cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
    cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
    cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
    cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
    cornerstoneTools.freehand.enable(element);
    cornerstoneTools.length.enable(element);
    cornerstoneTools.rectangleRoi.enable(element);
    cornerstoneTools.pan.enable(element);

    setTool("mouse");
    setDicomElement(element);
    element.addEventListener("cornerstoneimagerendered", (e) => {console.log("here")});
    setImgLoaded(true);
  }

  function selectTool(prop) {
    /**
     * check if current is ratio and not complete yet -> remove
     */
    deactivateTools();
    setTool(prop);
    if (prop === "mouse") prop = "wwwc";
    else if (prop === "ratio") {
    }
    cornerstoneTools[prop].activate(dicomElement, 1);
  }

  function deactivateTools() {
    cornerstoneTools.wwwc.disable(dicomElement);
    cornerstoneTools.pan.activate(dicomElement, 2); // 2 is middle mouse button
    cornerstoneTools.zoom.activate(dicomElement, 4); // 4 is right mouse button
    cornerstoneTools.length.deactivate(dicomElement, 1);
    cornerstoneTools.rectangleRoi.deactivate(dicomElement, 1);
    cornerstoneTools.freehand.deactivate(dicomElement, 1);
  }

  //onclose
  const removeAnnotations = () => {
    var toolStateManager =
    cornerstoneTools.getElementToolStateManager(dicomElement);
    toolStateManager.clear(dicomElement);
    cornerstone.updateImage(dicomElement);
  };

  const resetViewPort = () => {
    let viewport = cornerstone.getViewport(dicomElement);
    viewport.invert = false;
    viewport.voi["windowCenter"] = viewerState.defaultWindowLevel;
    viewport.voi["windowWidth"] = viewerState.defaultWindowWidth;
    viewport.scale = viewerState.defaultZoom;
    viewport.translation = { x: 0, y: 0 };
    cornerstone.setViewport(dicomElement, viewport);
    setViewerState({
      ...viewerState,
      windowLevel: viewerState.defaultWindowLevel,
      windowWidth: viewerState.defaultWindowWidth,
      zoom: 1,
      invert: false,
    });
  };

  const imageOnClick = () => {
    console.log(labels)
    console.log(cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState())

    if (tool === "ratio") {
      return;
    }
    if (tool === "pan") {
      return;
    }
    if (tool === "mouse") {
      let viewport = cornerstone.getViewport(dicomElement);
      setViewerState({
        ...viewerState,
        windowLevel: viewport.voi["windowCenter"],
        windowWidth: viewport.voi["windowWidth"],
      });
      return;
    }
    let count = labels.reduce(
      (counter, item) => {
        counter[item.tool] = counter[item.tool] + 1;
        return counter;
      },
      { rectangleRoi: 0, length: 0, freehand: 0 }
    );
    let toolState = cornerstoneTools.getToolState(dicomElement, tool);
    console.log(toolState);
    if (toolState.data && toolState.data.length > count[tool]) {
      if (
        toolState.data[toolState.data.length - 1].active
      ) {
        return;
      }
      addNewLabel(tool, toolState.data.length - 1);
    }
  };

  const imageOnScroll = () => {
    console.log("zoom change")
  }

  const imageOnMoseDown = () => {
    console.log("wwwc change")
  }

  const onViewerChange = (prop, value) => (e) => {
    let viewport = cornerstone.getViewport(dicomElement);
    console.log(viewport);
    if (prop === "zoomin") {
      if (viewerState.zoom >= 30) return;
      value = viewport.scale/viewerState.defaultZoom + 0.25;
      viewport.scale = value * viewerState.defaultZoom;
      cornerstone.setViewport(dicomElement, viewport);
      prop = "zoom";
    }
    if (prop === "zoomout") {
      if (viewerState.zoom <= 0.25) return;
      value = viewport.scale/viewerState.defaultZoom - 0.25;
      viewport.scale = value * viewerState.defaultZoom;
      cornerstone.setViewport(dicomElement, viewport);
      prop = "zoom";
    }
    if (prop === "invert") {
      e = e.target.checked;
      console.log(e);
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

  const addNewLabel = (tool, index) => {
    let key = labels.length > 0 ? labels[labels.length - 1].key + 1 : 1;
    let timeStamp = new Date();
    let user = JSON.parse(sessionStorage.getItem("user")).id;
    Modal.info({
      title: "Choose label",
      content: <Label setSelectedLabel={setSelectedLabel} labelList={labelList} setLabelList={setLabelList} />,
      keyboard: false,
      className: "label-selector-modal",
      okText: "Submit",
      onOk: () => {
        setLabelBuffer({
          key: key,
          tool: tool,
          index: index,
          createdAt: timeStamp,
          createdBy: user,
          updatedAt: timeStamp,
          updatedBy: user,
        });
      },
      okButtonProps: {
        style: {
          boxShadow: "none",
          backgroundColor: "#de5c8e",
        },
      },
    });
  };

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
            onScroll={imageOnScroll}
            onMouseDown={imageOnMoseDown}
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
            <Col span={4} justify="center" align="start">
              <Checkbox
                onChange={onViewerChange("invert")}
                checked={viewerState.invert}
              >
                Invert
              </Checkbox>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
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
                  style={{marginRight: "2px"}}
                  onClick={onViewerChange("zoomout")}
                />

                {/* <Input
                  className="input-text smaller"
                  style={{ height: "30px", width: "70px" }}
                  value={`${viewerState.zoom * 100}%`}
                /> */}

                <Button
                  className="zoom-btn"
                  icon={<ZoomInOutlined />}
                  onClick={onViewerChange("zoomin")}
                />
              </div>
            </Col>
            <Col span={10}>
            <Button className="reset-vp-btn" onClick={resetViewPort}>
              Reset Viewport
              <RedoOutlined />
            </Button>
            </Col>
          </Row>
          {/* <Row align="end" style={{ marginTop: "5px" }}>
            <Button className="reset-vp-btn" onClick={resetViewPort}>
              Reset Viewport
              <RedoOutlined />
            </Button>
          </Row> */}
          <Row style={{ marginTop: "5px", marginBottom: "15px" }}>
            <Col span={8} className="annotate-tool-btn-ctn">
              <Button
                className={`annotate-tool-btn ${
                  tool === "mouse" ? "selected-tool" : ""
                }`}
                onClick={() => {
                  selectTool("mouse");
                }}
              >
                Mouse {<SelectOutlined />}
              </Button>
            </Col>
            <Col span={8} className="annotate-tool-btn-ctn">
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
            <Col span={8} className="annotate-tool-btn-ctn">
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
            <Col span={8} className="annotate-tool-btn-ctn">
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
            <Col span={8} className="annotate-tool-btn-ctn">
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
            <Col span={8} className="annotate-tool-btn-ctn">
              <Button
                className={`annotate-tool-btn ${
                  tool === "ratio" ? "selected-tool" : ""
                }`}
                style={{visibility: "hidden"}}
                onClick={() => {
                  // selectTool("freehand");
                }}
              >
                Ratio {<VerticalAlignBottomOutlined />}
              </Button>
            </Col>
          </Row>
          {/* <Row justify="start" align="middle">
            <Switch defaultChecked={false} onChange={onSwitchChange} />
            <label
              className="annotate-tool-label"
              style={{ marginLeft: "5px" }}
            >
              Bounding Box Info
            </label>
          </Row> */}
          <Row>
            <Col span={24} align="start" style={{ marginTop: "10px" }}>
              <label
                className="annotate-tool-label"
                style={{ marginLeft: "5px" }}
              >
                Bounding Boxes
              </label>
              {/* <Button
                className="reset-vp-btn"
                icon={<PlusCircleOutlined />}
                onClick={addNewLabels}
              /> */}
            </Col>
            <Table
              className="annotate-table clickable-table"
              rowClassName={(record, index) =>
                /* record.key === currentLabels ? "selected-labels" :  */ ""
              }
              columns={columns}
              dataSource={labels}
              showHeader={false}
              pagination={false}
              size="small"
              // onRow={(record, rowIndex) => {
              //   return {
              //     onClick: (event) => {
              //       // labelsOnSelect(record.key);
              //       //setCurrentLabels(record.key);
              //     }, // click row
              //   };
              // }}
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
/**
 * {
    "rectangleRoi": {
        "data": [
            {
                "visible": true,
                "active": false,
                "handles": {
                    "start": {
                        "x": 469.9,
                        "y": 395.24999999999994,
                        "highlight": true,
                        "active": false
                    },
                    "end": {
                        "x": 1144.1499999999996,
                        "y": 943.9499999999999,
                        "highlight": true,
                        "active": false
                    }
                },
                "invalidated": true
            },
            {
                "visible": true,
                "active": false,
                "handles": {
                    "start": {
                        "x": 1683.5499999999997,
                        "y": 246.44999999999996,
                        "highlight": true,
                        "active": false
                    },
                    "end": {
                        "x": 2027.6499999999996,
                        "y": 655.65,
                        "highlight": true,
                        "active": false
                    }
                },
                "invalidated": true
            }
        ]
    },
    "freehand": {
        "data": [
            {
                "visible": true,
                "active": false,
                "handles": [
                    {
                        "x": 2185.7499999999995,
                        "y": 1641.4499999999998,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 1404.5499999999997,
                                "y": 1464.7499999999998
                            }
                        ]
                    },
                    {
                        "x": 1404.5499999999997,
                        "y": 1464.7499999999998,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 1567.2999999999997,
                                "y": 1697.2499999999998
                            }
                        ]
                    },
                    {
                        "x": 1567.2999999999997,
                        "y": 1697.2499999999998,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 2185.7499999999995,
                                "y": 1641.4499999999998,
                                "highlight": true,
                                "active": true,
                                "lines": [
                                    {
                                        "x": 1404.5499999999997,
                                        "y": 1464.7499999999998
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "highlight": false
            },
            {
                "visible": true,
                "active": false,
                "handles": [
                    {
                        "x": 311.80000000000007,
                        "y": 1125.3,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 395.5,
                                "y": 1329.8999999999999
                            }
                        ]
                    },
                    {
                        "x": 395.5,
                        "y": 1329.8999999999999,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 702.4,
                                "y": 1241.55
                            }
                        ]
                    },
                    {
                        "x": 702.4,
                        "y": 1241.55,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 311.80000000000007,
                                "y": 1125.3,
                                "highlight": true,
                                "active": true,
                                "lines": [
                                    {
                                        "x": 395.5,
                                        "y": 1329.8999999999999
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "highlight": false
            },
            {
                "visible": true,
                "active": false,
                "handles": [
                    {
                        "x": 2372,
                        "y": 1222.9499999999998,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 2176.45,
                                "y": 1432.1999999999998
                            }
                        ]
                    },
                    {
                        "x": 2176.45,
                        "y": 1432.1999999999998,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 2278.7499999999995,
                                "y": 1329.8999999999999
                            }
                        ]
                    },
                    {
                        "x": 2278.7499999999995,
                        "y": 1329.8999999999999,
                        "highlight": true,
                        "active": true,
                        "lines": [
                            {
                                "x": 2372,
                                "y": 1222.9499999999998,
                                "highlight": true,
                                "active": true,
                                "lines": [
                                    {
                                        "x": 2176.45,
                                        "y": 1432.1999999999998
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "highlight": false
            }
        ]
    },
    "length": {
        "data": [
            {
                "visible": true,
                "active": false,
                "handles": {
                    "start": {
                        "x": 1795.15,
                        "y": 1241.5499999999997,
                        "highlight": true,
                        "active": false
                    },
                    "end": {
                        "x": 2190.3999999999996,
                        "y": 1050.8999999999996,
                        "highlight": true,
                        "active": false
                    },
                    "textBox": {
                        "active": false,
                        "hasMoved": false,
                        "movesIndependently": false,
                        "drawnIndependently": true,
                        "allowedOutsideImage": true,
                        "hasBoundingBox": true,
                        "x": 2190.3999999999996,
                        "y": 1050.8999999999996,
                        "boundingBox": {
                            "width": 76.6943359375,
                            "height": 25,
                            "left": 601,
                            "top": 213.49999999999991
                        }
                    }
                },
                "length": 63.75946177460234,
                "invalidated": true
            },
            {
                "visible": true,
                "active": false,
                "handles": {
                    "start": {
                        "x": 711.6999999999999,
                        "y": 1232.2499999999998,
                        "highlight": true,
                        "active": false
                    },
                    "end": {
                        "x": 962.7999999999998,
                        "y": 1167.1499999999999,
                        "highlight": true,
                        "active": false
                    },
                    "textBox": {
                        "active": false,
                        "hasMoved": false,
                        "movesIndependently": false,
                        "drawnIndependently": true,
                        "allowedOutsideImage": true,
                        "hasBoundingBox": true,
                        "x": 962.7999999999998,
                        "y": 1167.1499999999999,
                        "boundingBox": {
                            "width": 76.6943359375,
                            "height": 25,
                            "left": 337,
                            "top": 238.49999999999997
                        }
                    }
                },
                "length": 37.68973562247797,
                "invalidated": true
            },
            {
                "visible": true,
                "active": false,
                "handles": {
                    "start": {
                        "x": 730.3000000000001,
                        "y": 1106.6999999999998,
                        "highlight": true,
                        "active": false
                    },
                    "end": {
                        "x": 1093,
                        "y": 1381.0499999999997,
                        "highlight": true,
                        "active": false
                    },
                    "textBox": {
                        "active": false,
                        "hasMoved": false,
                        "movesIndependently": false,
                        "drawnIndependently": true,
                        "allowedOutsideImage": true,
                        "hasBoundingBox": true,
                        "x": 1093,
                        "y": 1381.0499999999997,
                        "boundingBox": {
                            "width": 76.6943359375,
                            "height": 25,
                            "left": 365,
                            "top": 284.49999999999994
                        }
                    }
                },
                "length": 66.07631031494076,
                "invalidated": true
            }
        ]
    }
}
 */
