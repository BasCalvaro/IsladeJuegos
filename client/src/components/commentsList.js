import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import { baseURL } from "../config.js";

const CommentsList = (props) => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	const { loading, setLoading } = props;

	const [comments, setComments] = useState();

	const params = useParams();

	const getAllComments = useCallback(async () => {
		await axios.get(`${baseURL}/comments/` + params.id).then((res) => {
      console.log(res.data.data)
			setComments(res.data.data);
			setLoading(false);
		});
	}, [setLoading]);

	useEffect(() => {
		if (loading) {
			getAllComments();
		}
	}, [loading, getAllComments]);
	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------

	return (
		<div>
			<ul className="list-group list-group-flush">
				{comments &&
					comments
          .filter((comment) => comment.gameID === params.id)
          .map((comment, index) => {
						return (
							<li
								key={index}
								className="list-group-item align-items-center m-2"
							>
									<h5 className="pb-2">{comment.commentAuthor}:</h5>
                  <div>{comment.commentText}</div>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

export default CommentsList;
