import { Button, Input } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import MailOutlineSharpIcon from "@material-ui/icons/MailOutlineSharp";
import LockIcon from "@material-ui/icons/Lock";
import DoneIcon from "@material-ui/icons/Done";

var styles = {
  Icons: { color: 'blue', verticalAlign: 'middle', fontSize: '25px', marginRight: 10 },
  Inputs: {
    Color: 'black',
    backgroundColor: 'white',
    fontSize: '15px',
    '&:hover': {
      color: 'green !important',
    }
  },
  header: { Color: 'black', fontSize: '30px', fontWeight: 'normal' },
  buttons: { border: 'none', width: 'inherit', size: '15px', marginTop: '10px', marginBottom: '' },
  check: { color: "#0001" }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    color: "black",
    fontSize: "30px",
    backgroundColor: "#fff",
    "borderRadius": "20px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxWidth:"100%"
  };
}


// SignUp component so that client can create account using unique email(to avoid duplication in database).
function Signup({render,setrender}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [openSignup, setOpenSignup] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [emailVerify, setEmailVerify] = useState(null);
  const classes = useStyles();

  // For signup using diaplayName(not unique), email(unique) and password.
  const signup = (event) => {
    event.preventDefault();
    const user = {
      displayName: name,
      email: email,
      password: password,
    };
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOpenSignup(false);
    return fetch("http://localhost:8000/accounts/usersignup", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => { 
        localStorage.setItem("userinfo", JSON.stringify(data)); 
        setrender(222);
      });
  };

  // For backend validtion of email to check if email is already taken or not.
  const isPresentEmail = () => {
    return fetch("http://localhost:8000/accounts/verifyEmail",
      {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.json())
      .then((data) => { setEmailVerify(data.success);});
  }
  
  // For client side validation of different fields.
  var check = () => {
    isPresentEmail();
    if (name !== "" && emailVerify && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && password !== "" && confirmpassword !== "" && password === confirmpassword) {
      return false;
    }
    return true;
  }

  var checkEmail = () => {
    isPresentEmail();
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase()) && emailVerify) {
      return true;
    }
    return false;
  }

  var checkName = () => {
    if (name != "") {
      return true;
    }
    return false;
  }

  var checkPass = () => {
    if (password != "" && confirmpassword != "" && password == confirmpassword) {
      return true;
    }
    return false;
  }

  return (
    <>
      <Button className="authbtn"
        style={{ margin: "10px" }}
        variant="text"
        color="inherit"
        onClick={() => {
          setOpenSignup(true);
        }}
      >
        Sign Up
      </Button>

      <Modal
        open={openSignup}
        onClose={() => {
          setOpenSignup(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signin-form">
            <h1 className="header" style={styles.header}>
              Sign Up
            </h1>
            <div>
              <AccountCircleOutlinedIcon color="primary" style={styles.Icons} />
              <Input
                className="inputs"
                placeholder="Name"
                type="text"
                value={name}
                style={styles.Inputs}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              {
                checkName() ?
                  <DoneIcon style={{ "color": "green" }} />
                  :
                  <DoneIcon style={styles.check} />
              }
            </div>
            <div>
              <MailOutlineSharpIcon
                className="Icon"
                color="primary"
                style={styles.Icons}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                style={styles.Inputs}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {
                checkEmail() ?
                  <DoneIcon style={{ "color": "green" }} />
                  :
                  <DoneIcon style={styles.check} />
              }
            </div>
            <div>
              <LockIcon color="primary" style={styles.Icons} />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                style={styles.Inputs}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {
                checkPass() ?
                  <DoneIcon style={{ "color": "green" }} />
                  :
                  <DoneIcon style={styles.check} />
              }
            </div>
            <div>
              <LockIcon color="primary" style={styles.Icons} />
              <Input
                placeholder="Confirm Password"
                type="password"
                value={confirmpassword}
                style={styles.Inputs}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              {
                checkPass() ?
                  <DoneIcon style={{ "color": "green" }} />
                  :
                  <DoneIcon style={styles.check} />
              }
            </div>
            <Button
              style={styles.buttons}
              type="submit"
              width="inherit"
              color="primary"
              variant="contained"
              onClick={signup}
              disabled={check()}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default Signup;