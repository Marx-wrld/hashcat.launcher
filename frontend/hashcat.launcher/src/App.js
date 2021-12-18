import './App.css';
import 'antd/dist/antd.dark.css';

import React, { Component } from "react";
import { message, Row, Col, Statistic, Button, Layout, Tabs, Typography, Menu } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined, DeploymentUnitOutlined, RocketOutlined, ToolOutlined, UserOutlined, HomeOutlined, PlusOutlined, SettingOutlined, UnorderedListOutlined, QuestionOutlined } from '@ant-design/icons';

import data from "./jsx/data/data";
import EventBus from "./jsx/eventbus/EventBus";
import NewTask from './jsx/newtask';
import Settings from './jsx/settings';
import Tools from './jsx/tools';
import Tasks from './jsx/tasks';
import Help from './jsx/help';
import About from './jsx/about';
import TasksStats from './jsx/stats/tasks';

const { TabPane } = Tabs;
const { Header, Footer, Sider } = Layout;
const { Text, Title } = Typography;

class App extends Component {
	constructor(props) {
		super(props);

		data.callback = () => {
			EventBus.dispatch("dataUpdate");
		};
		data.getHashes();
		data.getAlgorithms();
		data.getDictionaries();
		data.getRules();
		data.getMasks();

		this.onSelectMenu = this.onSelectMenu.bind(this);

		this.newTaskView = <NewTask />;
		this.tasksView = <Tasks />;
		this.settingsView = <Settings />;
		this.toolsView = <Tools />;
		this.helpView = <Help />;
		this.aboutView = <About />;

		this.state = {
			version: undefined,
			currentView: "New Task"
		}
	}

	init() {
		if (typeof window.GOgetVersion === "function") {
			window.GOgetVersion().then(
				response => {
					this.setState({
						version: response
					});
				},
				error => {
					message.error("Failed to get version"  + " " + error);
				}
			);
		}
		if (typeof window.GOrestoreTasks === "function") {
			window.GOrestoreTasks().then(
				() => null,
				error => {
					message.error("Failed to restore tasks" + " " + error);
				}
			);
		}
	}

	setView(view) {
		this.setState({
			currentView: view
		});
	}

	onSelectMenu(e) {
		this.setView(e.key);
	}

	componentDidMount() {
		EventBus.on("taskUpdate", (taskUpdate) => {
			TasksStats._update(taskUpdate);
			EventBus.dispatch("tasksUpdate");
		});
		this.init();
	}

	componentWillUnmount() {
		EventBus.remove("taskUpdate");
	}

	render() {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Sider
					style={{
						overflow: 'auto',
						height: '100vh',
						position: 'fixed',
						left: 0
					}}
					collapsed
				>
					<Menu theme="dark" onSelect={this.onSelectMenu} defaultSelectedKeys={[this.state.currentView]} mode="inline">
						<Menu.Item key="New Task" icon={<PlusOutlined />}>
							New Task
						</Menu.Item>
						<Menu.Item key="Tasks" icon={<UnorderedListOutlined />}>
							Tasks
						</Menu.Item>
						<Menu.Item key="Settings" icon={<SettingOutlined />}>
							Settings
						</Menu.Item>
						<Menu.Divider />
						<Menu.Item key="Tools" icon={<DeploymentUnitOutlined />}>
							Tools
						</Menu.Item>
						<Menu.Divider />
						<Menu.Item key="Help" icon={<QuestionCircleOutlined />}>
							Help
						</Menu.Item>
						<Menu.Item key="About" icon={<InfoCircleOutlined />}>
							About
						</Menu.Item>
					</Menu>
				</Sider>
				<div style={{ marginLeft: '80px'}}></div>
				<Layout>
					<Header
						style={{
							display: 'flex',
							alignItems: 'center',
							position: 'fixed',
							zIndex: 1,
							width: '100%',
							backgroundColor: '#000',
							borderBottom: '1px #1d1d1d solid'
						}}
					>
						<img style={{ height: '100%'}} src={require('./images/Icon.png').default} />
						<Title level={3} style={{ margin: '0 10px', color: '#fff' }}>
							hashcat.launcher
						</Title>
						<span>
							{this.state.version ? (
								this.state.version === "dev" ? (
									"dev"
								) : (
									"v" + this.state.version
								)
							) : "dev"}
						</span>
					</Header>

					<div style={{ marginTop: '64px'}}></div>

					<div
						style={{ display: this.state.currentView === "New Task" ? "block" : "none" }}
					>
						{this.newTaskView}
					</div>

					<div
						style={{ display: this.state.currentView === "Tasks" ? "block" : "none" }}
					>
						{this.tasksView}
					</div>

					<div
						style={{ display: this.state.currentView === "Settings" ? "block" : "none" }}
					>
						{this.settingsView}
					</div>

					<div
						style={{ display: this.state.currentView === "Tools" ? "block" : "none" }}
					>
						{this.toolsView}
					</div>

					<div
						style={{ display: this.state.currentView === "Help" ? "block" : "none" }}
					>
						{this.helpView}
					</div>

					<div
						style={{ display: this.state.currentView === "About" ? "block" : "none" }}
					>
						{this.aboutView}
					</div>
				</Layout>
			</Layout>
		)
	}
}

export default App;