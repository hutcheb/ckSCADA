import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { ObjectListModal } from "./ObjectListModal.js"

class ObjectListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.setModalShow = this.setModalShow.bind(this);

    this.state = {
      row: [],
      show: false,
      modalShow: false
    };
  }

  setModalShow(status) {
    this.setState({ modalShow: status });
  }

  setShow(status) {
    this.setState({ show: status });
  }

  renderTableHead() {
    let header;
    let value = [];

    for (header in this.state.schema) {
      value.push(<th>{header}</th>);
    }
    return (
      <thead>
        <tr>{value}</tr>
      </thead>
    );
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
          this.setModalShow(true);
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
    if (this.state.show) {
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
            topic={this.state.topic}
            show={this.state.modalShow}
            onHide={this.setModalShow}
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
