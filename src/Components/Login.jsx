import { Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext } from "react";
import { Link as RouterLink, Redirect, useHistory, useLocation } from "react-router-dom";
import * as yup from "yup";
import { ModalContext } from "../App";
import fl from "../img/fl.png";
import AuthenticationService from "../Services/AuthenticationService";
import useStyles from "./Utils/Style/useStyles";

const HTTP_UNAUTHORIZED = 401
const HTTP_TOKEN_EXPIRED = 498
const requiredFieldMsg = "Ce champ est requis"

export default function Login() {
    const {open} = useContext(ModalContext)
    const history = useHistory()
    const classes = useStyles()
    const location = useLocation()
    const initialValues = {
        email: location.state ? location.state.email : "",
        password: ""
    }

    const handleHttpError = (error, setFieldError, email) => {
        if (error.response) {
            if (error.response.status === HTTP_UNAUTHORIZED) {
                setFieldError("username", "L'adresse courriel ou le mot de passe sont erronés")
                setFieldError("password", "   ")
            } else if (error.response.status === HTTP_TOKEN_EXPIRED) {
                history.push("/passwordChange", {email: email})
            } else
                open()
        } else {
            open()
            console.error("Axios error: " + error)
        }
    }

    if (AuthenticationService.isUserLoggedIn())
        return <Redirect to="/dashboard/"/>
    else
        return <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100vh'}}
        >
            <Grid item xs={12} md={6} xl={3}>
                <Container component="main" maxWidth="sm" className={classes.container}>
                    <CssBaseline/>
                    <div className={classes.paper}>
                        <Avatar alt={"Logo"} src={fl} style={{width: 150, height: 150, marginTop: 25}}/>
                        <Typography variant="h1" className={classes.logo} style={{marginTop: 16}}>
                            LPLDGDSUPCEUPPPJ
                        </Typography>
                        <Typography variant="h2" className={classes.subtitle}>
                            La Platforme Logiciel de Gestion de Stage Ultime Pour Collèges et Universités Plus
                            Propulsé Par Java
                        </Typography>
                        <Typography component="h1" variant="h5">
                            Se connecter
                        </Typography>
                    </div>
                    <Divider className={classes.divider}/>
                    <Formik
                        onSubmit={async (values, {setFieldError}) =>
                            AuthenticationService.authenticate(values)
                                .then(() => history.push("/dashboard"))
                                .catch(error => handleHttpError(error, setFieldError, values.email))
                        }

                        validationSchema={yup.object()
                            .shape({
                                email: yup.string().trim().required(requiredFieldMsg),
                                password: yup.string().trim().required(requiredFieldMsg)
                            })}
                            validateOnBlur={false}
                            validateOnChange={false}
                            enableReinitialize={true}
                            initialValues={initialValues}
                        >
                        {({isSubmitting}) =>
                            <Form className={classes.form}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="email"
                                            id="email"
                                            variant="outlined"
                                            label="Adresse courriel"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="password"
                                            id="password"
                                            variant="outlined"
                                            label="Mot de passe"
                                            type={"password"}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                                <br/>
                                {isSubmitting && <LinearProgress/>}
                                <Button
                                    type={"submit"}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size={"large"}
                                    className={classes.submit}
                                    disabled={isSubmitting}
                                >
                                    Se connecter
                                </Button>
                            </Form>
                        }
                    </Formik>
                <Grid container justify="flex-end" className={classes.link}>
                    <Grid item>
                        <Link component={RouterLink} to={"/register"} variant="body2">
                            Vous n'avez pas de compte? S'inscrire
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    </Grid>
}
