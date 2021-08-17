import React from "react";
import QuestionComment from "../styles/icons/QuestionComment";
import {Overlay, Tooltip} from "react-bootstrap";
import CommentForm from "./CommentForm";
import SubmittedComment from "./SubmittedComment";
import {ConfigurationContext} from "../contexts/ConfigurationContext";

class QuestionCommentIcon extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.target = React.createRef();
        this.state = {
            show: false,
            currentUserLabel: '',
            timestamp: '',
            commentValue: ''
        }
    }

    getCurrentUserLabel() {
        const users = this.context.options.users;
        const currentUser = this.context.options.currentUser;

        const currentUserId = users.find(c => c.id === currentUser);
        this.setState({
            currentUserLabel: currentUserId.label
        })
    }

    getTimeStamp() {
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const dateReformatted = (date.getDate()+
            "/"+(date.getMonth()+1)+
            "/"+date.getFullYear()+
            " "+date.getHours()+
            ":"+date.getMinutes()+
            ":"+date.getSeconds());
        this.setState({
            timestamp: dateReformatted
        })
    }

    handleStateShow() {
        this.setState(prevState => {
            return {
                show: !prevState.show
            }
        })
    }

    renderComments() {
        if (this.state.commentValue) {

            return <SubmittedComment
                timestamp={this.state.timestamp}
                currentUserLabel={this.state.currentUserLabel}
                commentValue={this.state.commentValue}
            />
        } else {
            return <SubmittedComment
                timestamp={this.state.timestamp}
                currentUserLabel={this.state.currentUserLabel}
                commentValue={this.state.commentValue}
            />
        }
    }

    // TODO: add commentValue && save state of comments
    render() {
        return (
            <>
            <span ref={this.target} onClick={() => {
                this.handleStateShow();
                this.getCurrentUserLabel();
                this.getTimeStamp();
            }}>
                <QuestionComment />
            </span>

                <Overlay target={this.target.current} show={this.state.show} placement="right">
                    {(props) => (
                        <Tooltip id="comment-tooltip" {...props}>
                        <span ref={this.formRef} onClick={() => this.getTimeStamp()}>
                            <CommentForm/>
                            <br/>
                            {this.renderComments()}
                        </span>
                        </Tooltip>
                    )}
                </Overlay>
            </>
        );
    }
}

QuestionCommentIcon.contextType = ConfigurationContext

export default QuestionCommentIcon;