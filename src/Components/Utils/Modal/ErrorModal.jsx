import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

export default function ErrorModal({isOpen, hide}) {
    return isOpen && <Dialog open={isOpen} onClose={hide}>
        <DialogTitle id="alert-dialog-title">{"Erreur réseau"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Erreur réseau: impossible de communiquer avec le serveur
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={hide} color="primary">
                J'ai compris
            </Button>
        </DialogActions>
    </Dialog>
}
