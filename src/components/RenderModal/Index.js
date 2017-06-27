import React from 'react'

import {Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button} from 'antd';
import dataJs from '../../../json-server/js'
const FormItem = Form.Item;
const Option = Select.Option;

import PanelBox from '../../components/PanelBox';

//import ReactDOM from 'react-dom';

const residences = [{
	value: 'zhejiang',
	label: 'Zhejiang',
	children: [{
		value: 'hangzhou',
		label: 'Hangzhou',
		children: [{
			value: 'xihu',
			label: 'West Lake',
		}],
	}],
}, {
	value: 'jiangsu',
	label: 'Jiangsu',
	children: [{
		value: 'nanjing',
		label: 'Nanjing',
		children: [{
			value: 'zhonghuamen',
			label: 'Zhong Hua Men',
		}],
	}],
}];

class RenderModal extends React.Component {
	state = {
		confirmDirty: false,
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};
	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({confirmDirty: this.state.confirmDirty || !!value});
	};
	checkPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};
	checkConfirm = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], {force: true});
		}
		callback();
	};



	render() {
		const {getFieldDecorator} = this.props.form;
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 14,
					offset: 0,
				},
				sm: {
					span: 14,
					offset: 6,
				},
			},
		};
		const prefixSelector = getFieldDecorator('prefix', {
			initialValue: '86',
		})(
			<Select className="icp-selector">
				<Option value="86">+86</Option>
			</Select>
		);
		return (
			<Form onSubmit={this.handleSubmit}>
				{
					Object.keys(this.props.formItems).map((item, i) => {
						const val = '' + this.props.formItems[item];
						if (item !== 'id') {
							if (item === 'departmentId') {
								return (
									<FormItem
										{...formItemLayout}
										label={item}
										hasFeedback
										key={i}
									>
										{getFieldDecorator(val, {
											initialValue: dataJs().Departments[parseInt(val)].name,
											// rules: [{
											// 	type: 'string', message: 'The input is not valid name!',
											// }, {
											// 	required: true, message: 'Please input your  new name!',
											// }],
										})(
											<Select
												//value={val}
												//size={size}
												style={{ width: '100%' }}
												//onChange={this.handleCurrencyChange}
											>
												{dataJs().Departments.map( (itemD, iD) => {
													return (
														<Option key={iD + 100} value={itemD.name}>{itemD.name}</Option>
													)
												} )}
											</Select>
										)}
									</FormItem>

								)
							}
							return (
								<FormItem
									{...formItemLayout}
									label={item}
									hasFeedback
								    key={i}
								>
									{getFieldDecorator(val, {
										initialValue: val,
										// rules: [{
										// 	type: 'string', message: 'The input is not valid name!',
										// }, {
										// 	required: true, message: 'Please input your  new name!',
										// }],
									})(
										<Input />
									)}
								</FormItem>
							)
						}
					})
				}
				<FormItem {...tailFormItemLayout}>
					<Row>
						<Col className="gutter-row" span={8}>
							<Button type="primary" htmlType="submit" size="large" onClick={this.props.func.onOk}>Submit</Button>
						</Col>
						<Col className="gutter-row" span={8} offset={8}>
							<Button type="" htmlType="submit" size="large" onClick={this.props.func.onCancel}>Cancel</Button>
						</Col>
					</Row>
				</FormItem>
			</Form>
		);
	}
}

const WrappedRenderModal = Form.create()(RenderModal);
export default WrappedRenderModal
