import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import qrious from 'qrious';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

function ScanQRCode({ employeeId, name}) {
    const [open, setOpen] = useState(false);
    const navigator = useNavigate();


  

    const handleClose = () => {
        setOpen(false);
    };

    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        if(decodedText.includes('employee/feedback'))
        {
            let url = decodedText.replace(process.env.REACT_APP_BASE_URL, '/')
            navigator(url)
        }
      }

      function onScanFailure(error) {}
      
      const scanQrCode = () => {
        setOpen(true)
        setTimeout(() => {

            let html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } }, false);
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }, 300);
    }

    return (
        <>

            <Button sx={{ mx: 2}} variant='contained' startIcon={<QrCode2Icon />} onClick={scanQrCode} color="primary"> scan QR Code </Button>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    scan Employee QR code
                </DialogTitle>
                
                <DialogContent sx={{ textAlign: "center" }}>
                    <div id="reader" width="1000px"></div>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center'}}>
            
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ScanQRCode