import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Box,
  Modal,
  Card,
  CardContent,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PublishIcon from "@mui/icons-material/Publish";
import PreviewIcon from "@mui/icons-material/Preview";
import GetAppIcon from "@mui/icons-material/GetApp";
import jsPDF from "jspdf";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { PDFDocument } from "pdf-lib";
import "../App.css";
import { Link } from "react-router-dom";
import eera from "../assests/eera.png";
import upload from "../assests/icons/Upload icon.png";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar1/Navbar1";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";


function Scannotices1() {
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");
  const [language, setLanguage] = useState("eng");
  const [removingIndex, setRemovingIndex] = useState(null);
  const navigate = useNavigate();
  const [newspaper, setNewspaper] = useState('');
  const [selectedNewspaper, setSelectedNewspaper] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [newcategory, setNewcategory] = useState("");
  const [SelectedCategory, setSelectedCategory] = useState(""); // Initialize state

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const [adminName, setAdminName] = useState("");


  const newspaperList = [
    "SAKAL", "LOKMAT", "LOKSATTA", "MAHARASHTRA TIMES", "KESARI", "PRABHAT",
    "PUNYA NAGARI", "TIMES OF INDIA", "PUDHARI", "SANDHYAANAD", "AJ KA ANANAD",
    "SAMANA", "SAKALTIMES", "NAVAKAL", "TARUN BHARAT", "DINKAR", "BHASKAR",
    "DESHDUT", "PRAHAR", "THE HINDU", "DAINIK JAGRAN", "NAVBHARAT TIMES",
    "PUNE MIRROR", "MID DAY", "MAHANAGARI", "TELEGRAPH", "DECCAN HERALD",
    "DIVYA BHASKAR", "MUMBAI MIRROR", "ECONOMIC TIMES", "INDIAN EXPRESS",
    "NATIONAL HERALD", "HINDUSTAN", "VIR ARJUN", "BANDE MATARAM", "QUAMI AWAJ",
    "INDIAN POST", "NORTHERN INDIA PATRIKA", "DAILY TELEGRAM", "PUNJAB KESARI",
    "NAVODAY", "DNA", "ARUNACHAL FRONT", "MIRROR", "THE FREE SPACE JOURNAL",
    "STAR OF MYSORE", "GUJRAT SAMACHAR", "GUJARAT MITRA", "KASHMIR TIMES", "ORISSA POST"
  ];

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow",
    "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar",
    "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah", "Gwalior", "Jabalpur", "Coimbatore",
    "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Chandigarh", "Guwahati", "Solapur", "Hubballi-Dharwad", "Bareilly",
    "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar",
    "Salem", "Mira-Bhayandar", "Warangal", "Thiruvananthapuram", "Bhiwandi", "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida", "Jamshedpur",
    "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", "Kolhapur", "Ajmer",
    "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Sangli", "Satara", "Akola", "Jalgoan", "Nagar", "New Delhi", "Goa", "Nanded", "Dhule",
    "Nellore",
    "Jammu",
    "Belgaum",
    "Mangalore",
    "Ambattur",
    "Tirunelveli",
    "Malegaon",
    "Gaya",
    "Udaipur",
    "Davanagere",
    "Kozhikode",
    "Maheshtala",
    "Rajpur Sonarpur",
    "Kollam",
    "Bokaro",
    "South Dumdum",
    "Gopalpur",
    "Ahmednagar",
    "Rajahmundry",
    "Berhampur",
    "Tirupati",
    "Pondicherry",
    "Agartala",
    "Karnal",
    "Bihar Sharif",
    "Panipat",
    "Darbhanga",
    "Bally",
    "Aizawl",
    "Dewas",
    "Ichalkaranji",
    "Kakinada",
    "Bidhannagar",
    "Jharsuguda",
    "Bharuch",
    "Pali",
    "Satna",
    "Bilaspur",
    "Shimla",
    "Anantapur",
    "Nizamabad",
    "Hajipur",
    "Muzaffarnagar",
    "Bhagalpur",
    "Korba",
    "Rampur",
    "Etawah",
    "Sonipat",
    "Khandwa",
    "Alwar",
    "Tumkur",
    "Chittoor",
    "Sikar",
    "Rohtak",
    "Bardhaman",
    "Gandhinagar",
    "Bathinda",
    "Serampore",
    "Mehsana",
    "Hapur",
    "Anand",
    "Bulandshahr",
    "Raichur",
    "Sitapur",
    "Hindupur",
    "Farrukhabad",
    "Ongole",
    "Bijapur",
    "Mirzapur",
    "Jaunpur",
    "Siwan",
    "Bhuj",
    "Bhimavaram",
    "Krishnanagar",
    "Kumbakonam",
    "Rewa",
    "Kolar",
    "Shivpuri",
    "Chinsurah",
    "Chhapra",
    "Porbandar",
    "Dindigul", "Hoshangabad", "Kottayam", "Chandrapur", "Baranagar", "Darjeeling", "Motihari", "Nagaon", "Kharagpur", "Bettiah", "Kanchipuram", "Raigarh", "Palakkad", "Bongaigaon", "Deoghar", "Dibrugarh", "Guntur", "Faizabad", "Bishnupur", "Sambalpur", "Purnia", "Raiganj", "Karimnagar", "Nadiad", "Malda",
    "Tinsukia", "Bidar", "Sultanpur", "Munger", "Shillong", "Imphal", "Tezpur", "Kohima", "Dimapur"
  ]


  const handleNewspaperChange = (event) => {
    setNewspaper(event.target.value);
  };
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    if (selectedLanguage === "mar" || selectedLanguage === "hin") {
      navigate("/mar-hin-ocr");
    } else if (selectedLanguage === "eng") {
      navigate("/english-page"); // Replace with the correct route for English
    }
  };


  const handleScan = async () => {
    if (files.length > 0) {
      setLoading(true);
      let extractedTexts = [];
      try {
        for (const file of files) {
          const fileType = file.type;
          let extractedText = "";

          if (fileType === "application/pdf") {
            const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
            const pages = pdfDoc.getPages();
            for (const page of pages) {
              const { textContent } = await page.getTextContent();
              extractedText +=
                textContent.items.map((item) => item.str).join(" ") + "\n";
            }
          } else {
            const { data } = await Tesseract.recognize(file, language, {
              logger: (m) => console.log(m),
            });
            extractedText = data.text;
          }

          // Include the selected newspaper name
          // const prefixedText = `${selectedNewspaper ? `[${selectedNewspaper}] ` : ""}${extractedText}`;

          extractedTexts.push({ text: extractedText, fileName: file.name });
        }

        setTexts(extractedTexts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
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

  const handlePublish = (text, index) => {
    const noticeTitleMatch = text.match(/^(.*)\n/);
    const noticeTitle = noticeTitleMatch ? noticeTitleMatch[1].trim() : "Untitled Notice";
    const date = selectedDate;
    const location = selectedCity;
    const lawyerName = extractLawyerName(text);
    const mobileNumber = extractMobileNumber(text);
    const noticeDescription = text.split("\n").slice(1).join(" ").trim();

    if (!noticeTitle || !date || !location || !lawyerName || !mobileNumber || !noticeDescription) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("notice_title", noticeTitle);
    formData.append("notice_description", noticeDescription);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("lawyer_name", lawyerName);
    formData.append("mobile_number", mobileNumber);
    formData.append("newspaper_name", selectedNewspaper);
    formData.append("SelectedCategory", SelectedCategory); // Make sure this value is correctly passed
    formData.append("DataentryOperator", adminName); // Dataentry Operator
    formData.append("selected_date", selectedDate);
    // Append files
    files.forEach((file) => {
      formData.append("notices_images", file);
    });
    // https://api.epublicnotices.in/notices
    fetch("https://api.epublicnotices.in/notices", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Successfully published:", data);
        setRemovingIndex(index);
        setTimeout(() => {
          setTexts((prevTexts) => prevTexts.filter((_, i) => i !== index));
          setRemovingIndex(null);
        }, 1000);
        toast.success("Notice published successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error publishing notice:", error);
        toast.error("Failed to publish notice!", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };



  const extractLocation = (text) => {
    const locationPattern = /(?:Pune|Mumbai|Nagpur|Thane|Nashik|Maharashtra)/i;
    const locationMatch = text.match(locationPattern);
    // return locationMatch ? locationMatch[0].trim() : "No Location Provided";
    return "Pune";
  };

  const extractLawyerName = (text) => {
    const lawyerPattern = /(?:Adv\.|Advocate|Lawyer)\s*([\w\s.]+)/i;
    const lawyerMatch = text.match(lawyerPattern);
    // return lawyerMatch ? lawyerMatch[1].trim() : "No Lawyer Name Provided";
    return "Adv. Random Lawyer";
  };

  const extractMobileNumber = (text) => {
    const mobilePattern = /(?:Cell|Mobile|Number)\s*[:.]?\s*([\d\s]+)/i;
    const mobileMatch = text.match(mobilePattern);
    // return mobileMatch ? mobileMatch[1].trim() : "No Mobile Number Provided";
    return "9876543210";
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
    newTexts[currentFileIndex] = {
      ...newTexts[currentFileIndex],
      text: editableText,
    };
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

  const handleCancel = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      setTexts((prevTexts) => prevTexts.filter((_, i) => i !== index));
      setRemovingIndex(null);
      toast.success("Notice canceled successfully!");
    }, 500);
  };

  const handleDownloadPDF = (text) => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(12);
    let y = margin;

    const plainText = text.replace(/<[^>]+>/g, "");
    const lines = doc.splitTextToSize(
      plainText,
      doc.internal.pageSize.width - 2 * margin
    );
    lines.forEach((line) => {
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
        doc.addImage(img, "PNG", margin, y, imgWidth, imgHeight);
        doc.save("notice.pdf");
      };
    } else {
      doc.save("notice.pdf");
    }
  };
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        // https://api.epublicnotices.in
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get("https://api.epublicnotices.in/admin/admin-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminName(response.data.admin.full_name);
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    fetchAdminInfo();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Add the Toaster */}
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col mt-20">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Upload Your Notice</h1>
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
              <div className="mb-4">
                {/* Image triggers the file input click */}
                <img
                  src={upload}
                  alt="Upload"
                  className="mx-auto w-16 mb-4 cursor-pointer"
                // onClick={handleImageClick}
                />
                <p className="font-semibold text-[#001A3B99]">
                  Drag & drop files or click the button below to browse
                </p>
                {/* Hidden file input */}
                {/* <input
        ref={fileInputRef} 
        type="file"
         onChange={handleFileChange}
        inputProps={{ accept: 'image/*,application/pdf', multiple: true }}
        multiple
        style={{ display: "none" }} // Hide the file input
      /> */}
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


                {/* <TextField
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
                </TextField> */}

                {/* <TextField
                  select
                  label="Select News Paper"
                  value={newspaper}
                  onChange={handleNewspaperChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="selectnew">Times of India</option>
                  <option value="timesOfIndia">Times of India</option>
                  <option value="hindustanTimes">Hindustan Times</option>
                  <option value="dna">DNA</option>
                </TextField> */}

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
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
                  </div>

                  <div className="col-span-1">
                    <Autocomplete
                      options={newspaperList}
                      getOptionLabel={(option) => option}
                      onChange={(event, value) => setSelectedNewspaper(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Newspaper"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                      )}
                      filterSelectedOptions
                      clearOnEscape
                    />
                  </div>

                  <div className="col-span-1">
                    <TextField
                      select
                      label="Select Category"
                      value={SelectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)} // Update category state
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select Category</option> {/* Default empty option */}
                      <option value="legal_notice">Legal Notice</option>
                      <option value="planning_applications">Planning Applications</option>
                      <option value="government_notice">Government Notice</option>
                      <option value="financial_notice">Financial Notice</option>
                      <option value="environmental_notice">Environmental Notice</option>
                    </TextField>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Select City Field */}
                  <div>
                    < Autocomplete
                      options={cities}
                      getOptionLabel={(option) => option}
                      onChange={(event, value) => setSelectedCity(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Cities"
                          varient="outlined"
                          fullWidth
                          margin="normal"
                        />
                      )}
                      filterSelectedOptions
                      clearOnEscape
                    />
                  </div>

                  {/* Edition Date Field */}
                  <div>
                    <label className="block text-[#001A3B] mb-1">Edition Date</label>
                    <input
                      type="date"
                      name="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Admin Name Field */}
                  <div>
                    <TextField
                      label="Admin Name"
                      value={adminName} // `adminName` from state
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  </div>
                </div>



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

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link to="/all-notice">
                    <button
                      className="mt-4 px-4 py-2 bg-[#A99067] text-white border py-2 rounded"
                      style={{ marginRight: "10px" }}
                    >
                      View All Notice
                    </button>
                  </Link>
                </div>
              </Box>

              <Box className="mt-5 mb-5">
                {texts.map((item, index) => (
                  <Card
                    key={index}
                    className={`mb-4 ${removingIndex === index ? "fade-out" : ""}`}
                  >
                    <CardContent>
                      <Typography variant="h6">{item.fileName}</Typography>
                      <img
                        src={URL.createObjectURL(files[index])}
                        alt="Uploaded Preview"
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "16px"
                        }}
                      />
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
                      <Typography variant="body1">
                        Newspaper: {selectedNewspaper || "None"}
                      </Typography>
                      <Typography variant="body1">
                        Edition Date : {selectedDate || "None"}
                      </Typography>
                      <Typography variant="body1">
                        Selected City : {selectedCity || "None"}
                      </Typography>

                      <Typography variant="body1">
                        Selected category : {SelectedCategory || "None"}
                      </Typography>
                      <Typography variant="body1">
                        Dataentry Operator Name  : {adminName || "None"}
                      </Typography>


                      <Box display="flex" justifyContent="space-between" className="mt-5 space-x-2">
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
                          }}
                        >
                          Copy Text
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePublish(item.text, index)}
                          startIcon={<PublishIcon />}
                          className="px-4 py-2"
                          sx={{
                            backgroundColor: "transparent",
                            color: "#004B80 !important",
                            px: 4,
                            py: 1,
                            borderRadius: "8px",
                            borderColor: "#004B80",
                            borderWidth: "2px",
                            "&:hover": {
                              backgroundColor: "#f0f8ff",
                            },
                            mt: 2,
                          }}
                        >
                          Publish Notice
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
                          }}
                        >
                          Cancel
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureChange}
                    className="mt-2 mb-4"
                  />
                  {signaturePreview && (
                    <img
                      src={signaturePreview}
                      id="signature-preview"
                      alt="Signature Preview"
                      className="mt-4"
                      style={{ maxHeight: "100px", maxWidth: "100px" }}
                    />
                  )}
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    className="mt-5"
                  >
                    <Button
                      onClick={handleSave}
                      variant="contained"
                      color="primary"
                      className="mr-2"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

export default Scannotices1;
