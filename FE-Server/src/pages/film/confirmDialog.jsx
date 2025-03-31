import React from 'react';
import styled from 'styled-components';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <DialogOverlay>
            <DialogBox>
                <Message>{message}</Message>
                <ButtonContainer>
                    <CancelButton onClick={onCancel}>Cancel</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
                </ButtonContainer>
            </DialogBox>
        </DialogOverlay>
    );
};

export default ConfirmDialog;

const DialogOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const DialogBox = styled.div`
    background: white;
    padding: 20px;
    border-radius: 5px;
`;

const Message = styled.p`
    margin-bottom: 20px;
    color:black;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Button = styled.button`
    margin-left: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const CancelButton = styled(Button)`
    background-color: #ccc;
`;

const ConfirmButton = styled(Button)`
    background-color: #f44336;
    color: white;
`;
