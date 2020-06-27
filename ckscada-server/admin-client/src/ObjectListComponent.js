import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { ObjectListModal } from "./ObjectListModal.js"

class ObjectListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: props.schema,
      objectlist: props.objectlist,
      row: []
    };
  }

  renderTableHead() {
    let header;
    let value = [];

    for (header in this.state["schema"]) {
      value.push(<th>{header}</th>);
    }
    return (
      <thead>
        <tr>{value}</tr>
      </thead>
    );
  }

  onModalShow(row) {
    console.log(row);
  }

  renderTableRow(row) {
    let value = [];
    let col;

    for (col in this.state.schema) {
      value.push(<td>{row[col]}</td>);
    }
    return (
      <tr
        onClick={() => {
          this.props.onModalShow();
          this.setState((state, props) => {
            return { row: row };
          });
        }}
      >
        {value}
      </tr>
    );
  }

  renderTableRows() {
    let row;
    let value = [];
    for (row in this.props.objectlist) {
      value.push(this.renderTableRow(this.props.objectlist[row]));
    }
    return <tbody>{value}</tbody>;
  }

  render() {

    if (this.props.show) {
      return (
        <div>
          <Table
            class="tableList"
            show="false"
            size="sm"
            striped
            bordered
            hover
            overflow
            variant="dark"
          >
            {this.renderTableHead()}
            {this.renderTableRows()}
          </Table>
          <ObjectListModal
            topic={this.props.topic}
            show={this.props.showModal}
            onHide={this.props.onModalHide}
            row={this.state.row}
            col={this.state.schema}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ObjectListComponent;
