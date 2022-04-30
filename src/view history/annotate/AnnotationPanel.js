import React, { useState, useEffect } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Button,
  Row,
  Col,
  Slider,
  message,
  Input,
  Checkbox,
  Spin,
  Table,
  Modal,
  Popconfirm,
  Popover,
  Collapse,
  Image,
  Select,
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
  ExclamationCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
  ExclamationOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getDicomByAccessionNo } from "../../api/image";
import { loadDicom } from "../../component/dicom-viewer/dicomLoader";
import Label from "./Label";
import { insertBBox, getBBox } from "../../api/masks";
import { getGradCam } from "../../api/image";

const cornerstone = window.cornerstone;
const cornerstoneTools = window.cornerstoneTools;

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

const { Panel } = Collapse;
const { Option } = Select;

export default function AnnotationPanel(props) {
  const [tool, setTool] = useState();
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dicomElement, setDicomElement] = useState();
  const [columns, setColumns] = useState();
  const { mode, rid } = useParams();
  const [labels, setLabels] = useState([]);
  //const [labelList, setLabelList] = useState([]);
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
  const [savedTime, setSavedTime] = useState();
  const [gradCam, setGradCam] = useState({
    selected:
      props.gradCamList.filter((item) => {
        return item.isPositive;
      })[0]?.finding || null,
    onlyPositive: true,
  });
  const [savedData, setSavedData] = useState();
  // const [btnMode, setBtnMode] = useState("close");

  useEffect(() => {
    try {
      loadDicom(
        getDicomByAccessionNo(props.accession_no),
        "wado",
        displayImage
      );
    } catch (e) {
      Modal.error({ content: "Error on loading image." });
      props.handleCancel();
    }
    getBBox(rid).then((res) => {
      // console.log(res);
      if (res.data) {
        setUser({ ...user, ...res.data.user });
        setSavedData(
          res.data.data.map((item, i) => {
            if (item.tool === "ratio")
              return { key: i + 1, data: [item.data[0], item.data[1]] };
            return { key: i + 1, data: item.data };
          })
        );
      }
    });
    //cornerstoneTools.toolColors.setToolColor('#4ad578');
    // Set color for active tools
    //cornerstoneTools.toolColors.setActiveColor('#58595b');
  }, []);

  useEffect(() => {
    // console.log(labels);
    setColumns([
      {
        title: "Label",
        dataIndex: "label",
        key: "label",
        render: (text, record) => (
          <span
            className="label-tag"
            style={record.saved ? {} : { color: "#de5c8e" }}
          >
            {(record.tool === "length" && <ColumnHeightOutlined />) ||
              (record.tool === "rectangleRoi" && <BorderOutlined />) ||
              (record.tool === "freehand" && <StarOutlined />) ||
              (record.tool === "ratio" && <VerticalAlignBottomOutlined />)||
              (record.tool === "arrowAnnotate" && <ArrowLeftOutlined />)}
            {record.label}
            {record.tool === "ratio" && ` (${record.ratio})`}
            {record.updated_by.username !== user.username && (
              <ExclamationOutlined
                style={{ color: "#de5c8e", strokeWidth: 30, stroke: "#de5c8e" }}
              />
            )}
          </span>
        ),
      },
      {
        title: "Editor",
        key: "editor",
        render: (text, record) => (
          <span style={record.saved ? {} : { color: "#de5c8e" }}>
            {record.updated_by.first_name[0] ?? "-"}
            {record.updated_by.last_name[0] ?? "-"}
          </span>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span style={{ textAlign: "right" }}>
            <Button
              type="link"
              icon={
                record.invisible ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              onClick={() => {
                let update = labels;
                let target = cornerstoneTools.getToolState(
                  dicomElement,
                  record.tool === "ratio" ? "length" : record.tool
                ).data;
                if (!record.invisible) {
                  if (record.tool === "ratio") {
                    const first_line = target[record.index[0]];
                    const second_line = target[record.index[1]];
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      "length",
                      second_line
                    );
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      "length",
                      first_line
                    );

                    update = update.reduce((current, item) => {
                      if (item.invisible) return [...current, item];
                      if (
                        item.tool === "length" &&
                        item.index > record.index[1]
                      ) {
                        return [...current, { ...item, index: item.index - 2 }];
                      }
                      if (
                        item.tool === "ratio" &&
                        item.index[0] > record.index[0]
                      ) {
                        return [
                          ...current,
                          {
                            ...item,
                            index: [item.index[0] - 2, item.index[1] - 2],
                          },
                        ];
                      }
                      if (
                        item.tool === "ratio" &&
                        item.index[0] === record.index[0]
                      ) {
                        return [
                          ...current,
                          {
                            ...item,
                            index: -1,
                            invisible: [first_line, second_line],
                          },
                        ];
                      }
                      return [...current, item];
                    }, []);
                  } else {
                    const bbox = target[record.index];
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      record.tool,
                      bbox
                    );
                    update = update.reduce((current, item) => {
                      if (item.invisible) return [...current, item];
                      if (
                        record.tool === "length" &&
                        item.tool === "ratio" &&
                        item.index[0] > record.index
                      ) {
                        return [
                          ...current,
                          {
                            ...item,
                            index: [item.index[0] - 1, item.index[1] - 1],
                          },
                        ];
                      }
                      if (
                        item.tool === record.tool &&
                        item.index > record.index
                      ) {
                        return [...current, { ...item, index: item.index - 1 }];
                      }
                      if (
                        item.tool === record.tool &&
                        item.index === record.index
                      ) {
                        return [
                          ...current,
                          { ...item, index: -1, invisible: bbox },
                        ];
                      }
                      return [...current, item];
                    }, []);
                  }
                } else {
                  if (record.tool === "ratio") {
                    cornerstoneTools.addToolState(
                      dicomElement,
                      "length",
                      record.invisible[0]
                    );
                    cornerstoneTools.addToolState(
                      dicomElement,
                      "length",
                      record.invisible[1]
                    );
                    update = update.reduce((current, item) => {
                      if (item.key === record.key) {
                        return [
                          ...current,
                          {
                            ...item,
                            index: [target.length - 2, target.length - 1],
                            invisible: false,
                          },
                        ];
                      }
                      return [...current, item];
                    }, []);
                  } else {
                    cornerstoneTools.addToolState(
                      dicomElement,
                      record.tool,
                      record.invisible
                    );
                    update = update.reduce((current, item) => {
                      if (item.key === record.key) {
                        return [
                          ...current,
                          {
                            ...item,
                            index: target.length - 1,
                            invisible: false,
                          },
                        ];
                      }
                      return [...current, item];
                    }, []);
                  }
                }
                cornerstone.updateImage(dicomElement);
                setLabels(update);
              }}
            />
            <Popover
              className="bbox-popover"
              placement="top"
              content={
                <span>
                  <p style={{ marginBottom: 0, color: "#58595b" }}>
                    Last modified:{" "}
                    {new Date(record.updated_time).toLocaleString()}
                  </p>
                  <p style={{ marginBottom: 0, color: "#58595b" }}>
                    by:{" "}
                    {`${record.updated_by.username} (${record.updated_by.first_name} ${record.updated_by.last_name})`}
                  </p>
                </span>
              }
              trigger="click"
            >
              <Button type="link" icon={<InfoCircleOutlined />} />
            </Popover>
            {props.mode === "editable" && (
              <Button
                type="link"
                icon={<EditOutlined />}
                disabled={record.invisible}
                onClick={() => {
                  Modal.confirm({
                    title: "Choose label",
                    content: (
                      <Label
                        setSelectedLabel={setSelectedLabel}
                        labelList={props.labelList}
                        // setLabelList={setLabelList}
                        defaultLabel={record.label}
                      />
                    ),
                    keyboard: false,
                    className: "label-selector-modal",
                    okText: "Submit",
                    cancelText: "Cancel",
                    onCancel: () => setSelectedLabel(),
                    onOk: () => {
                      setLabelBuffer({
                        key: record.key,
                      });
                      // props.setBtnMode("save-cancel");
                    },
                    okButtonProps: {
                      style: {
                        boxShadow: "none",
                        backgroundColor: "#de5c8e",
                      },
                      id: "select-label-ok-button",
                    },
                    cancelButtonProps: {
                      id: "select-label-cancel-button",
                    },
                  });
                }}
              />
            )}
            {props.mode === "editable" && (
              <Popconfirm
                title="Delete this label?"
                onConfirm={() => {
                  let update = labels;
                  let ind = update.findIndex((item) => item.key === record.key);
                  let target = cornerstoneTools.getToolState(
                    dicomElement,
                    record.tool === "ratio" ? "length" : record.tool
                  ).data;
                  if (record.tool === "ratio") {
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      "length",
                      target[record.index[1]]
                    );
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      "length",
                      target[record.index[0]]
                    );
                  } else {
                    cornerstoneTools.removeToolState(
                      dicomElement,
                      record.tool,
                      target[record.index]
                    );
                  }
                  cornerstone.updateImage(dicomElement);
                  update.splice(ind, 1);
                  update = update.reduce((current, item) => {
                    if (
                      record.tool === "ratio" &&
                      item.tool === "ratio" &&
                      record.index[0] < item.index[0]
                    ) {
                      return [
                        ...current,
                        {
                          ...item,
                          index: [item.index[0] - 2, item.index[1] - 2],
                        },
                      ];
                    }
                    if (
                      record.tool === "ratio" &&
                      item.tool === "length" &&
                      record.index[0] < item.index
                    ) {
                      return [...current, { ...item, index: item.index - 2 }];
                    }
                    if (
                      record.tool === "length" &&
                      item.tool === "ratio" &&
                      record.index < item.index[0]
                    ) {
                      return [
                        ...current,
                        {
                          ...item,
                          index: [item.index[0] - 1, item.index[1] - 1],
                        },
                      ];
                    }
                    if (
                      item.tool === record.tool &&
                      item.index > record.index
                    ) {
                      return [...current, { ...item, index: item.index - 1 }];
                    }
                    return [...current, item];
                  }, []);
                  setLabels(update);
                  // if (props.btnMode === "close")
                  props.setBtnMode("save-cancel");
                }}
                okButtonProps={{ className: "primary-btn popconfirm" }}
                cancelButtonProps={{ style: { display: "none" } }}
              >
                <Button
                  type="link"
                  disabled={record.invisible}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            )}
          </span>
        ),
      },
    ]);

    if (
      labels.some((member) => {
        return !member.saved;
      })
    )
      props.setBtnMode("save-cancel");
  }, [labels]);

  useEffect(() => {
    if (labelBuffer) {
      // console.log(labelBuffer);
      if (labelBuffer.key <= labels.length) {
        let before_edit = labels.find((elm) => elm.key === labelBuffer.key);
        let edittedLabels = labels.map((item) => {
          if (item.key === labelBuffer.key) {
            let toolState = cornerstoneTools.getToolState(
              dicomElement,
              "arrowAnnotate"
            );
            if (item.tool === "arrowAnnotate") {
              var element = document.getElementById("annotate-dicom-image");
              // console.log(labelBuffer,labels);
              let before_changetext = toolState.data[labels[labelBuffer.key - 1].index];
              cornerstoneTools.addToolState(element, "arrowAnnotate", {
                ...before_changetext,
                text: selectedLabel,
              });
              cornerstoneTools.removeToolState(
                dicomElement,
                "arrowAnnotate",
                before_changetext
              );
              // console.log(toolState);
              cornerstone.updateImage(element);
            }
            return {
              ...item,
              index:
                item.tool === "arrowAnnotate"
                  ? toolState.data.length - 1
                  : item.index,
              label: selectedLabel,
              saved: false,
              updated_time: new Date(),
              updated_by: user,
            };
          } else if (before_edit.tool === "arrowAnnotate" && item.tool === "arrowAnnotate" && before_edit.index < item.index){
            // console.log("case 2:",item, "new index:", item.index - 1)
            return {
              ...item,
              index: item.index - 1,
            };

          } else {
            // console.log("case 3:",item)
            return item;
          }
        });
        setLabels(edittedLabels);
      } else if (
        labelBuffer.tool === "ratio" &&
        labelBuffer.index.length === 1
      ) {
        return;
      } else {
        let toolState = cornerstoneTools.getToolState(
          dicomElement,
          "arrowAnnotate"
        );
        if (labelBuffer.tool === "arrowAnnotate") {
          var element = document.getElementById("annotate-dicom-image");
          let before_addtext = toolState.data[labelBuffer.index];
          cornerstoneTools.addToolState(element, "arrowAnnotate", {
            ...before_addtext,
            text: selectedLabel,
            invalidated: true,
          });
          cornerstoneTools.removeToolState(
            dicomElement,
            "arrowAnnotate",
            before_addtext
          );
          cornerstone.updateImage(element);
          // deactivateTools();
          // cornerstoneTools.arrowAnnotate.activate(dicomElement, 1);
        }
        let newLabel = {
          ...labelBuffer,
          index: labelBuffer.tool === "arrowAnnotate" ?  toolState.data.length -1 : labelBuffer.index,
          label: selectedLabel,
          saved: false,
          updated_time: new Date(),
          updated_by: user,
        };
        setLabels([...labels, newLabel]);
      }
      setLabelBuffer();
      setSelectedLabel();
    }
  }, [labelBuffer]);

  function displayImage(image) {
    var element = document.getElementById("annotate-dicom-image");
    if (!element) return
    cornerstone.enable(element);
    var viewport = cornerstone.getDefaultViewportForImage(element, image);
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
    cornerstoneTools.pan.enable(element);
    cornerstoneTools.freehand.enable(element);
    cornerstoneTools.length.enable(element);
    cornerstoneTools.rectangleRoi.enable(element);
    cornerstoneTools.arrowAnnotate.enable(element);

    // cornerstoneTools.addTool(ArrowAnnotateTool, {
    //   configuration: {
    //     getTextCallback: () => { console.log('get text'); },
    //     changeTextCallback: () => { console.log('change text'); },
    //   },
    // });
    setTool("mouse");
    setDicomElement(element);
    removeAnnotations(element);
    //getBBox
    getBBox(rid).then((res) => {
      if (res.data) {
        let temp = res;
        let loadedData = temp.data.data.reduce(
          (current, item, i) => {
            const bbox = item.data;
            if (item.tool === "ratio") {
              cornerstoneTools.addToolState(element, "length", bbox[0]);
              cornerstoneTools.addToolState(element, "length", bbox[1]);
              return {
                ...current,
                initial_lb: [
                  ...current.initial_lb,
                  {
                    key: i + 1,
                    tool: item.tool,
                    index: [current["length"], current["length"] + 1],
                    label: item.label,
                    ratio: bbox.ratio,
                    saved: true,
                    updated_by: item.updated_by,
                    updated_time: item.updated_time,
                    invisible: false,
                  },
                ],
                length: current["length"] + 2,
              };
            }
            cornerstoneTools.addToolState(element, item.tool, bbox);
            return {
              ...current,
              initial_lb: [
                ...current.initial_lb,
                {
                  key: i + 1,
                  tool: item.tool,
                  index: current[item.tool],
                  label: item.label,
                  saved: true,
                  updated_by: item.updated_by,
                  updated_time: item.updated_time,
                  invisible: false,
                },
              ],
              [item.tool]: current[item.tool] + 1,
              //lastSavedData: [...current.lastSavedData, {key:i+1, data:item.data.handles}]
              /* initial_ll: current.initial_ll.includes(item.label)
                ? current.initial_ll
                : [...current.initial_ll, item.label], */
            };
          },
          {
            initial_lb: [],
            rectangleRoi: 0,
            freehand: 0,
            length: 0 /* initial_ll: [] */,
            arrowAnnotate: 0
          }
        );
        // console.log(loadedData);
        cornerstone.updateImage(element);
        setLabels(loadedData.initial_lb);
        setImgLoaded(true);
        // setLabelList(temp.initial_ll);
      }
      res.data.createdAt !== res.data.updatedAt &&
        setSavedTime(new Date(res.data.updatedAt).toLocaleString());
    });
  }

  // count Tools in Label list
  function countLabelTool () {
    return labels.reduce(
      (counter, item) => {
        if (item.invisible) return counter;
        if (item.tool === "ratio") counter["length"] = counter["length"] + 2;
        else counter[item.tool] = counter[item.tool] + 1;
        return counter;
      },
      { rectangleRoi: 0, length: 0, freehand: 0, arrowAnnotate: 0 }
    );

  }

  function cancelBBox (completed){
    if (!completed && tool === "freehand") return
    let count = countLabelTool();
    let toolState = cornerstoneTools.getToolState(
      dicomElement,
      tool === "ratio" ? "length" : tool
    );
    console.log(toolState)
    if (tool === "ratio"){
      if (!completed && !labelBuffer && toolState.data.length > count["length"]){
        cornerstoneTools.removeToolState(dicomElement, "length", toolState.data[toolState.data.length - 1]);
      }
      else if (labelBuffer?.index?.length === 1){
        if (toolState.data.length > count["length"] + 1){
          cornerstoneTools.removeToolState(dicomElement, "length", toolState.data[toolState.data.length - 1]);
        }
        cornerstoneTools.removeToolState(dicomElement, "length", toolState.data[labelBuffer.index[0]]);
        setLabelBuffer();
      }
    }
    else if (toolState.data.length > count[tool]){
      cornerstoneTools.removeToolState(dicomElement, tool, toolState.data[toolState.data.length - 1]);
    }
    cornerstone.updateImage(dicomElement);
  }

  useHotkeys('esc', () => {
    console.log("esc - pressed");
    console.log(tool);
    console.log(labelBuffer);
    if (["mouse","pan"].includes(tool)) return;
    var cancelBtn = document.getElementById("select-label-cancel-button");
    if (cancelBtn){
      cancelBtn.click();
      return
    }
    cancelBBox(false);
  }
  ,{
    filter: () => true
  },[/* tool,labelBuffer,labels */]
  );

  function selectTool(prop) {
    if (!imgLoaded) return
    /**
     * check if current is ratio and not complete yet -> remove
     */
    if (
      labelBuffer &&
      labelBuffer.tool === "ratio" &&
      labelBuffer.index.length === 1
    ) {
      let index = labelBuffer.index[0];
      let toolState = cornerstoneTools.getToolState(dicomElement, "length")
        .data[index];
      cornerstoneTools.removeToolState(dicomElement, "length", toolState);
      cornerstone.updateImage(dicomElement);
      setLabelBuffer();
    }
    deactivateTools();
    setTool(prop);
    if (prop === "mouse") prop = "wwwc";
    else if (prop === "ratio") prop = "length";
    cornerstoneTools[prop].activate(dicomElement, 1);
  }

  function deactivateTools() {
    cornerstoneTools.wwwc.disable(dicomElement);
    cornerstoneTools.pan.activate(dicomElement, 2); // 2 is middle mouse button
    cornerstoneTools.zoom.activate(dicomElement, 4); // 4 is right mouse button
    if (props.mode === "editable") {
      cornerstoneTools.length.deactivate(dicomElement, 1);
      cornerstoneTools.rectangleRoi.deactivate(dicomElement, 1);
      cornerstoneTools.freehand.deactivate(dicomElement, 1);
      cornerstoneTools.arrowAnnotate.deactivate(dicomElement, 1);
    }
  }

  //onclose
  function removeAnnotations(element) {
    var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
    toolStateManager.clear(element);
    cornerstone.updateImage(element);
  }

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
    // console.log(labels);
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
    } else {
      let count = labels.reduce(
        (counter, item) => {
          if (item.invisible) return counter;
          if (item.tool === "ratio") counter["length"] = counter["length"] + 2;
          else counter[item.tool] = counter[item.tool] + 1;
          return counter;
        },
        { rectangleRoi: 0, length: 0, freehand: 0, arrowAnnotate: 0 }
      );
      let toolState = cornerstoneTools.getToolState(
        dicomElement,
        tool === "ratio" ? "length" : tool
      );
      // console.log(toolState)
      if (
        tool === "ratio" &&
        toolState.data &&
        toolState.data.length > count["length"] &&
        !toolState.data[toolState.data.length - 1].active
      ) {
        if (labelBuffer) {
          if (toolState.data.length <= count["length"] + 1) return;
          addNewLabel(undefined, undefined, {
            ...labelBuffer,
            ratio: (
              toolState.data[labelBuffer.index[0]]["length"] /
              toolState.data[toolState.data.length - 1]["length"]
            ).toFixed(4),
            index: [...labelBuffer.index, toolState.data.length - 1],
          });
          setLabelBuffer();
        } else {
          setLabelBuffer({
            key: labels.length > 0 ? labels[labels.length - 1].key + 1 : 1,
            tool: tool,
            index: [toolState.data.length - 1],
          });
          return;
        }
      }
      if (tool === "arrowAnnotate"){
        if (toolState.data &&
        toolState.data.length > count[tool] &&
        !toolState.data[toolState.data.length - 1].handles.end.active){
          addNewLabel(tool, toolState.data.length - 1);
          return;
        }
      }
      else if (
        toolState.data &&
        toolState.data.length > count[tool] &&
        !toolState.data[toolState.data.length - 1].active
      ) {
        addNewLabel(tool, toolState.data.length - 1);
        return;
      }
    }
    let globalTool =
      cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
    globalTool = globalTool[Object.keys(globalTool)[0]];
    let checker = labels.map((item, i) => {
      if (item.invisible) return item;
      if (item.tool === "ratio") {
        let first_line = globalTool["length"].data[item.index[0]];
        let second_line = globalTool["length"].data[item.index[1]];
        let ratio = (first_line["length"] / second_line["length"]).toFixed(4);
        if (ratio !== item.ratio) {
          //edit here
          return {
            ...item,
            ratio: ratio,
            saved: false,
            updated_time: new Date(),
            updated_by: user,
          };
        }
        if (!item.saved) return item;
        let ind = savedData.findIndex((elm) => elm.key === item.key);
        if (
          JSON.stringify(first_line.handles.start) !==
            JSON.stringify(savedData[ind].data[0].handles.start) ||
          JSON.stringify(second_line.handles.start) !==
            JSON.stringify(savedData[ind].data[1].handles.start) ||
          JSON.stringify(first_line.handles.end) !==
            JSON.stringify(savedData[ind].data[0].handles.end) ||
          JSON.stringify(second_line.handles.end) !==
            JSON.stringify(savedData[ind].data[1].handles.end)
        ) {
          return {
            ...item,
            saved: false,
            updated_time: new Date(),
            updated_by: user,
          };
        } else return item;
      } else {
        if (!item.saved) return item;
        if (item.tool === "length") {
          if (
            JSON.stringify(
              globalTool[item.tool].data[item.index].handles.start
            ) !==
              JSON.stringify(
                savedData[savedData.findIndex((elm) => elm.key === item.key)]
                  .data.handles.start
              ) ||
            JSON.stringify(
              globalTool[item.tool].data[item.index].handles.end
            ) !==
              JSON.stringify(
                savedData[savedData.findIndex((elm) => elm.key === item.key)]
                  .data.handles.end
              )
          )
            return {
              ...item,
              saved: false,
              updated_time: new Date(),
              updated_by: user,
            };
          else return item;
        }
        if (item.tool === "arrowAnnotate") {
          if (
            JSON.stringify(
              globalTool[item.tool].data[item.index].handles.start
            ) !==
              JSON.stringify(
                savedData[savedData.findIndex((elm) => elm.key === item.key)]
                  .data.handles.start
              ) ||
            JSON.stringify(
              globalTool[item.tool].data[item.index].handles.end
            ) !==
              JSON.stringify(
                savedData[savedData.findIndex((elm) => elm.key === item.key)]
                  .data.handles.end
              )
          ) return {
              ...item,
              saved: false,
              updated_time: new Date(),
              updated_by: user,
            };
          else return item;
        }
        if (
          JSON.stringify(globalTool[item.tool].data[item.index].handles) !==
          JSON.stringify(
            savedData[savedData.findIndex((elm) => elm.key === item.key)].data
              .handles
          )
        ) {
          return {
            ...item,
            saved: false,
            updated_time: new Date(),
            updated_by: user,
          };
        } else return item;
      }
    });
    if (
      checker.some((member) => {
        return !member.saved;
      })
    ) {
      setLabels(checker);
      // props.setBtnMode("save-cancel");
    }
  };

  const onViewerChange = (prop, value) => (e) => {
    let viewport = cornerstone.getViewport(dicomElement);
    if (prop === "zoomin") {
      if (viewerState.zoom >= 30) return;
      value = viewport.scale / viewerState.defaultZoom + 0.25;
      viewport.scale = value * viewerState.defaultZoom;
      cornerstone.setViewport(dicomElement, viewport);
      prop = "zoom";
    }
    if (prop === "zoomout") {
      if (viewerState.zoom <= 0.25) return;
      value = viewport.scale / viewerState.defaultZoom - 0.25;
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

  const addNewLabel = (tool, index, buffer) => {
    let key = labels.length > 0 ? labels[labels.length - 1].key + 1 : 1;
    Modal.confirm({
      title: "Choose label",
      content: (
        <Label
          setSelectedLabel={setSelectedLabel}
          labelList={props.labelList}
          // setLabelList={setLabelList}
        />
      ),
      keyboard: false,
      className: "label-selector-modal",
      okText: "Submit",
      cancelText: "Remove",
      onOk: () => {
        buffer
          ? setLabelBuffer(buffer)
          : setLabelBuffer({
              key: key,
              tool: tool,
              index: index,
            });
      },
      okButtonProps: {
        style: {
          boxShadow: "none",
          backgroundColor: "#de5c8e",
        },
        id: "select-label-ok-button",
      },
      onCancel: () => cancelBBox(true),
      cancelButtonProps: {
        id: "select-label-cancel-button",
      },
    });
  };

  const saveAnnotations = () => {
    const key = "updatable";
    message.loading({ content: "Loading...", key });
    let rectangleRoiState = cornerstoneTools.getToolState(
      dicomElement,
      "rectangleRoi"
    );
    let freehandState = cornerstoneTools.getToolState(dicomElement, "freehand");
    let lengthState = cornerstoneTools.getToolState(dicomElement, "length");
    let arrowAnnotateState = cornerstoneTools.getToolState(dicomElement, "arrowAnnotate");
    let bbox_data = labels.reduce((current, item, i) => {
      return [
        ...current,
        {
          label: item.label,
          tool: item.tool,
          updated_by: item.updated_by.id ?? item.updated_by._id,
          data:
            item.tool === "ratio"
              ? item.index === -1
                ? {
                    0: { ...item.invisible[0], active: false },
                    1: { ...item.invisible[1], active: false },
                    ratio: item.ratio,
                  }
                : {
                    0: { ...lengthState.data[item.index[0]], active: false },
                    1: { ...lengthState.data[item.index[1]], active: false },
                    ratio: item.ratio,
                  }
              : item.index === -1
              ? { ...item.invisible, active: false }
              : item.tool === "freehand"
              ? { ...freehandState.data[item.index], active: false }
              : item.tool === "length"
              ? { ...lengthState.data[item.index], active: false } 
              : item.tool === "arrowAnnotate"
              ? { ...arrowAnnotateState.data[item.index], active: false } 
              : { ...rectangleRoiState.data[item.index], active: false },
          updated_time: item.updated_time,
        },
      ];
    }, []);

    insertBBox(rid, bbox_data).then((res) => {
      if (res.success) {
        message.success({
          content: "Bounding boxes successfully saved.",
          key,
          duration: 5,
        });
        props.setBtnMode("close");
        setLabels(
          labels.map((item) => {
            return { ...item, saved: true };
          })
        );
        setSavedData(
          res.data.data.map((item, i) => {
            return { key: labels[i].key, data: item.data };
          })
        );
        setSavedTime(new Date(res.data.updatedAt).toLocaleString());
        props.updateTimestamp(res.data.updatedAt, user);
      } else
        message.error({
          content: "Cannot save bounding boxes, please try again later.",
          key,
          duration: 5,
        });
    });
  };

  const onCancelAnnotations = () => {
    return Modal.confirm({
      title: "Are you sure you want to cancel?",
      icon: <ExclamationCircleOutlined />,
      content: "All changes made will be lost.",
      okText: "Sure",
      onOk: () => {
        setImgLoaded(false);
        loadDicom(
          getDicomByAccessionNo(props.accession_no),
          "wado",
          displayImage
        );
        props.setBtnMode("close");
      },
      cancelText: "No",
    });
  };

  const onChangeGradcam = (value) => {
    setGradCam({ ...gradCam, selected: value });
  };

  const onCheckPositiveGradcam = (e) => {
    let positiveGradcam = props.gradCamList.filter((item) => {
      return item.isPositive;
    });
    setGradCam({
      selected: e.target.checked
        ? positiveGradcam.includes(gradCam.selected)
          ? gradCam.selected
          : positiveGradcam[0]?.finding || undefined
        : gradCam.selected ?? props.gradCamList[0].finding,
      onlyPositive: e.target.checked,
    });
  };

  const hideAll = () => {
    let update = labels;
    let globalTool =
      cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
    globalTool = globalTool[Object.keys(globalTool)[0]];
    update = update
      .sort((a, b) => (b.index[1] ?? b.index) - (a.index[1] ?? a.index))
      .reduce((current, item, i) => {
        if (item.invisible) return [...current, item];
        if (item.tool === "ratio") {
          const first_line = globalTool["length"].data[item.index[0]];
          const second_line = globalTool["length"].data[item.index[1]];
          cornerstoneTools.removeToolState(dicomElement, "length", second_line);
          cornerstoneTools.removeToolState(dicomElement, "length", first_line);
          return [
            ...current,
            { ...item, index: -1, invisible: [first_line, second_line] },
          ];
        }
        const bbox = globalTool[item.tool].data[item.index];
        cornerstoneTools.removeToolState(dicomElement, item.tool, bbox);
        return [...current, { ...item, index: -1, invisible: bbox }];
      }, [])
      .sort((a, b) => a.key - b.key);
    cornerstone.updateImage(dicomElement);
    setLabels(update);
  };

  const showAll = () => {
    let update = labels;
    let globalTool =
      cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
    globalTool = globalTool[Object.keys(globalTool)[0]];
    update = update.reduce((current, item, i) => {
      if (!item.invisible) return [...current, item];
      const bbox = item.invisible;
      if (item.tool === "ratio") {
        cornerstoneTools.addToolState(dicomElement, "length", bbox[0]);
        cornerstoneTools.addToolState(dicomElement, "length", bbox[1]);
        return [
          ...current,
          {
            ...item,
            index: [
              globalTool["length"].data.length - 2,
              globalTool["length"].data.length - 1,
            ],
            invisible: false,
          },
        ];
      }
      cornerstoneTools.addToolState(dicomElement, item.tool, bbox);
      return [
        ...current,
        {
          ...item,
          index: globalTool[item.tool].data.length - 1,
          invisible: false,
        },
      ];
    }, []);
    cornerstone.updateImage(dicomElement);
    setLabels(update);
  };

  return (
    <div>
      <Row>
        <Col
          span={15}
          justify="center"
          align="start"
          style={{ height: "640px" }}
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
            style={{ display: "relative", width: "790px", height: "640px" }}
          />
        </Col>
        <Col span={9} style={{ height: "640px" }}>
          <Collapse
            className="annotation-collapse"
            expandIconPosition="right"
            defaultActiveKey={[1, 2, 3]}
          >
            {props.mode === "editable" && props.gradCamList.length && (
              <Panel header="Gradcam" key="1">
                <Row align="center" style={{ marginBottom: "10px" }}>
                  <span style={{ marginBottom: "5px" }}>
                    <Select
                      showArrow={false}
                      showSearch
                      optionFilterProp="children"
                      onChange={onChangeGradcam}
                      value={gradCam.selected}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      bordered={false}
                      className="annotation-gc-select"
                    >
                      {props.gradCamList.reduce((current, item) => {
                        if (gradCam.onlyPositive && !item.isPositive)
                          return current;
                        return [
                          ...current,
                          <Option value={item.finding} key={item.finding}>
                            {item.finding}
                          </Option>,
                        ];
                      }, [])}
                    </Select>
                    <Checkbox
                      className="annotation-gc-checkbox"
                      defaultChecked
                      onChange={onCheckPositiveGradcam}
                    >
                      Show only <br /> positive findings
                    </Checkbox>
                  </span>
                  {gradCam.selected ? (
                    <Image
                      height={400}
                      src={getGradCam(rid, gradCam.selected)}
                    />
                  ) : (
                    <label style={{ margin: "120px 0 120px 0" }}>
                      {" "}
                      No Gradcam Data{" "}
                    </label>
                  )}
                </Row>
              </Panel>
            )}
            <Panel header="Toolbar" key="2">
              <Col style={{ marginTop: "10px" }}>
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
                <Col span={8} justify="center" align="start">
                  <Checkbox
                    onChange={onViewerChange("invert")}
                    checked={viewerState.invert}
                  >
                    Invert
                  </Checkbox>
                </Col>
                <Col span={8} justify="center" align="center">
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
                      style={{ marginRight: "2px" }}
                      onClick={onViewerChange("zoomout")}
                    />

                    <Button
                      className="zoom-btn"
                      icon={<ZoomInOutlined />}
                      onClick={onViewerChange("zoomin")}
                    />
                  </div>
                </Col>
                <Col span={8} align="end">
                  <Button className="reset-vp-btn" onClick={resetViewPort}>
                    Reset Viewport
                    <RedoOutlined />
                  </Button>
                </Col>
              </Row>
              <Row style={{ marginTop: "5px", marginBottom: "15px" }}>
                <Col
                  span={props.mode === "editable" ? 8 : 12}
                  className="annotate-tool-btn-ctn"
                >
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
                <Col
                  span={props.mode === "editable" ? 8 : 12}
                  className="annotate-tool-btn-ctn"
                >
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
                {props.mode === "editable" && (
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
                )}
                {props.mode === "editable" && (
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
                )}
                {props.mode === "editable" && (
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
                )}
                {props.mode === "editable" && (
                  <Col span={8} className="annotate-tool-btn-ctn">
                    <Button
                      className={`annotate-tool-btn ${
                        tool === "ratio" ? "selected-tool" : ""
                      }`}
                      onClick={() => {
                        selectTool("ratio");
                      }}
                    >
                      Ratio {<VerticalAlignBottomOutlined />}
                    </Button>
                  </Col>
                )}
                {props.mode === "editable" && (
                  <Col span={8} className="annotate-tool-btn-ctn">
                    <Button
                      className={`annotate-tool-btn ${
                        tool === "arrowAnnotate" ? "selected-tool" : ""
                      }`}
                      onClick={() => {
                        selectTool("arrowAnnotate");
                      }}
                    >
                      Arrow {<ArrowLeftOutlined />}
                    </Button>
                  </Col>
                )}
              </Row>
            </Panel>
            <Panel header="Boundind Boxes Table" key="3">
              <Row align="space-between" style={{ marginTop: "10px" }}>
                <Col span={8} align="start">
                  <label
                    className="annotate-tool-label"
                    style={{ marginLeft: "5px" }}
                  >
                    Bounding Boxes
                  </label>
                </Col>
                {savedTime && (
                  <Col span={16} align="end">
                    <span style={{ fontSize: "small", marginLeft: "10px" }}>
                      Last Saved: {savedTime}
                    </span>
                  </Col>
                )}
                <Table
                  className={`annotate-table clickable-table ${props.mode}`}
                  rowClassName={(record, index) =>
                    record.saved ? "" : "unsaved-label"
                  }
                  columns={columns}
                  dataSource={labels}
                  pagination={false}
                  size="small"
                />
              </Row>
              <Row justify="end">
                {labels.some((member) => {
                  return member.invisible;
                }) && (
                  <Button
                    type="link"
                    style={{ padding: 0, paddingRight: 10 }}
                    onClick={showAll}
                  >
                    Show All
                  </Button>
                )}
                {labels.some((member) => {
                  return !member.invisible;
                }) && (
                  <Button
                    type="link"
                    style={{ padding: 0, paddingLeft: 10 }}
                    onClick={hideAll}
                  >
                    Hide All
                  </Button>
                )}
              </Row>
            </Panel>
          </Collapse>
          <Row justify="end" style={{ marginTop: "12px" }}>
            {props.btnMode === "save-cancel" && (
              <Button
                className="primary-btn smaller"
                style={{ marginRight: "10px" }}
                onClick={onCancelAnnotations}
              >
                Cancel
              </Button>
            )}
            {props.btnMode === "save-cancel" && (
              <Button className="primary-btn smaller" onClick={saveAnnotations}>
                Save
              </Button>
            )}

            {props.btnMode === "close" && (
              <Button
                className="primary-btn smaller"
                onClick={props.handleCancel}
              >
                Close
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
