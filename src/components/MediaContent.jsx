import React from "react";
import PropTypes from "prop-types";
import JsonLdUtils from "jsonld-utils";
import Constants from "../constants/Constants";

export default class MediaContent extends React.Component {
  render() {
    const mediaContent = JsonLdUtils.getJsonAttValue(
      this.props.question,
      Constants.HAS_MEDIA_CONTENT
    );
    if (!mediaContent) {
      return null;
    }
    return this._renderDangerously(mediaContent);
  }

  _renderDangerously(mediaContent) {
    if (Array.isArray(mediaContent)) {
      return (
        <div className="col-6">
          {mediaContent.map((src) => (
            <div
              key={"media-" + src}
              className="row embed-responsive-21by9 media-content-video-container mb-3"
            >
              {MediaContent.iframe(src)}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-6 embed-responsive-21by9 media-content-video-container mb-3">
            {MediaContent.iframe(mediaContent)}
          </div>
        </div>
      );
    }
  }

  static iframe(src) {
    return (
      <iframe src={src} className="embed-responsive-item" allowFullScreen />
    );
  }
}

MediaContent.propTypes = {
  question: PropTypes.object.isRequired,
};
