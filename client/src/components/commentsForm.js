import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import { baseURL } from "../config.js";

const CommentsForm = (props) => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	const { loading, setLoading } = props;

	const [comments, setComments] = useState({
		commentAuthor: "",
		commentText: "",
	});

	const params = useParams();

	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			await axios
				.post(`${baseURL}/comments/` + params.id, {
					gameID: params.id,
					commentAuthor: comments.commentAuthor,
					commentText: comments.commentText,
				})
				.then((res) => {
					setLoading(true);
					console.log(res);
					setComments({
						commentAuthor: "",
						commentText: "",
					});
				});
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};
	useEffect(() => {
		if (loading) {
			setComments({
				commentAuthor: "",
				commentText: "",
			});
			setLoading(false);
		}
	}, [loading, setLoading]);
	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------

	const renderInputField = (label, value, onChange, height) => (
		<div className="d-flex form-floating ">
			<textarea
				type="text"
				onChange={onChange}
				name={label.toLowerCase()}
				value={value}
				className=
        "w-100 form-control"
				style={{height: `${height}`}}
			/>
			<label>{label}</label>
		</div>
	);

	return (
		<div>
			<form onSubmit={onSubmitHandler} className="row">
				<div className="col-8">
					{renderInputField(
						"Comment",
						comments.commentText,
						(e) => setComments({ ...comments, commentText: e.target.value }),
						`9vh`
					)}
				</div>

				<div className="col-4 text-center">
					{renderInputField(
						"Author",
						comments.commentAuthor,
						(e) => setComments({ ...comments, commentAuthor: e.target.value }),
						""
					)}
					<button type="submit" className="btn btn-secondary w-50 my-3">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default CommentsForm;
