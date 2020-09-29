import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio, InputNumber, Checkbox, Col, Row } from 'antd';
import classes from './SettingsModal.module.css';
import { Store } from 'antd/lib/form/interface';
import { useStore } from 'react-hookstore';
import { clientsend_config_type, arduinosend_config_type } from '../Chart/ChartCombo';

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

interface Values {
    title: string;
    description: string;
    modifier: string;
}

export type pirateConfig = {
    clientsend_config: clientsend_config_type;
    arduinosend_config: arduinosend_config_type;
};

interface CollectionCreateFormProps {
    visible: boolean;
    onCreate: (values: Store) => void;
    onCancel: () => void;
    config: pirateConfig | undefined;
}

const SettingsModal: React.FC<CollectionCreateFormProps> = ({
    visible,
    onCreate,
    onCancel,
    config,
}: CollectionCreateFormProps) => {
    const [form] = Form.useForm();
    const [chartDataMaxPoints, setChartDataMaxPoints] = useStore<number>('chartDataMaxPoints');
    const [graphShowList, setGraphShowList] = useStore<string[]>('graphShowList');
    let checkBoxList = null;
    if (config) {
        for (const [id, value] of Object.entries(config?.clientsend_config)) {
            console.log(id, value);
            checkBoxList = Object.entries(config?.clientsend_config).map(([k, v]) => {
                return (
                    <Checkbox key={v.name} value={v.name} style={{ lineHeight: '32px' }}>
                        {v.name}
                    </Checkbox>
                );
            });
        }
    }
    return (
        <Modal
            visible={visible}
            title="Settings"
            okText="Apply"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values: Store) => {
                        console.log(values);
                        if (values['maxpoints']) {
                            setChartDataMaxPoints(parseInt(values['maxpoints']));
                        }
                        if (values['checkbox-group']) {
                            setGraphShowList(values['checkbox-group']);
                        }
                        form.resetFields();
                        onCreate(values as Values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
                validateMessages={validateMessages}
            >
                <Form.Item name="title" label="Title">
                    <Input />
                </Form.Item>
                <Form.Item
                    name="maxpoints"
                    label="Maximum of Points in Graph"
                    initialValue={chartDataMaxPoints}
                    rules={[{ type: 'number', min: 0, max: 400 }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item name="checkbox-group" label="Checkbox.Group" initialValue={graphShowList}>
                    <Checkbox.Group>
                        {checkBoxList}
                        {/* <Row>
                            <Col span={8}>
                                <Checkbox value="A" style={{ lineHeight: '32px' }}>
                                    A
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="B" style={{ lineHeight: '32px' }} disabled>
                                    B
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                    C
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="D" style={{ lineHeight: '32px' }}>
                                    D
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="E" style={{ lineHeight: '32px' }}>
                                    E
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="F" style={{ lineHeight: '32px' }}>
                                    F
                                </Checkbox>
                            </Col>
                        </Row> */}
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item name="modifier" className="{classes.collection-create-form_last-form-item}">
                    <Radio.Group>
                        <Radio value="public">Public</Radio>
                        <Radio value="private">Private</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SettingsModal;