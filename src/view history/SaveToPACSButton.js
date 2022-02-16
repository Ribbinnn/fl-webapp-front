import React, { useState } from "react";
import { Modal, Button, Checkbox, Tag, message } from "antd";
import { saveToPACS } from "../api/pacs";

export default function SaveToPACSButton(props) {
  const [visible, setVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onAgree = (e) => {
    setAgree(e.target.checked);
  };

  const onSavetoPACS = () => {
    handleCancel();
    /* save to PACS api */
    const key = "updatable";
    message.loading({ content: "Loading...", key, duration: 0 });

    saveToPACS(props.rid + "a")
      .then((res) => {
        // console.log(res);
        message.destroy(key);
        if (res.success) {
          Modal.success({
            content: res.message,
            okText: "Ok",
            onOk: () => {
              window.location.reload();
            },
          });
        } else {
          Modal.error({ content: res.message, okText: "Ok" });
        }
      })
      .catch((err) => {
        message.destroy(key);
        Modal.error({ content: err.response.data.message, okText: "Ok" });
      });
  };

  return (
    <div>
      <Button className="primary-btn" onClick={showModal}>
        Save to PACS
      </Button>
      <Modal
        centered
        destroyOnClose
        maskClosable={false}
        visible={visible}
        width={800}
        onCancel={handleCancel}
        title="Term of Save to PACS"
        onOk={() => {
          onSavetoPACS();
        }}
        cancelText="Cancel"
        okText="Proceed"
        className="save-2-pacs-modal"
        okButtonProps={{
          disabled: !agree,
        }}
      >
        <tr />
        <p>
          Please read terms of Save to PACS below carefully before proceed Save
          to PACS. If you agree, these terms will be applied.
        </p>
        <p>1. This action is CANNOT be undone.</p>
        <p>
          2. The X-Ray image used in this report will be marked as annonymous
          (Patient's HN and name will be removed).
        </p>
        <p>
          3. If there are other reports also referring to this X-Ray Image, they
          will be automatically applied term no.2 and their report cannot be
          proceeded Save to PACS.
        </p>
        <p>
          4. The X-Ray image used in this report CANNOT be later inferred by AI.
        </p>
        <p>5. The Gradcams from AI will remain only selected classes.</p>
        <p>
          6. Annotations on image can no longer be edited and displayed in
          view-only mode.
        </p>
        <p>
          7. This report status will be marked as{" "}
          <Tag color={"success"} style={{ marginLeft: "10px" }}>
            4 Finalized
          </Tag>{" "}
          once Save to PACS process is done. The result can be no longer edited
          and remained only selected classes.
        </p>

        <Checkbox onChange={onAgree}>
          I agree to all terms of Save to PACS stated above.
        </Checkbox>
      </Modal>
    </div>
  );
}
