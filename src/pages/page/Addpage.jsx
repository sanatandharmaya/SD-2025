import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import TitleComponent from "../../components/form-components/Title";
import FileInputComponent from "../file-manager/components/FileInputComponent";
import LanguageDropDownComponent from "../../components/form-components/LanguageDropDown.component";
import notifyError from "../../components/toasts/Err.toast";
const Api = `${process.env.REACT_APP_SERVER}pages`;

function AddPage() {
	const [IsError, seterror] = useState(false);
	const [loading, setloading] = useState();
	// Fetch Categories and Subcategoeries
	function fetchcategory() {
		try {
			const Api1 = `${process.env.REACT_APP_SERVER}c/categories/in/Pages`;
			axios
				.get(Api1)
				.then((res) => {
					setloading(false);
					Setcat(res.data);
				})
				.catch((e) => {
					setloading(false);
				});
		} catch (error) {
			setloading(false);
		}
	}
	function fetchsubcategory(parent) {
		try {
			const Api2 = `${process.env.REACT_APP_SERVER}c/categories/sub/find/${parent}`;
			axios
				.get(Api2)
				.then((res) => {
					Setsubcat(res.data);
				})
				.catch((e) => {});
		} catch (error) {}
	}
	const [Langs, Setlangs] = useState([]);
	function fetchLanguages() {
		try {
			axios
				.get(`${process.env.REACT_APP_SERVER}languages/`)
				.then((res) => {
					Setlangs(res.data);
				})
				.catch((e) => {});
		} catch (error) {}
	}

	useEffect(() => {
		fetchcategory();
		fetchLanguages();
	}, []);
	const handleFileDelete = (arrayName, index) => {
		setPage((prevPage) => {
			const updatedArray = [
				...prevPage[arrayName].filter((e) => e !== index),
			];

			return {
				...prevPage,
				[arrayName]: updatedArray,
			};
		});
	};

	const [languages, setLanguages] = useState({});
	useEffect(() => {
		setPage({ ...Page, Availability: languages });
	}, [languages]);

	const navigate = useNavigate();
	const Model = {
		category: "",
		subcategory: "",
		pagestyle: "",
		cardstyle: "",
		status: "STATUS_INACTIVE",
		publish: "",
		cardcolor: "",
		cardShadow: "",
		shadowx: "",
		shadowy: "",
		shadowx1: "",
		shadowy1: "",
		shadowColor: "",
		blur: "",
		spread: "",
		title: "",
		image: "",
		innerimage: [],
		Availablity: [],
		Languages: [],
		defaultLanguage: "",
	};
	const [Page, setPage] = useState(Model);
	const inputHandler = (e) => {
		const { name, value } = e.target;
		setPage({ ...Page, [name]: value });
		console.log(Page);
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		if (Page.category === "" || Page.title === "") {
			const notify = () =>
				toast.error("Category and title required", {
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
			notify();
		} else {
			await axios
				.post(Api, Page)
				.then((res) => {
					console.log(res);
					navigate("/pages");
				})
				.catch((error) => console.log(error));
		}
	};
	let category = "";
	const [cat, setcat] = useState(category);

	const [SubCat, Setsubcat] = useState([]);
	const [Cat, Setcat] = useState([]);
	const Dropselect = (e) => {
		setPage({ ...Page, category: e.target.value });
		const matchedCategory = Cat.find(
			(category) => category.Name === e.target.value
		);
		fetchsubcategory(matchedCategory._id);
	};
	function setimage(name, value) {
		setPage({ ...Page, [name]: value });
	}

	async function pageRedirector(language) {
		if (
			Page.category === "" ||
			Page.title === "" ||
			Page.pagestyle === ""
		) {
			const notify = () =>
				toast.error("Pagestyle, title and categories required", {
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
			notify();
		} else {
			try {
				await axios
					.post(Api, Page)
					.then((res) =>
						navigate(`/pages/availability/${res.data._id}`)
					)
					.catch((e) => {
						notifyError("Unexpected error");
					});
			} catch (error) {
				notifyError("Unexpected error");
			}
		}
	}

	return (
		<div>
			<h1>Page / Add Page (Content)</h1>
			<div className="Card">
				<div className="drop-group">
					<div className="drop-col">
						{" "}
						<span className="drop-lable">Select Category</span>
						<select
							className="drop"
							name="category"
							value={Page.category}
							onChange={(e) => Dropselect(e)}>
							<option value="">------</option>
							{Cat.map((op, index) => {
								return (
									<option key={op.Name} value={op.Name}>
										{op.Name}
									</option>
								);
							})}
						</select>
					</div>
					<div className="drop-col">
						{" "}
						<span className="drop-lable">Select Sub Category</span>
						<select
							className="drop"
							onChange={inputHandler}
							value={Page.subcategory}
							name="subcategory">
							<option value="">------</option>
							{SubCat.map((op, index) => {
								return (
									<option key={op.Name} value={op.Name}>
										{op.Name}
									</option>
								);
							})}
						</select>
					</div>
					<div className="drop-col">
						{" "}
						<span className="drop-lable">Select Page Style</span>
						<select
							className="drop"
							value={Page.pagestyle}
							name="pagestyle"
							onChange={inputHandler}>
							<option value="">---------------</option>
							<option value="scripture">
								Page Style 1 (Scriptures)
							</option>
							<option value="aarti">Page Style 2 (Aarti)</option>
							<option value="temple">Page Style 3 (Temple)</option>
							<option value="extra">Page Style 4 (Extra)</option>
							<option value="blog">Page Style 5 (Blogs)</option>
							<option value="scripture2">
								Page Style 6 (Scriptures 2)
							</option>
						</select>
					</div>
					<div className="drop-col">
						{" "}
						<span className="drop-lable">Select Card Style</span>
						<select
							className="drop"
							value={Page.cardstyle}
							onChange={inputHandler}
							name="cardstyle">
							<option value="1">Style 1</option>
						</select>
					</div>
					<div className="drop-col">
						{" "}
						<span className="drop-lable">Page Status</span>
						<select
							className="drop"
							name="status"
							onChange={inputHandler}
							value={Page.status}>
							<option value="STATUS_ACTIVE">Active</option>
							<option value="STATUS_INACTIVE">Inactive</option>
						</select>
					</div>
					<div className="drop-col">
						{" "}
						<span className="drop-lable">Publish</span>
						<input
							type="datetime-local"
							name="publish"
							value={Page.publish}
							onChange={inputHandler}
						/>
					</div>
				</div>
			</div>
			<div className="Card">
				<h1>Card Style</h1>
				<div className="drop-group">
					<div className="drop-col">
						<span>Select Card Style</span>
						<select onChange={inputHandler} name="cardstyle">
							<option value="1">Style 1</option>
						</select>
					</div>
					<div className="drop-col">
						<span>Card Color</span>

						<input
							type="text"
							value={Page.cardcolor}
							name="cardcolor"
							onChange={inputHandler}
						/>
					</div>
					<div className="drop-col">
						<span>Card Shadow</span>
						<select
							onChange={inputHandler}
							value={Page.cardShadow}
							name="cardShadow">
							<option value="1">Yes</option>
							<option value="2">No</option>
						</select>
					</div>
					<div className="drop-2-col">
						<input
							type="text"
							name="shadowx"
							value={Page.shadowx}
							placeholder="x:"
							onChange={inputHandler}
						/>
						<input
							type="text"
							name="shadowy"
							placeholder="y:"
							value={Page.shadowy}
							onChange={inputHandler}
						/>
					</div>
					<div className="drop-col">
						<span>Shadow Color</span>
						<input
							type="text"
							name="shadowColor"
							value={Page.shadowColor}
							onChange={inputHandler}
						/>
					</div>
					<div className="drop-2-col">
						<input
							type="text"
							name="shadowx1"
							value={Page.shadowx1}
							placeholder="x:"
							onChange={inputHandler}
						/>
						<input
							type="text"
							name="shadowy1"
							value={Page.shadowy1}
							placeholder="y:"
							onChange={inputHandler}
						/>
					</div>
					<div className="drop-col">
						<span>Blur</span>
						<input
							type="text"
							name="blur"
							value={Page.blur}
							onChange={inputHandler}
						/>
					</div>
					<div className="drop-col">
						<span>Spread</span>
						<input
							type="text"
							name="spread"
							value={Page.spread}
							onChange={inputHandler}
						/>
					</div>
				</div>
			</div>
			<div className="Card">
				<h1>Admin</h1>

				{TitleComponent(Page.title, (e) =>
					setPage({ ...Page, title: e })
				)}
			</div>
			<div className="Card tablecard">
				<h1>Front Page Details</h1>
				<FileInputComponent
					title="Upload Image or add link"
					links={Page.image}
					onDelete={() => setPage({ ...Page, image: "" })}
					onAdd={(image) => setPage({ ...Page, image: image })}
					type={"single"}
				/>
			</div>
			<div className="Card tablecard">
				<h1>Inner Page Details</h1>
				<FileInputComponent
					title="Upload Image or add link"
					links={Page.innerimage}
					onDelete={(i) => handleFileDelete("innerimage", i)}
					onAdd={(image) => Page.innerimage.push(image)}
					type={"array"}
				/>
			</div>

			<div className="center mb-10">
				<button className="addButton" onClick={submitHandler}>
					Submit
				</button>
				<button className="addButton" onClick={pageRedirector}>
					Add Availability
				</button>
			</div>
			<ToastContainer />
		</div>
	);
}

export default AddPage;
