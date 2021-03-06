import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  title: {
    textAlign: "left",
    flexBasis: "15%",
  },
  // form
  container: {
    display: "flex",
    flexWrap: "wrap",
    marginRight: 0,
  },
  form: {
    flexBasis: "85%",
  },
  textField: {
    minWidth: "12%",
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 20,
    marginTop: 10,
  },
  selectMenu: {
    color: "red",
  },
  search: {
    marginLeft: 10,
    display: "flex",
    height: 50,
    marginTop: 7,
  },

  searchSelect: {
    width: "30%",
  },

  input: {
    marginLeft: 8,
    height: 50,
  },

  iconButton: {
    padding: 10,
  },
});

class TopicsSearchAppBar extends Component {
  constructor(props) {
    super(props);

    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  handleMonthChange(event) {
    this.props.onSelectMonth(event.target.value);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <div className={classes.title}>
              <Typography variant="h6" id="tableTitle">
                Temes
              </Typography>
            </div>
            <div className={classes.form}>
              <form className={classes.container} noValidate>
                <TextField
                  id="month"
                  label="Mes"
                  type="month"
                  value={this.props.selectedMonth}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleMonthChange}
                />
              </form>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopicsSearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopicsSearchAppBar);
