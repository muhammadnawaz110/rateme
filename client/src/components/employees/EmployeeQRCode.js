import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import qrious from 'qrious';
import { useState } from 'react';

function EmployeeQRCode({ employeeId, name}) {
    const [open, setOpen] = useState(false);
    const url = process.env.REACT_APP_BASE_URL + "employees/feedback/" + employeeId;

    const createQRCode = () => {
        setOpen(true);
        setTimeout(() => {
            const qr = new qrious({
                element: document.getElementById('qr-code'),
                value: url,
                size: 200,
                padding: 12
            });
            document.getElementById('download-qr-code').setAttribute('href', qr.toDataURL())
        }, 300)
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <IconButton onClick={createQRCode}> <QrCode2Icon /> </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {name} - QR Code
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center'}}>
                    <canvas id="qr-code"></canvas>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center'}}>
                    <Button component='a' id="download-qr-code" download={`${name} - qrcode.png`} variant='contanined'  >Downliad</Button>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EmployeeQRCode