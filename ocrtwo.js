import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Button, TextField, Typography, CircularProgress, Container, Box, Modal } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PublishIcon from '@mui/icons-material/Publish';
import PreviewIcon from '@mui/icons-material/Preview';
import GetAppIcon from '@mui/icons-material/GetApp';
import jsPDF from 'jspdf';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import './App.css';

function Ocrpage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [language, setLanguage] = useState('eng'); // Default language set to English

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleScan = () => {
    if (file) {
      setLoading(true);
      Tesseract.recognize(
        file,
        language, // Use selected language
        {
          logger: (m) => console.log(m),
        }
      ).then(({ data: { text } }) => {
        setText(text);
        setEditableText(text);
        parseText(text);
        setLoading(false);
      }).catch((error) => {
        console.error(error);
        setLoading(false);
      });
    }
  };

  const parseText = (text) => {
    // Example logic to parse text and find title and description based on keywords
    let lines = text.split('\n');
    let title = '';
    let description = '';

    lines.forEach((line) => {
      if (line.toLowerCase().includes('title')) {
        title = line.replace(/title/i, '').trim();
      } else {
        description += line + ' ';
      }
    });

    setTitle(title);
    setDescription(description.trim());
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Text copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      // Fallback method for copying text
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

  const handlePublish = () => {
    const apiEndpoint = 'http://your-api-endpoint/publish'; // Replace with your actual API endpoint

    const payload = {
      title: title,
      description: description,
      // Add other fields as needed
      signature,
    };

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Successfully published:', data);
        alert('Notice published successfully');
      })
      .catch((error) => {
        console.error('Error publishing notice:', error);
        alert('Failed to publish notice');
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setEditableText(editableText);
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(12);
    let y = margin;

    // Convert HTML to plain text for PDF
    const plainText = editableText.replace(/<[^>]+>/g, '');
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
    <Container maxWidth="2px" className="mt-12 p-4 bg-white rounded-lg shadow-lg">
      <Typography variant="h4" gutterBottom className="text-center mb-8">
        Daily Public Notice
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: 'image/*' }}
          variant="outlined"
          fullWidth
          margin="normal"
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
          disabled={!file || loading}
          fullWidth
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : 'Scan with OCR'}
        </Button>
      </Box>
      <Box className="mt-5 mb-4">
        <Typography variant="h6" gutterBottom>
          Language:
        </Typography>
        <TextField
          select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          fullWidth
        >
          <option value="eng">English</option>
          <option value="hin">Hindi</option>
          <option value="mar">Marathi</option>
        </TextField>
      </Box>
      <Typography variant="h6" gutterBottom className="mt-5 mb-4">
        Title:
      </Typography>
      <TextField
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        className="mb-5"
      />
      <Typography variant="h6" gutterBottom className="mt-5 mb-4">
        Description:
      </Typography>
      <TextField
        variant="outlined"
        multiline
        rows={10}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        className="mb-5"
      />
      <Box display="flex" justifyContent="space-between" className="mt-5 space-x-2">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCopy}
          startIcon={<ContentCopyIcon />}
          className="px-4 py-2"
        >
          Copy Text
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<PreviewIcon />}
          className="px-4 py-2"
        >
          Preview
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublish}
          startIcon={<PublishIcon />}
          className="px-4 py-2"
        >
          Publish Notice
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          startIcon={<GetAppIcon />}
          className="px-4 py-2"
        >
          Download PDF
        </Button>
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
