import React from 'react'
import {Table,  Modal, Button} from 'antd';
import api from '../../api';
import PanelBox from '../../components/PanelBox';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {saveTableData} from '../../actions/table';

import WrappedRegistrationForm from './modal'


class TablePage extends React.Component {
	state = {
		data: [],
		endData:false,
		pagination: {
			total: 0,
			current: 0
		},
		loading: false,
		modalOpen: false,
		modalData: {},
	};

	showModal = (record) => {
		this.setState({
			modalOpen: true,
		});
	}
	handleOk = (e, some) => {
		console.log(e);
		console.log(some);
		this.setState({
			modalOpen: false,
		});
	}
	handleCancel = (e) => {
		console.log(e);
		this.setState({
			modalOpen: false,
		});
	}

	constructor(props) {
		super(props);
		this.columns = [{
			title: 'Name',
			dataIndex: 'name',
			sorter: true,
			//render: name => `${name.first} ${name.last}`,
			render: name => `${name}`,
			width: '20%',
		},
			{
				title: 'Change rec',
				dataIndex: 'rec',
				sorter: false,
				render: (text, record, index) => <div><a onClick={this.changeRecord.bind(this, text, record, index)}>Change {text}</a></div>,
				width: '20%',
			}
		];
	}
	changeRecord (text, record, index) {
		console.log(record);
		this.setState({
			modalData: record,
		});
		this.showModal(record);
	}

	handleTableChange = (pagination, filters, sorter, page) => {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		});
		// this.fetch({
		// 	results: pagination.pageSize,
		// 	page: pagination.current,
		// 	sortField: sorter.field,
		// 	sortOrder: sorter.order,
		// 	...filters,
		// });
		if (Math.ceil(pagination.total / pagination.pageSize) === pagination.current && !this.state.endData) {
			this.fetch({
				results: pagination.pageSize,
				page: pagination.current,
				sortField: sorter.field,
				sortOrder: sorter.order,
				current: pagination.total,
				limit: pagination.total + 50,
				...filters,
			});
		}
	}
	fetch = (params = {}) => {
		this.setState({loading: true});
		api.get('/ariya_table_update', {
			params: {
				results: 10,
				...params,
			},
			responseType: 'json'
		}).then((res) => {
			const new_data = this.state.data.dataSource ? this.state.data.dataSource.concat(res.data) : res.data;
			const data = {
				dataSource: new_data
			};
			const pagination = this.state.pagination;
			pagination.total = res.data.length > 0 ?  new_data.length +  10 : new_data.length;
			this.setState({
				loading: false,
				data: data,
				endData: res.data.length === 0,
				pagination,
			});
			this.props.saveTableData && this.props.saveTableData({
				loading: false,
				data: data,
				endData: res.data.length === 0,
				pagination,
			});
		});

	};

	componentDidMount() {
		!this.props.table.table ? this.fetch({current: 0, limit: 50}) : null;
		const table_props = this.props.table.table;
		this.props.table ?
			this.setState({
				...this.state,
				...table_props
			})
		: null
	}

	render() {
		const columns = this.columns;

		return (
			<PanelBox title="Table Page">
				<Table columns={columns}
				       rowKey={record => record.registered}
				       dataSource={this.state.data.dataSource}
				       pagination={this.state.pagination}
				       loading={this.state.loading}
				       onChange={this.handleTableChange}
				/>
				<Modal
					title="Change redord"
					visible={this.state.modalOpen}
					//onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[]}
				>
					{/*non form-redux*/}
					{this.state.modalOpen ?
						<WrappedRegistrationForm
							formItems={this.state.modalData}
							func={{
								onCancel: this.handleCancel.bind(this),
								onOk: this.handleOk.bind(this),
							}}
						/>
						: null}

				</Modal>
			</PanelBox>
		);
	}
}

function mapStateToProps(state)  {
	return {
		table: state.table
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		saveTableData: bindActionCreators(saveTableData, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TablePage);
