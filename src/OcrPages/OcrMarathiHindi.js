import React, { useState } from "react";
import Tesseract from "tesseract.js";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PublishIcon from "@mui/icons-material/Publish";
import PreviewIcon from "@mui/icons-material/Preview";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar1/Navbar1";
import upload from "../assests/icons/Upload icon.png";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function OcrMarathiHindi() {
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("mar");
  const [removingIndex, setRemovingIndex] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [open, setOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
      
    if (selectedLanguage === "eng") {
      navigate("/scannotice"); 
    }
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

  const handleOpen = (index) => {
    setEditableText(texts[index].text);
    setCurrentFileIndex(index);
    setOpen(true);
  };


  const handlePublish = (text, index) => {
    // Extract notice title
    const noticeTitleMatch = text.match(/^(.*)\n/);
    const noticeTitle = noticeTitleMatch
      ? noticeTitleMatch[1].trim()
      : "Untitled Notice";

    // Get the current date in the format 'YYYY-MM-DD'
    const currentDate = new Date().toISOString().split("T")[0];

    // Extract location, lawyer name, and mobile number
    const location = extractLocation(text);
    const lawyerName = extractLawyerName(text);
    const mobileNumber = extractMobileNumber(text);

    // Extract notice description
    const noticeDescription = text.split("\n").slice(1).join(" ").trim();

    // Validation check
    if (
      !noticeTitle ||
      !currentDate ||
      !location ||
      !lawyerName ||
      !mobileNumber ||
      !noticeDescription
    ) {
      alert("All fields are required");
      return;
    }

    // API Endpoint   http://localhost:8082    http://api.epublicnotices.in
    const apiEndpoint = "http://api.epublicnotices.in/notices";

    // Post data to API
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      .then((response) => response.json())
      .then((data) => {
        console.log("Successfully published:", data);
        setRemovingIndex(index);
        setTimeout(() => {
          setTexts(texts.filter((_, i) => i !== index));
          setRemovingIndex(null);
        }, 1000);
        toast.success("Notice published successfully");
      })
      .catch((error) => {
        console.error("Error publishing notice:", error);
        toast.error("Failed to publish notice");
      });
  };

  const handleCopy = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Text copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Text copied to clipboard");
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };  

  const handleCancel = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      setTexts((prevTexts) => prevTexts.filter((_, i) => i !== index));
      setRemovingIndex(null);
      toast.success("Notice canceled successfully!");
    }, 500);
  };

  const extractLocation = (text) => {
    const locationPattern = /(?:Pune|Mumbai|Nagpur|Thane|Nashik|Maharashtra)/i;
    const locationMatch = text.match(locationPattern);
    return locationMatch ? locationMatch[0].trim() : "No Location Provided";
  };

  const extractLawyerName = (text) => {
    const lawyerPattern = /(?:Adv\.|Advocate|Lawyer)\s*([\w\s.]+)/i;
    const lawyerMatch = text.match(lawyerPattern);
    return lawyerMatch ? lawyerMatch[1].trim() : "No Lawyer Name Provided";
  };

  const extractMobileNumber = (text) => {
    const mobilePattern = /(?:Cell|Mobile|Number)\s*[:.]?\s*([\d\s]+)/i;
    const mobileMatch = text.match(mobilePattern);
    return mobileMatch ? mobileMatch[1].trim() : "No Mobile Number Provided";
  };

  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />{" "}

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col mt-20">

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
             
                Upload Your Notice
                
              </h1>
              <Link to='/manualadd'>
              <button className="bg-[#004B80] text-white px-4 py-2 rounded hover:bg-[#00365D]">
              Add Notice Manually
              </button>
              </Link>
            </div>
           
            <Container
              maxWidth="md"
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            >
              {/* <Typography
                variant="h4"
                gutterBottom
                className="text-center mb-8"
                style={{ fontWeight: 600, fontSize: "27px" }}
              >
                Scan Marathi/Hindi Notices
              </Typography> */}

              <div className="mb-4">
                <img
                  src={upload}
                  alt="Upload"
                  className="mx-auto w-16 mb-4 cursor-pointer"
                />
                <p className="font-semibold text-[#001A3B99]">
                  Drag & drop files or click the button below to browse
                </p>
              </div>

              <Box component="form" noValidate autoComplete="off">
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{
                    accept: "image/*,application/pdf",
                    multiple: true,
                  }}
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
                  <option value="eng">English</option>
                </TextField>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleScan}
                  disabled={files.length === 0 || loading}
                  fullWidth
                  sx={{
                    backgroundColor: "#004B80",
                    color: "#fff !important",
                    px: 4,
                    py: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#00365D",
                    },
                    mt: 2,
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Scan with OCR"}
                </Button>
                <br />
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    // marginTop: "50px",
                  }}
                >
                  <Link to="/all-notice">
                    <button
                      className=" px-4 py-2 bg-[#A99067] text-white border py-2 rounded "
                      style={{ marginRight: "10px" }}
                    >
                      View All Notice
                    </button>
                  </Link>

                  {/* <Link to="/scan-notices">
                    <button className="px-4 py-2 mt-4 hover:bg-[#A99067] text-[#A99067] hover:text-white border py-2 rounded border border-[#A99067]">
                      Scan English Notice
                    </button>
                  </Link> */}
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
                        onClick={() => handlePublish(item.text, index)}
                        disabled={removingIndex === index}
                        className="px-4 py-2"
                          sx={{
                            backgroundColor: "#004B80",
                            color: "#fff !important",
                            px: 4,
                            py: 1,
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "#00365D",
                            },
                            mt: 2,
                            ml: 2,
                          }}
                      >
                        {removingIndex === index ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Publish Notice"
                        )}
                      </Button>
                     
                      <Button
                          onClick={() => handleCopy(item.text)}
                          startIcon={<ContentCopyIcon />}
                          className="px-4 py-2"
                          sx={{
                            backgroundColor: "#004B80",
                            color: "#fff !important",
                            px: 4,
                            py: 1,
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "#00365D",
                            },
                            mt: 2,
                            ml: 2,
                          }}
                        >
                          Copy Text
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(index)}
                          startIcon={<PreviewIcon />}
                          className="px-4 py-2"
                          sx={{
                            backgroundColor: "#A99067",
                            color: "#fff !important",
                            px: 4,
                            py: 1,
                            borderRadius: "8px",
                            "&:hover": {
                              // backgroundColor: '#00365D',
                            },
                            mt: 2,
                            ml: 2,
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCancel(index)}
                        startIcon={<GetAppIcon />}
                        className="px-4 py-2"
                        sx={{
                          backgroundColor: "transparent",
                          color: "red !important",
                          px: 4,
                          py: 1,
                          borderRadius: "8px",
                          borderColor: "red",
                          borderWidth: "2px",
                          "&:hover": {
                            backgroundColor: "red",
                            color: "#fff !important",
                          },
                          mt: 2,
                          ml: 2,
                        }}
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

export default OcrMarathiHindi;
