import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Autocomplete from "@mui/material/Autocomplete";

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
  const [selectedNewspaper, setSelectedNewspaper] = useState("");
  const [newcategory, setNewcategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [SelectedCategory, setSelectedCategory] = useState(""); // Initialize state

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
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


  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    //   /scannotice
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
    const noticeTitleMatch = text.match(/^(.*)\n/);
    const noticeTitle = noticeTitleMatch
      ? noticeTitleMatch[1].trim()
      : "Untitled Notice";
    const currentDate = new Date().toISOString().split("T")[0];
    const location = selectedCity;
    const lawyerName = extractLawyerName(text);
    const mobileNumber = extractMobileNumber(text);
    const noticeDescription = text.split("\n").slice(1).join(" ").trim();
    const selectedImage = files[index]; // Assuming `files` array contains the uploaded images

    if (
      !noticeTitle ||
      !currentDate ||
      !location ||
      !lawyerName ||
      !mobileNumber ||
      !noticeDescription ||
      !selectedNewspaper ||
      !selectedImage
    ) {
      alert("All fields are required");
      return;
    }

    const apiEndpoint = "https://api.epublicnotices.in/notices";
    const formData = new FormData();

    formData.append("notice_title", noticeTitle);
    formData.append("notice_description", noticeDescription);
    formData.append("date", currentDate);
    formData.append("location", location);
    formData.append("lawyer_name", lawyerName);
    formData.append("mobile_number", mobileNumber);
    formData.append("newspaper_name", selectedNewspaper);
    formData.append("notices_images", selectedImage);
    formData.append("DataentryOperator", adminName);
    formData.append("SelectedCategory", SelectedCategory);
    fetch(apiEndpoint, {
      method: "POST",
      body: formData,
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

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
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
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      SelectProps={{
                        native: true,
                      }}
                    // onChange={(e) => setNewcategory(e.target.value)}
                    // variant="outlined"
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
                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Select City */}
                  <div>
                    <TextField
                      select
                      label="Select City"
                      value={selectedCity} // Bind the state
                      onChange={(e) => setSelectedCity(e.target.value)} // Update state on change
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select City</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="chhatrapatisambhajinagar">Ch. Sambhaji Nagar</option>
                      <option value="solapur">Solapur</option>
                      <option value="kolhapur">Kolhapur</option>
                    </TextField>
                  </div>

                  {/* Edition Date */}
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

                  {/* Admin Name */}
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
                </div>
              </Box>

              <Box className="mt-5">
                {texts.map((item, index) => (
                  <Card key={index} className="mb-4">
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
