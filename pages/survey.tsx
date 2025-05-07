import React, { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Button,
  Typography,
  Space,
  Progress,
  Result,
} from "antd";
import { useRouter } from "next/router";
import style from "./css/app.module.css";

const { Title } = Typography;

// Define types for form values
interface SurveyValues {
  name: string;
  birthYear: string;
  phone: string;
  gender: string;
  medicalHistory: string;
  surgeries: string;
  allergies: string;
  currentMedications: string;
  symptoms: string;
  onsetTime: string;
  severity: string;
  progression: string;
  priorTreatment: string;
}

const Donate = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [isCompleted, setIsCompleted] = useState(false);
  const steps = [Step1, Step2, Step3];

  const router = useRouter();

  const nextStep = async () => {
    try {
      await form.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.error("Validation failed", err);
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const onFinish = (values: SurveyValues) => {
    console.log("Dữ liệu khảo sát:", values);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <Result
        status="success"
        title="Khảo sát đã được hoàn tất!"
        subTitle="Cảm ơn bạn đã tham gia khảo sát. Dữ liệu của bạn đã được gửi."
        extra={[
          <Button type="primary" key="home" onClick={() => router.push("/")}>
            Quay lại trang chủ
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className={style.container}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className={style.formContainer}
      >
        <Title level={3} className={style.stepTitle}>
          Bước {currentStep + 1}
        </Title>
        <Progress
          percent={
            steps.length > 0
              ? Math.round(((currentStep + 1) / steps.length) * 100)
              : 0
          }
          status="active"
          className={style.progressBar}
        />
        {React.createElement(steps[currentStep])}
        <Space className={style.buttonGroup}>
          {currentStep > 0 && (
            <Button className={style.prevButton} onClick={prevStep}>
              Quay lại
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button
              type="primary"
              className={style.nextButton}
              onClick={nextStep}
            >
              Tiếp tục
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              className={style.submitButton}
              htmlType="submit"
            >
              Hoàn tất
            </Button>
          )}
        </Space>
      </Form>
    </div>
  );
};

const Step1 = () => (
  <>
    <Form.Item
      label="Tên"
      name="name"
      rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
    >
      <Input placeholder="Nhập tên của bạn" className="custom-input" />
    </Form.Item>
    <Form.Item
      label="Năm sinh"
      name="birthYear"
      rules={[{ required: true, message: "Vui lòng nhập năm sinh!" }]}
    >
      <Input placeholder="Nhập năm sinh" className="custom-input" />
    </Form.Item>
    <Form.Item
      label="Số điện thoại"
      name="phone"
      rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
    >
      <Input placeholder="Nhập số điện thoại" className="custom-input" />
    </Form.Item>
    <Form.Item
      label="Giới tính"
      name="gender"
      rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
    >
      <Radio.Group className="custom-radio-group">
        <Radio value="male">Nam</Radio>
        <Radio value="female">Nữ</Radio>
        <Radio value="other">Khác</Radio>
      </Radio.Group>
    </Form.Item>
  </>
);

const Step2 = () => (
  <>
    <Form.Item
      label="Bệnh sử"
      name="medicalHistory"
      rules={[{ required: true, message: "Vui lòng nhập bệnh sử!" }]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập bệnh sử"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Phẫu thuật"
      name="surgeries"
      rules={[
        { required: true, message: "Vui lòng nhập thông tin phẫu thuật!" },
      ]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập thông tin phẫu thuật"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Dị ứng"
      name="allergies"
      rules={[{ required: true, message: "Vui lòng nhập dị ứng!" }]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập dị ứng"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Thuốc đang dùng"
      name="currentMedications"
      rules={[{ required: true, message: "Vui lòng nhập thông tin thuốc!" }]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập thông tin thuốc"
        className="custom-textarea"
      />
    </Form.Item>
  </>
);

const Step3 = () => (
  <>
    <Form.Item
      label="Loại triệu chứng"
      name="symptoms"
      rules={[{ required: true, message: "Vui lòng nhập triệu chứng!" }]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập triệu chứng"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Thời gian xuất hiện"
      name="onsetTime"
      rules={[
        { required: true, message: "Vui lòng nhập thời gian xuất hiện!" },
      ]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập thời gian xuất hiện"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Mức độ nghiêm trọng"
      name="severity"
      rules={[
        { required: true, message: "Vui lòng nhập mức độ nghiêm trọng!" },
      ]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập mức độ nghiêm trọng"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Thay đổi theo thời gian"
      name="progression"
      rules={[
        { required: true, message: "Vui lòng nhập thay đổi theo thời gian!" },
      ]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập thay đổi theo thời gian"
        className="custom-textarea"
      />
    </Form.Item>
    <Form.Item
      label="Điều trị trước đây"
      name="priorTreatment"
      rules={[
        {
          required: true,
          message: "Vui lòng nhập thông tin điều trị trước đây!",
        },
      ]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập thông tin điều trị trước đây"
        className="custom-textarea"
      />
    </Form.Item>
  </>
);

export default Donate;
