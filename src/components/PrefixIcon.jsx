import React from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import Vocabulary from "../constants/Vocabulary.js";

class PrefixIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prefixes: props.prefixes,
    };
  }

  render() {
    const p = (
      <Popover id="prefixes" title="Prefixes">
        <ListGroup>
          {this.state.prefixes
            .sort((l, r) => {
              const res = l[Vocabulary.PREFIX] < r[Vocabulary.PREFIX];
              if (res) return -1;
              return 1;
            })
            .map((p) => (
              <ListGroupItem key={p[Vocabulary.PREFIX]}>
                <strong>{p[Vocabulary.PREFIX]}</strong>:{" "}
                {p[Vocabulary.NAMESPACE]}
              </ListGroupItem>
            ))}
        </ListGroup>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="right" overlay={p}>
        <span className={this.props.iconClass}>{this.props.children}</span>
      </OverlayTrigger>
    );
  }
}

PrefixIcon.propTypes = {
  prefixes: PropTypes.array.isRequired,
  children: PropTypes.element.isRequired,
  iconClass: PropTypes.string,
};

PrefixIcon.defaultProps = {
  iconClass: "",
};

export default PrefixIcon;
