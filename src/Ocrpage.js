import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Button, TextField, Typography, CircularProgress, Container, Box, Modal, Card, CardContent } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PublishIcon from '@mui/icons-material/Publish';
import PreviewIcon from '@mui/icons-material/Preview';
import GetAppIcon from '@mui/icons-material/GetApp';
import jsPDF from 'jspdf';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { PDFDocument } from 'pdf-lib';
import './App.css'; // Ensure this file includes the CSS for animations
import { Link } from 'react-router-dom';
import eera from './assests/eera.png';

function Ocrpage() {
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [language, setLanguage] = useState('eng');
  const [removingIndex, setRemovingIndex] = useState(null);


  

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleScan = async () => {
    if (files.length > 0) {
      setLoading(true);
      let extractedTexts = [];
      try {
        for (const file of files) {
          const fileType = file.type;
          let extractedText = '';

          if (fileType === 'application/pdf') {
            const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
            const pages = pdfDoc.getPages();
            for (const page of pages) {
              const { textContent } = await page.getTextContent();
              extractedText += textContent.items.map((item) => item.str).join(' ') + '\n';
            }
          } else {
            const { data } = await Tesseract.recognize(file, language, {
              logger: (m) => console.log(m),
            });
            extractedText = data.text;
          }

          extractedTexts.push({ text: extractedText, fileName: file.name });
        }

        setTexts(extractedTexts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleCopy = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Text copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Text copied to clipboard');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handlePublish = (text, index) => {
    const noticeTitleMatch = text.match(/^(.*)\n/);
    const noticeTitle = noticeTitleMatch ? noticeTitleMatch[1].trim() : 'Untitled Notice';

    const date = '2024-08-02';

    const location = extractLocation(text);
    const lawyerName = extractLawyerName(text);
    const mobileNumber = extractMobileNumber(text);

    const noticeDescription = text.split('\n').slice(1).join(' ').trim();

    if (!noticeTitle || !date || !location || !lawyerName || !mobileNumber || !noticeDescription) {
      alert('All fields are required');
      return;
    }

    const apiEndpoint = 'http://localhost:8000/notices';

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notice_title: noticeTitle,
        notice_description: noticeDescription,
        date,
        location,
        lawyer_name: lawyerName,
        mobile_number: mobileNumber,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Successfully published:', data);
        setRemovingIndex(index); 
        setTimeout(() => {
          setTexts(texts.filter((_, i) => i !== index)); 
          setRemovingIndex(null);
        }, 1000); 
        alert('Notice published successfully');
      })
      .catch((error) => {
        console.error('Error publishing notice:', error);
        alert('Failed to publish notice');
      });
  };

  const extractLocation = (text) => {
    const locationPattern = /(?:Pune|Mumbai|Nagpur|Thane|Nashik|Maharashtra)/i;
    const locationMatch = text.match(locationPattern);
    return locationMatch ? locationMatch[0].trim() : 'No Location Provided';
  };

  const extractLawyerName = (text) => {
    const lawyerPattern = /(?:Adv\.|Advocate|Lawyer)\s*([\w\s.]+)/i;
    const lawyerMatch = text.match(lawyerPattern);
    return lawyerMatch ? lawyerMatch[1].trim() : 'No Lawyer Name Provided';
  };

  const extractMobileNumber = (text) => {
    const mobilePattern = /(?:Cell|Mobile|Number)\s*[:.]?\s*([\d\s]+)/i;
    const mobileMatch = text.match(mobilePattern);
    return mobileMatch ? mobileMatch[1].trim() : 'No Mobile Number Provided';
  };

  const handleOpen = (index) => {
    setEditableText(texts[index].text);
    setCurrentFileIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentFileIndex(null);
  };

  const handleSave = () => {
    let newTexts = [...texts];
    newTexts[currentFileIndex] = { ...newTexts[currentFileIndex], text: editableText };
    setTexts(newTexts);
    handleClose();
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = (text) => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(12);
    let y = margin;

    const plainText = text.replace(/<[^>]+>/g, '');
    const lines = doc.splitTextToSize(plainText, doc.internal.pageSize.width - 2 * margin);
    lines.forEach(line => {
      if (y + 10 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 10;
    });

    if (signaturePreview) {
      const img = new Image();
      img.src = signaturePreview;
      img.onload = () => {
        const imgWidth = img.width / 5;
        const imgHeight = img.height / 5;
        if (y + imgHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.addImage(img, 'PNG', margin, y, imgWidth, imgHeight);
        doc.save('notice.pdf');
      };
    } else {
      doc.save('notice.pdf');
    }
  };

  return (
    
    <Container maxWidth="md" className="mt-12 p-4 bg-white rounded-lg shadow-lg border border-yellow-500 pb-20">
      <Typography variant="h4" gutterBottom className="text-center mb-8" style={{fontWeight: 600 , textAlign:'left'}}>
        Scan Notice Here
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: 'image/*,application/pdf', multiple: true }}
          variant="outlined"
          fullWidth
          margin="normal"
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
          disabled={files.length === 0 || loading}
          fullWidth
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : 'Scan with OCR'}
        </Button>
        <br/>
        <Link to="/allnotice">
          <Button variant="contained" color="primary" className="px-4 py-2"  style={{marginTop:'50px'}}>
            View All Notice
          </Button>
        </Link>
      </Box>
      <Box className="mt-5 mb-5">
        {texts.map((item, index) => (
          <Card
            key={index}
            className={`mb-4 ${removingIndex === index ? 'fade-out' : ''}`} 
          >
            <CardContent>
              <Typography variant="h6">{item.fileName}</Typography>
              <TextField
                value={item.text}
                onChange={(e) => {
                  let newTexts = [...texts];
                  newTexts[index].text = e.target.value;
                  setTexts(newTexts);
                }}
                variant="outlined"
                multiline
                rows={10}
                fullWidth
                margin="normal"
              />
              <Box display="flex" justifyContent="space-between" className="mt-5 space-x-2">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCopy(item.text)}
                  startIcon={<ContentCopyIcon />}
                  className="px-4 py-2"
                >
                  Copy Text
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpen(index)}
                  startIcon={<PreviewIcon />}
                  className="px-4 py-2"
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePublish(item.text, index)} 
                  startIcon={<PublishIcon />}
                  className="px-4 py-2"
                >
                  Publish Notice
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownloadPDF(item.text)}
                  startIcon={<GetAppIcon />}
                  className="px-4 py-2"
                >
                  Download PDF
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto my-20 overflow-y-auto max-h-screen">
          <Typography variant="h6" gutterBottom>
            Edit Text
          </Typography>
          <ReactQuill
            value={editableText}
            onChange={setEditableText}
            theme="snow"
            className="mt-2 mb-4"
          />
          <Typography variant="h6" gutterBottom className="mt-5">
            Add Signature/Image:
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleSignatureChange}
            className="mt-2 mb-4"
          />
          {signaturePreview && (
            <img src={signaturePreview} id="signature-preview" alt="Signature Preview" className="mt-4" style={{ maxHeight: '100px', maxWidth: '100px' }} />
          )}
          <Box display="flex" justifyContent="flex-end" className="mt-5">
            <Button onClick={handleSave} variant="contained" color="primary" className="mr-2">
              Save
            </Button>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
 
  );
}

export default Ocrpage;
