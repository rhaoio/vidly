import React, { Component } from "react";

class Like extends Component {
  render() {
    let likeClasses = "fa fa-heart";
    if (!this.props.liked) likeClasses += "-o";

    return (
      <i
        onClick={this.props.onClick}
        style={{ cursor: "pointer" }}
        className={likeClasses}
        aria-hidden="true"
      />
    );
  }
}

export default Like;
