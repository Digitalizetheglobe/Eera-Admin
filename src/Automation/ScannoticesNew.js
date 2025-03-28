import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Tesseract from "tesseract.js";
import { toast } from "react-hot-toast";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";

const ScannoticeNew = () => {
  const [file, setFile] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, complete
  const [processingTime, setProcessingTime] = useState(null);
  const [imageDetails, setImageDetails] = useState([]);
  const [ws, setWs] = useState(null);
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [selectedNewspaper, setSelectedNewspaper] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [SelectedCategory, setSelectedCategory] = useState("");
  const [adminName, setAdminName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState('eng');
  const [ocrResults, setOcrResults] = useState({});

  // Add newspaper list
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

  // Add cities list
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
    "Nellore", "Jammu", "Belgaum", "Mangalore", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Udaipur", "Davanagere", "Kozhikode", "Maheshtala",
    "Rajpur Sonarpur", "Kollam", "Bokaro", "South Dumdum", "Gopalpur", "Ahmednagar", "Rajahmundry", "Berhampur", "Tirupati", "Pondicherry", "Agartala",
    "Karnal", "Bihar Sharif", "Panipat", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Kakinada", "Bidhannagar", "Jharsuguda", "Bharuch",
    "Pali", "Satna", "Bilaspur", "Shimla", "Anantapur", "Nizamabad", "Hajipur", "Muzaffarnagar", "Bhagalpur", "Korba", "Rampur", "Etawah", "Sonipat",
    "Khandwa", "Alwar", "Tumkur", "Chittoor", "Sikar", "Rohtak", "Bardhaman", "Gandhinagar", "Bathinda", "Serampore", "Mehsana", "Hapur", "Anand",
    "Bulandshahr", "Raichur", "Sitapur", "Hindupur", "Farrukhabad", "Ongole", "Bijapur", "Mirzapur", "Jaunpur", "Siwan", "Bhuj", "Bhimavaram",
    "Krishnanagar", "Kumbakonam", "Rewa", "Kolar", "Shivpuri", "Chinsurah", "Chhapra", "Porbandar", "Dindigul", "Hoshangabad", "Kottayam", "Chandrapur",
    "Baranagar", "Darjeeling", "Motihari", "Nagaon", "Kharagpur", "Bettiah", "Kanchipuram", "Raigarh", "Palakkad", "Bongaigaon", "Deoghar", "Dibrugarh",
    "Guntur", "Faizabad", "Bishnupur", "Sambalpur", "Purnia", "Raiganj", "Karimnagar", "Nadiad", "Malda", "Tinsukia", "Bidar", "Sultanpur", "Munger",
    "Shillong", "Imphal", "Tezpur", "Kohima", "Dimapur"
  ];

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('wss://api.epublicnotices.in');

    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);

      switch (data.type) {
        case 'status':
          setUploadStatus('processing');
          setProgress(0);
          break;
        case 'progress':
          setProgress(50);
          break;
        case 'success':
          setProgress(100);
          setUploadStatus('complete');
          // Fetch updated images when processing is complete
          fetchNoticeImages();
          break;
        case 'error':
          setError(data.message);
          setUploadStatus('idle');
          setProgress(0);
          break;
        default:
          break;
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error. Please refresh the page.');
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    // Cleanup on component unmount
    return () => {
      websocket.close();
    };
  }, []);

  // Function to fetch notice images
  const fetchNoticeImages = async () => {
    try {
      const response = await fetch("https://api.epublicnotices.in/api/notice-images");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.message === "Notice images retrieved successfully" && result.images) {
        // Map the images to URLs and store details
        const noticeUrls = result.images.map(image =>
          `https://api.epublicnotices.in/${image.path.replace(/\\/g, "/")}`
        );
        setScreenshots(noticeUrls);
        setImageDetails(result.images);
        setUploadStatus('complete');
        setUploaded(true);

        // Start background OCR processing for each image
        noticeUrls.forEach(async (url, index) => {
          try {
            // Detect language first
            const language = await detectLanguage(url);

            // Run OCR with detected language
            const { data } = await Tesseract.recognize(url, language, {
              logger: (m) => console.log(m),
              tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\u0900-\u097F',
              tessedit_pageseg_mode: '1',
              tessjs_create_pdf: '0',
              tessjs_create_hocr: '0',
            });

            // Store OCR result
            setOcrResults(prev => ({
              ...prev,
              [index]: {
                text: data.text,
                language: language
              }
            }));
          } catch (error) {
            console.error(`OCR Error for image ${index}:`, error);
          }
        });
      } else {
        throw new Error(result.message || "No notices found.");
      }
    } catch (error) {
      console.error("Error fetching notice images:", error);
      setError(error.message || "Failed to fetch notice images.");
      setUploadStatus('idle');
    }
  };

  // Fetch images when component mounts
  useEffect(() => {
    fetchNoticeImages();
  }, []);

  // Add useEffect for fetching admin info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploaded(false);
      setError(null);
    } else {
      setError("Please select a valid PDF file.");
      setFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setError(null);
    setLoading(true);
    setUploadStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch("https://api.epublicnotices.in/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setUploadStatus('processing');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload success:", result);

      if (result.status === "success") {
        // After successful upload, fetch the notice images
        await fetchNoticeImages();
      } else {
        throw new Error(result.details || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Upload failed. Please try again.");
      setUploadStatus('idle');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      // Here you would typically make an API call to delete the image
      // For now, we'll just update the UI
      const newScreenshots = screenshots.filter((_, i) => i !== index);
      setScreenshots(newScreenshots);
    } catch (error) {
      console.error("Error removing image:", error);
      setError("Failed to remove image. Please try again.");
    }
  };

  // Update language detection function
  const detectLanguage = async (imageUrl) => {
    try {
      // First try with English since it's the most common
      const { data: engData } = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => console.log(m),
      });

      // Check for English text patterns
      const englishPattern = /^[A-Za-z0-9\s.,!?()\-'"]+$/;
      const englishLines = engData.text.split('\n').filter(line => line.trim());
      const englishLineCount = englishLines.filter(line => englishPattern.test(line)).length;
      
      // If more than 70% of lines are English, return English
      if (englishLineCount / englishLines.length > 0.7) {
        console.log("Detected English text");
        return 'eng';
      }

      // Try Marathi if not English
      const { data: marData } = await Tesseract.recognize(imageUrl, 'mar', {
        logger: (m) => console.log(m),
      });

      // Check for Marathi characters
      const marathiPattern = /[\u0900-\u097F]/;
      const marathiSpecificPattern = /[\u0915-\u0939\u0958-\u095F\u0966-\u096F\u0972-\u097F]/;

      if (marathiPattern.test(marData.text) && marathiSpecificPattern.test(marData.text)) {
        console.log("Detected Marathi text");
        return 'mar';
      }

      // Try Hindi if not Marathi
      const { data: hinData } = await Tesseract.recognize(imageUrl, 'hin', {
        logger: (m) => console.log(m),
      });

      // Check for Hindi characters
      const hindiPattern = /[\u0900-\u097F]/;
      const hindiSpecificPattern = /[\u0915-\u0939\u0958-\u095F\u0966-\u096F]/;

      if (hindiPattern.test(hinData.text) && hindiSpecificPattern.test(hinData.text)) {
        console.log("Detected Hindi text");
        return 'hin';
      }

      // If no specific script is detected, default to English
      console.log("Defaulting to English text");
      return 'eng';
    } catch (error) {
      console.error("Language detection error:", error);
      return 'eng'; // Default to English on error
    }
  };

  // Update handleImageClick function
  const handleImageClick = async (img) => {
    setSelectedImage(img);
    const index = screenshots.indexOf(img);

    // If OCR result exists, use it
    if (ocrResults[index]) {
      setDetectedLanguage(ocrResults[index].language);
      setExtractedText(ocrResults[index].text);
      return;
    }

    // If no pre-processed result, process now
    setOcrProcessing(true);
    try {
      const language = await detectLanguage(img);
      setDetectedLanguage(language);

      const { data } = await Tesseract.recognize(img, language, {
        logger: (m) => console.log(m),
        tessedit_char_whitelist: language === 'eng' 
          ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?()\-\'"'
          : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\u0900-\u097F',
        tessedit_pageseg_mode: '1',
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
      });

      setExtractedText(data.text);

      // Store the result for future use
      setOcrResults(prev => ({
        ...prev,
        [index]: {
          text: data.text,
          language: language
        }
      }));
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Failed to process image with OCR");
    } finally {
      setOcrProcessing(false);
    }
  };

  const handlePreview = (img) => {
    // Open image in new tab for full-size preview
    window.open(img, '_blank');
  };

  // Update handlePublish function
  const handlePublish = async (imageUrl, index) => {
    try {
      if (!selectedNewspaper || !selectedDate || !selectedCity || !SelectedCategory) {
        toast.error("Please fill all required fields");
        return;
      }

      // Use pre-processed OCR result if available
      let extractedText, language;
      if (ocrResults[index]) {
        extractedText = ocrResults[index].text;
        language = ocrResults[index].language;
      } else {
        // Process now if not pre-processed
        setOcrProcessing(true);
        language = await detectLanguage(imageUrl);
        const { data } = await Tesseract.recognize(imageUrl, language, {
          logger: (m) => console.log(m),
          tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\u0900-\u097F',
          tessedit_pageseg_mode: '1',
          tessjs_create_pdf: '0',
          tessjs_create_hocr: '0',
        });
        extractedText = data.text;
        setOcrProcessing(false);
      }

      // Split text into lines and process
      const lines = extractedText.split('\n').filter(line => line.trim());
      const noticeTitle = lines[0] || "Untitled Notice";
      const noticeDescription = lines.slice(1).join('\n').trim();

      // Extract additional information
      const lawyerName = extractLawyerName(extractedText);
      const mobileNumber = extractMobileNumber(extractedText);

      // Create FormData object
      const formData = new FormData();

      // Append text data
      formData.append("notice_title", noticeTitle);
      formData.append("notice_description", noticeDescription);
      formData.append("date", selectedDate);
      formData.append("location", selectedCity);
      formData.append("lawyer_name", lawyerName);
      formData.append("mobile_number", mobileNumber);
      formData.append("newspaper_name", selectedNewspaper);
      formData.append("SelectedCategory", SelectedCategory);
      formData.append("DataentryOperator", adminName);
      formData.append("selected_date", selectedDate);
      formData.append("language", language);

      // Convert image URL to blob and append
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      formData.append("notices_images", imageBlob, `notice_${index}.jpg`);

      // Log the data being sent
      console.log("Sending notice data:", {
        noticeTitle,
        noticeDescription,
        selectedDate,
        selectedCity,
        lawyerName,
        mobileNumber,
        selectedNewspaper,
        SelectedCategory,
        adminName,
        language
      });

      // Send to API
      const response = await fetch("https://api.epublicnotices.in/notices", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish notice");
      }

      const result = await response.json();
      toast.success("Notice published successfully!");

      // Remove the published notice from the list and its OCR result
      const newScreenshots = screenshots.filter((_, i) => i !== index);
      setScreenshots(newScreenshots);

      // Remove OCR result
      const newOcrResults = { ...ocrResults };
      delete newOcrResults[index];
      setOcrResults(newOcrResults);

      // Refresh the notice images
      await fetchNoticeImages();
    } catch (error) {
      console.error("Publish error:", error);
      toast.error(error.message || "Failed to publish notice");
      setOcrProcessing(false);
    }
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

  const resetUpload = () => {
    setFile(null);
    setScreenshots([]);
    setError(null);
    setUploaded(false);
    setProgress(0);
    setUploadStatus('idle');
    setProcessingTime(null);
  };

  const publishNotice = async (imageUrl, index, extractedText) => {
    try {
      // Split text into lines and process
      const lines = extractedText.split('\n').filter(line => line.trim());
      const noticeTitle = lines[0] || "Untitled Notice";
      const noticeDescription = lines.slice(1).join('\n').trim();

      // Create FormData object
      const formData = new FormData();

      // Append text data
      formData.append("notice_title", noticeTitle);
      formData.append("notice_description", noticeDescription);
      formData.append("date", selectedDate);
      formData.append("location", selectedCity);
      formData.append("newspaper_name", selectedNewspaper);
      formData.append("SelectedCategory", SelectedCategory);
      formData.append("DataentryOperator", adminName);
      formData.append("selected_date", selectedDate);

      // Convert image URL to blob and append
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      formData.append("notices_images", imageBlob, `notice_${index}.jpg`);

      // Get the authorization token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Send to API with authorization header
      const response = await fetch("https://api.epublicnotices.in/notices", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish notice");
      }

      const result = await response.json();
      
      // Show success toast with animation
      toast.success("Notice published successfully!", {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });

      // Close the modal with animation
      setSelectedImage(null);

      // Remove the notice with animation
      const noticeElement = document.querySelector(`[data-notice-index="${index}"]`);
      if (noticeElement) {
        noticeElement.style.transition = 'all 0.5s ease-out';
        noticeElement.style.opacity = '0';
        noticeElement.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          const newScreenshots = screenshots.filter((_, i) => i !== index);
          setScreenshots(newScreenshots);
          
          // Remove OCR result
          const newOcrResults = { ...ocrResults };
          delete newOcrResults[index];
          setOcrResults(newOcrResults);
        }, 500);
      }

      // Refresh the notice images after animation
      setTimeout(() => {
        fetchNoticeImages();
      }, 600);

    } catch (error) {
      console.error("Publish error:", error);
      toast.error(error.message || "Failed to publish notice", {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    EERA Automation e-Public Notice
                  </h1>
                  <p className="text-gray-600">
                    Upload your e-Paper PDF to extract and process public notices automatically.
                  </p>
                </div>
                {uploaded && (
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Upload New File
                  </button>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  disabled={loading || uploaded}
                />
                <label
                  htmlFor="fileInput"
                  className={`inline-flex items-center px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 ${file
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    } ${(loading || uploaded) && "opacity-50 cursor-not-allowed"}`}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {file ? file.name : "Choose PDF File"}
                </label>

                {file && !uploaded && (
                  <button
                    onClick={handleFileUpload}
                    className={`ml-4 inline-flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {loading ? "Processing..." : "Start Scanning"}
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {loading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Processing PDF...'}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {screenshots.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Detected Notices</h3>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {screenshots.length} notices found
                    </span>
                    <button
                      onClick={fetchNoticeImages}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Form fields for notice details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
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
                        />
                      )}
                    />
                  </div>
                  <div>
                    <TextField
                      type="date"
                      label="Edition Date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      options={cities}
                      getOptionLabel={(option) => option}
                      onChange={(event, value) => setSelectedCity(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select City"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Add Category Selection */}
                <div className="mb-6">
                  <TextField
                    select
                    label="Select Category"
                    value={SelectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    fullWidth
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="legal_notice">Legal Notice</option>
                    <option value="planning_applications">Planning Applications</option>
                    <option value="government_notice">Government Notice</option>
                    <option value="financial_notice">Financial Notice</option>
                    <option value="environmental_notice">Environmental Notice</option>
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      data-notice-index={index}
                      className="group relative border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={screenshot}
                        alt={`Notice ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleImageClick(screenshot)}
                          className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-all duration-300"
                          title="Preview Notice"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handlePublish(screenshot, index)}
                          disabled={ocrProcessing}
                          className="opacity-0 group-hover:opacity-100 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-all duration-300"
                          title="Publish Notice"
                        >
                          {ocrProcessing ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span>{imageDetails[index]?.filename}</span>
                          <span>{new Date(imageDetails[index]?.created).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
              {/* Fixed Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Notice Preview</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {imageDetails[screenshots.indexOf(selectedImage)]?.filename}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Detected Language: {detectedLanguage === 'mar' ? 'Marathi' :
                        detectedLanguage === 'hin' ? 'Hindi' : 'English'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePreview(selectedImage)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 flex items-center border border-blue-200 rounded-lg hover:bg-blue-50"
                      title="View full size"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected Notice"
                    className="w-full h-auto rounded-lg mb-6 max-h-[50vh] object-contain"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handlePreview(selectedImage)}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-300"
                      title="View full size"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* OCR Processing Status */}
                {ocrProcessing && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-gray-600">Processing image with OCR...</span>
                  </div>
                )}

                {/* Extracted Text */}
                {extractedText && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Extracted Text:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{extractedText}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    <p>Created: {new Date(imageDetails[screenshots.indexOf(selectedImage)]?.created).toLocaleString()}</p>
                    <p>Size: {(imageDetails[screenshots.indexOf(selectedImage)]?.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePreview(selectedImage)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Size
                    </button>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-6 border-t bg-white">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      publishNotice(
                        selectedImage,
                        screenshots.indexOf(selectedImage),
                        extractedText
                      )
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publish Notice
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScannoticeNew;
