import React, { useState } from "react";
import { Button, Form, Input, notification, Spin, Typography } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const { Text, Title } = Typography;

const serverPath = "challenges";

export default function ChallengeSubmission({ challenge, serverUrl, address, userProvider }) {
  const { challengeId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async values => {
    const { deployedUrl, branchUrl } = values;
    setIsSubmitting(true);

    let signMessage;
    try {
      const signMessageResponse = await axios.get(serverUrl + `sign-message`, {
        params: {
          messageId: "challengeSubmit",
          address,
          challengeId,
        },
      });

      signMessage = JSON.stringify(signMessageResponse.data);
    } catch (error) {
      notification.error({
        message: "Can't get the message to sign. Please try again.",
        description: error.toString(),
      });
      setIsSubmitting(false);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      notification.error({
        message: "The signature was cancelled",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        serverUrl + serverPath,
        {
          challengeId,
          deployedUrl,
          branchUrl,
          signature,
        },
        {
          headers: {
            address,
          },
        },
      );
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

  if (!address) {
    return <Text type="warning">Connect your wallet to submit this Challenge.</Text>;
  }

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
