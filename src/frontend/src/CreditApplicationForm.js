import { useEffect, useState } from 'react';
import { Alert, Button, Col, Drawer, Form, Input, InputNumber, Progress, Row, Select, Tag, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { analyzeCreditApplication, uploadCreditDocument, explainDecision } from './Client';
import { errorNotification, successNotification } from './Notification';
import DecisionCard from './DecisionCard';
import AgentPipeline from './AgentPipeline';
import TraditionalComparison from './TraditionalComparison';
import FraudHeatmap from './FraudHeatmap';
import RiskRadar from './RiskRadar';
import DocumentScanPreview from './DocumentScanPreview';

const scoreRule = { required: true, type: 'number', min: 0, max: 100, message: 'Enter a score from 0 to 100' };

function ScoreBars({ values }) {
  return <Row gutter={16} className="score-bars">
    {[['Mobile', values.mobileUsageScore], ['Transactions', values.transactionBehaviorScore], ['Social', values.socialSignalScore]].map(([label, score]) => <Col span={8} key={label}><span>{label}</span><Progress percent={score || 0} showInfo={false} strokeColor="#1a237e" /></Col>)}
  </Row>;
}

function CreditApplicationForm({ open, onClose, onCreated }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [document, setDocument] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [documentEvidence, setDocumentEvidence] = useState(null);
  const [analyzedApp, setAnalyzedApp] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [explaining, setExplaining] = useState(false);
  useEffect(() => {
    if (!document) return undefined;
    setScanning(true);
    const timer = setTimeout(() => setScanning(false), 2200);
    return () => clearTimeout(timer);
  }, [document]);
  const submit = async values => {
    setSubmitting(true);
    setDecision(null);
    setDocumentEvidence(null);
    try {
      const { supportingDocument, ...application } = values;
      for (let stage = 0; stage < 5; stage += 1) {
        setActiveStep(stage);
        await new Promise(resolve => setTimeout(resolve, 700));
      }
      const result = await analyzeCreditApplication(application);
      setDecision(result);
      setAnalyzedApp(application);
      setExplanation(null);
      setActiveStep(5);
      const selectedFile = supportingDocument?.[0]?.originFileObj;
      if (selectedFile && result.applicationId) {
        setDocumentEvidence(await uploadCreditDocument(result.applicationId, selectedFile));
      }
      successNotification('Application analyzed', `${values.applicantName} is ${result.creditDecision}`);
      onCreated();
    } catch (error) {
      errorNotification('Analysis could not be completed', 'Check that the backend is running and all form values are valid.');
    } finally { setSubmitting(false); }
  };
  const close = () => { setDecision(null); setActiveStep(-1); setDocument(null); setDocumentEvidence(null); setAnalyzedApp(null); setExplanation(null); form.resetFields(); onClose(); };
  const explain = async () => {
    if (!analyzedApp) return;
    setExplaining(true);
    try {
      setExplanation(await explainDecision(analyzedApp));
    } catch (error) {
      errorNotification('Could not generate explanation', 'Confirm the backend is running and try again.');
    } finally { setExplaining(false); }
  };
  return <Drawer title="New credit application" width={680} open={open} onClose={close} destroyOnClose>
    <Form form={form} layout="vertical" onFinish={submit} initialValues={{ employmentType: 'SALARIED' }}>
      <Row gutter={16}>
        <Col span={12}><Form.Item name="applicantName" label="Applicant name" rules={[{ required: true }]}><Input placeholder="Ravi Kumar" /></Form.Item></Col>
        <Col span={12}><Form.Item name="age" label="Age" rules={[{ required: true, type: 'number', min: 18 }]}><InputNumber min={18} max={100} style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Form.Item name="annualIncome" label="Annual income (₹)" rules={[{ required: true, type: 'number', min: 0 }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={12}><Form.Item name="employmentType" label="Employment type" rules={[{ required: true }]}><Select options={['SALARIED', 'SELF_EMPLOYED', 'GIG_WORKER', 'STUDENT'].map(value => ({ value, label: value.replace('_', ' ') }))} /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}><Form.Item name="mobileUsageScore" label="Mobile usage" rules={[scoreRule]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item name="transactionBehaviorScore" label="Transactions" rules={[scoreRule]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8}><Form.Item name="socialSignalScore" label="Social signals" rules={[scoreRule]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
      </Row>
      <Form.Item noStyle shouldUpdate={(previous, current) => previous.mobileUsageScore !== current.mobileUsageScore || previous.transactionBehaviorScore !== current.transactionBehaviorScore || previous.socialSignalScore !== current.socialSignalScore}>
        {({ getFieldsValue }) => <ScoreBars values={getFieldsValue()} />}
      </Form.Item>
      <Form.Item name="supportingDocument" label="Supporting document (optional)" valuePropName="fileList" getValueFromEvent={event => event?.fileList}>
        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.png,.jpg,.jpeg" onChange={({ file }) => setDocument(file.originFileObj || file)}><Button icon={<UploadOutlined />}>Attach income proof or bank statement</Button></Upload>
      </Form.Item>
      <DocumentScanPreview file={document} scanning={scanning} />
      {documentEvidence && <section className="document-evidence" aria-label="Extracted document evidence"><span>EXTRACTED REVIEWER EVIDENCE</span><strong>{documentEvidence.extractionStatus.replaceAll('_', ' ')}</strong><p>{documentEvidence.textPreview || 'No readable text was detected. The original document remains available for human review.'}</p><small>This evidence is informational only; it does not automatically change the credit decision.</small></section>}
      <AgentPipeline activeStep={activeStep} complete={activeStep === 5} decision={decision} />
      <DecisionCard decision={decision} />
      {decision && <section className="explain-decision" aria-label="Explain decision">
        <Button onClick={explain} loading={explaining}>Explain this decision</Button>
        {explanation && <Alert
          className="explanation-card"
          type="info"
          showIcon
          message={<span>Explanation {explanation.aiPowered ? <Tag color="purple">AI powered</Tag> : <Tag>Rule based</Tag>}</span>}
          description={<>
            <p>{explanation.explanation}</p>
            {explanation.disclaimer && <small className="disclaimer">{explanation.disclaimer}</small>}
          </>}
        />}
      </section>}
      {decision && <><TraditionalComparison decision={decision} application={form.getFieldsValue()} /><Row gutter={[16, 16]}><Col xs={24} md={12}><FraudHeatmap application={decision} /></Col><Col xs={24} md={12}><RiskRadar application={{ ...form.getFieldsValue(), ...decision }} /></Col></Row></>}
      <Button type="primary" htmlType="submit" loading={submitting} block>Analyze application</Button>
    </Form>
  </Drawer>;
}
export default CreditApplicationForm;
