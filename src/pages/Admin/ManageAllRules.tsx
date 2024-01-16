import React, { FC, ReactElement, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import CheckIcon from '@mui/icons-material/Check';

// components
import PageTitle from "../../components/PageTitle";
import Button from '@mui/material/Button';
import RulesDashboard from '../../components/RulesDashboard'

// constants
import { APP_TITLE, ADMIN_MANAGE_ALL_RULES, API_ADMIN_MANAGE_ALL_RULES, HEADER_HEIGHT } from "../../utils/constants";

import axios from 'axios';

// define css-in-js
const useStyles = makeStyles((theme) =>
	createStyles({
		top: {
			position: "fixed",
			zIndex: 1,
			width: "100%",
			backgroundColor: theme.palette.background.default,
			top: HEADER_HEIGHT,
			paddingTop: 20,
		},
		rulesPane: {
			padding: HEADER_HEIGHT + 20,
			overflow: "hidden",
		},
		dropZone: {
			width: "50%"
		},
		dashboard: {
			marginTop: 100,
		},
		icon: {
			size: 'small',
			position: 'fixed',
			padding: '2px'
		},
		button: {
			size: 'medium',
			color: theme.palette.primary.main
		}
	})
);

const ManageAllRules: FC<{}> = (): ReactElement => {
	const classes = useStyles();
	const [clickUpload, setUpload] = useState(false)
	let [buttonText, setButtonText] = useState("Upload")
	let fileReader: any;
	const token = localStorage.getItem('token')

	interface Row {
		[key: string]: string;
	}

	interface OneRow extends Row {
		id: string,
		description: string,
		yaml_file: string,
		created: string,
		last_modified: string,
		severity: string,
		category: string,
		enabled: string,
	}

	const [rules, setRules] = useState<Array<OneRow>>([])
	let [fileCache, setFileCache] = useState({ fileName: "", description: "" })
	const [showResult, setShowResult] = useState(false)
	const [sending, setSending] = useState(false)

	const hasFile: boolean = fileCache !== null && fileCache.fileName !== null && fileCache.fileName.length > 0

	useEffect(() => {
		const fetchRules = async () => {
			await axios
				.get(API_ADMIN_MANAGE_ALL_RULES, {
					headers: {
						'content-type': 'application/json',
						Authorization: 'Bearer ' + token,
					},
					params: 'manage_all_rules',
				})
				.then((res: any) => {
					setRules(res.data)
				})
				.catch((err: any) => {
					console.log(err)
				})
		}
		fetchRules()
	}, [])

	const handleClickRefresh = (): void => {
		location.reload()
		setFileCache({
			fileName: "",
			description: ""
		})
		setUpload(false)
		setButtonText("Upload")
		setSending(false)
		setShowResult(false)
	}

	const handleClickUpload = (): void => {
		setFileCache({
			fileName: "",
			description: ""
		})
		setUpload(!clickUpload)
		if (!clickUpload) {
			buttonText = "Cancel"
		} else {
			buttonText = "Upload"
		}
		setButtonText(buttonText)
		setShowResult(false)
	}

	const handleFileRead = (target: any): any => {
		if (hasFile) {
			setFileCache({
				fileName: "",
				description: ""
			})
			setSending(false)
			setShowResult(false)
		}

		const f = target.files[0]
		if (f == undefined) {
			alert("No file selected")
			handleClickRefresh
		}
		else {
			fileReader = new FileReader()
			fileReader.fileName = f.name
			fileReader.onload = (readerEvt: any) => {
				const file_name = readerEvt.target.fileName;
				const content = fileReader.result;
				if (file_name && content) {
					setFileCache({
						fileName: file_name,
						description: content
					})
				}
			}
			fileReader.readAsBinaryString(f)
		}
	}

	const handleSendFile = async (e: any) => {
		e.preventDefault()

		const data = {
			yaml_file: fileCache.description,
			description: fileCache.fileName,
		}

		const config = {
			onUploadProgress: (progressEvent: any) => {
				setSending(true)
				let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				console.log('percentCompleted', percentCompleted)
				if (percentCompleted == 100) {
					setSending(false)
				}
			},
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + token,
			}
		}

		const sendFile = async () => {
			await axios
				.post(
					API_ADMIN_MANAGE_ALL_RULES,
					data,
					config
				)
				.then(() => {
					setShowResult(true)
					console.log("success")
				})
				.catch((err: any) => {
					if (err.response) {
						console.log(err.response.data)
						alert(JSON.stringify(err.response.data.message))
					}
				})
		}
		await sendFile()
	}

	const handleDisplaySender = (): any => {
		if (hasFile) {
			if (!sending && !showResult) {
				return (<button
					onClick={(e) => {
						handleSendFile(e)
					}}>
					Send
				</button>)
			}
			if (!sending && showResult) {
				return (
					<CheckIcon className={classes.icon} />
				)
			}
		}
		return null
	}

	return (
		<>
			<Helmet>
				<title>
					{ } | {APP_TITLE}
				</title>
			</Helmet>
			<div className={classes.top}>
				<PageTitle title={ADMIN_MANAGE_ALL_RULES} />
				<Button className={classes.button} onClick={handleClickUpload}>{buttonText}</Button>
				<Button className={classes.button} onClick={handleClickRefresh}>Refresh</Button>
				{clickUpload ?
					<div className={classes.dropZone}>
						<input
							type='file'
							onChange={(e) => {
								handleFileRead(e.target)
							}}
							accept=".yml,.yaml"
						/>
						{handleDisplaySender()}
					</div>
					: null}
			</div>
			<div className={classes.dashboard}><RulesDashboard rules={rules} /></div>
		</>
	);
};

export default ManageAllRules;