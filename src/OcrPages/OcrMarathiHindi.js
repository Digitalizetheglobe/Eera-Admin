import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Button, TextField, Typography, CircularProgress, Container, Box, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

function OcrMarathiHindi() {
    const [files, setFiles] = useState([]);
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('mar'); 
    const [removingIndex, setRemovingIndex] = useState(null);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleScan = async () => {
        if (files.length > 0) {
            setLoading(true);
            let extractedTexts = [];
            try {
                for (const file of files) {
                    const { data } = await Tesseract.recognize(file, language, {
                        logger: (m) => console.log(m),
                    });
                    extractedTexts.push({ text: data.text, fileName: file.name });
                }
                setTexts(extractedTexts);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    const handlePublish = (text, index) => {
        // Extract notice title
        const noticeTitleMatch = text.match(/^(.*)\n/);
        const noticeTitle = noticeTitleMatch ? noticeTitleMatch[1].trim() : 'Untitled Notice';

        // Get the current date in the format 'YYYY-MM-DD'
        const currentDate = new Date().toISOString().split('T')[0];

        // Extract location, lawyer name, and mobile number
        const location = extractLocation(text);
        const lawyerName = extractLawyerName(text);
        const mobileNumber = extractMobileNumber(text);

        // Extract notice description
        const noticeDescription = text.split('\n').slice(1).join(' ').trim();

        // Validation check
        if (!noticeTitle || !currentDate || !location || !lawyerName || !mobileNumber || !noticeDescription) {
            alert('All fields are required');
            return;
        }

        // API Endpoint
        const apiEndpoint = 'http://api.epublicnotices.in/notices';

        // Post data to API
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notice_title: noticeTitle,
                notice_description: noticeDescription,
                date: currentDate,
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

    return (
        <Container maxWidth="md" className="mt-12 p-4 bg-white rounded-lg shadow-lg">
            <Typography variant="h4" gutterBottom className="text-center mb-8" style={{ fontWeight: 600 }}>
                Scan Marathi/Hindi Notices
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
                <TextField
                    select
                    label="Select Language"
                    value={language}
                    onChange={handleLanguageChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="mar">Marathi</option>
                    <option value="hin">Hindi</option>
                </TextField>

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
                <br />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <Link to="/all-notice">
                        <Button variant="contained" color="primary" className="px-4 py-2" style={{ marginRight: '10px' }}>
                            View All Notice
                        </Button>
                    </Link>

                    <Link to="/scan-notices">
                        <Button variant="contained" color="primary" className="px-4 py-2">
                            Scan English Notice
                        </Button>
                    </Link>
                </div>

            </Box>

            <Box className="mt-5">
                {texts.map((item, index) => (
                    <Card key={index} className="mb-4">
                        <CardContent>
                            <Typography variant="h6">{item.fileName}</Typography>
                            <TextField
                                value={item.text}
                                variant="outlined"
                                multiline
                                rows={10}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handlePublish(item.text, index)}
                                disabled={removingIndex === index}
                            >
                                {removingIndex === index ? <CircularProgress size={24} /> : 'Publish Notice'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}

export default OcrMarathiHindi;
