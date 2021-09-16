import React, { useState } from "react";
import { Button, Form, Input, notification, Spin, Typography } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const { Text, Title } = Typography;

const serverPath = "challenges";

export default function ChallengeSubmission({ challenge, serverUrl, address }) {
  const { challengeId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async values => {
    const { deployedUrl, branchUrl } = values;
    setIsSubmitting(true);

    try {
      await axios.post(serverUrl + serverPath, {
        challengeId,
        deployedUrl,
        branchUrl,
        // ToDo. Wont need this after JWT is implemented.
        address,
      });
    } catch (error) {
      notification.error({
        message: "Submission Error. Please try again.",
        description: error.toString(),
      });
      setIsSubmitting(false);

      return;
    }

    notification.success({
      message: "Challenge submitted!",
    });
    setIsSubmitting(false);
  };

  return (
    <div>
      <Title level={2}>Submit Challenge: {challenge.label}</Title>
      {challenge.isDisabled ? (
        <Text type="warning">This challenge is disabled.</Text>
      ) : (
        <Form
          name="basic"
          initialValues={{ branchUrl: challenge.url }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Deployed URL"
            name="deployedUrl"
            rules={[
              { required: true, message: "Required field" },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Branch URL"
            name="branchUrl"
            rules={[
              { required: true, message: "Required field" },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Spin spinning={isSubmitting}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Spin>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
