import React, {useEffect, useRef, useState} from "react";
import QuestionComment from "../styles/icons/QuestionComment";
import {Overlay, Tooltip} from "react-bootstrap";
import CommentForm from "./CommentForm";

const clickOutsideRefHandler = (handler) => {
    const formRef = useRef(null);

    useEffect(() => {
        const eventHandler = (e) => {
            if (!formRef.current.contains(e.target)) {
                handler();
            }
        };

        document.addEventListener("mousedown", eventHandler);

        return () => {
            document.removeEventListener("mousedown", eventHandler)
        };
    });

    return formRef;
}

const QuestionCommentIcon = () => {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const formRef = clickOutsideRefHandler(() => {
        setShow(false);
    })

    return (
        <>
            <span ref={target} onClick={() => setShow(!show)}>
                <QuestionComment />
            </span>

            <Overlay target={target.current} show={show} placement="right">
                {(props) => (
                    <Tooltip id="comment-tooltip" {...props}>
                        <span ref={formRef}>
                            <CommentForm/>
                        </span>
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
}

export default QuestionCommentIcon;