import React from "react";
import { Modal, Button } from "@mui/material";

const InviteMemberModal = () => {
    return (
        <div>
            <Modal
                
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <h2 id="modal-modal-title">Invite a Member</h2>
                    <p id="modal-modal-description">Invite a member to join your house.</p>
                    <Button variant="contained">Invite</Button>
                </div>
            </Modal>
        </div>
    )
}


export default InviteMemberModal