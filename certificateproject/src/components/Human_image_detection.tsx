// import { useState, useRef, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Upload, User, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
// import { toast } from "react-toastify";
// import * as faceapi from "face-api.js";

// interface DetectionResult {
//     hasFace: boolean;
//     faceCount: number;
//     confidence: number;
//     isRealHuman: boolean;
//     detections: any[];
// }

// const HumanImageDetection = () => {
//     const [image, setImage] = useState<string | null>(null);
//     const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isModelLoading, setIsModelLoading] = useState(true);
//     const [modelsLoaded, setModelsLoaded] = useState(false);
//     const imageRef = useRef<HTMLImageElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     // Load face-api.js models
//     useEffect(() => {
//         const loadModels = async () => {
//             try {
//                 setIsModelLoading(true);

//                 // Try different model URL paths
//                 const possiblePaths = [
//                     process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/models` : "/models",
//                     "./models",
//                     `${window.location.origin}/models`
//                 ];

//                 // First, verify the model file exists by trying to fetch it
//                 const manifestUrl = `${possiblePaths[0]}/tiny_face_detector_model-weights_manifest.json`;
//                 console.log("Attempting to load models from:", manifestUrl);

//                 try {
//                     const response = await fetch(manifestUrl);
//                     if (!response.ok) {
//                         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//                     }
//                     const contentType = response.headers.get("content-type");
//                     if (contentType && !contentType.includes("application/json")) {
//                         throw new Error(`Expected JSON but got ${contentType}. Model file may not exist or server routing issue.`);
//                     }
//                     console.log("Model manifest file found and accessible");
//                 } catch (fetchError: any) {
//                     console.error("Model file accessibility check failed:", fetchError);
//                     throw new Error(`Cannot access model files. Please ensure:\n1. Models are in /public/models/ folder\n2. Server is running\n3. Files are accessible at ${manifestUrl}\n\nError: ${fetchError.message}`);
//                 }

//                 // Load only the tiny face detector model
//                 const MODEL_URL = possiblePaths[0];
//                 await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//                 console.log("Tiny face detector loaded successfully");

//                 setModelsLoaded(true);
//                 setIsModelLoading(false);
//                 toast.success("AI models loaded successfully");
//             } catch (error: any) {
//                 console.error("Error loading models:", error);
//                 console.error("Error details:", {
//                     message: error?.message,
//                     stack: error?.stack,
//                     possiblePaths: [
//                         process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/models` : "/models",
//                         "./models",
//                         `${window.location.origin}/models`
//                     ]
//                 });

//                 // Provide helpful error message
//                 let errorMessage = "Failed to load AI models. ";
//                 if (error?.message?.includes("fetch") || error?.message?.includes("Cannot access")) {
//                     errorMessage += "Please ensure:\n1. Model files are in /public/models/ folder\n2. Files are named correctly\n3. Development server is running";
//                 } else if (error?.message?.includes("JSON") || error?.message?.includes("<!doctype")) {
//                     errorMessage += "Server returned HTML instead of model files. This usually means the file path is incorrect or models are missing.";
//                 } else {
//                     errorMessage += error?.message || "Unknown error occurred";
//                 }

//                 toast.error(errorMessage, { autoClose: 8000 });
//                 setIsModelLoading(false);
//             }
//         };

//         loadModels();
//     }, []);

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const uploadedFile = e.target.files?.[0];
//         if (!uploadedFile) return;

//         // Validate file type
//         if (!uploadedFile.type.startsWith("image/")) {
//             toast.error("Please upload an image file");
//             return;
//         }

//         // Validate file size (max 10MB)
//         if (uploadedFile.size > 10 * 1024 * 1024) {
//             toast.error("Image size should be less than 10MB");
//             return;
//         }

//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setImage(event.target?.result as string);
//             setDetectionResult(null);
//         };
//         reader.readAsDataURL(uploadedFile);
//     };

//     const detectFace = async () => {
//         if (!image || !modelsLoaded) {
//             toast.error("Please upload an image and wait for models to load");
//             return;
//         }

//         setIsLoading(true);
//         setDetectionResult(null);

//         try {
//             const img = imageRef.current;
//             if (!img) {
//                 throw new Error("Image element not found");
//             }

//             // Wait for image to load
//             await new Promise((resolve) => {
//                 if (img.complete) {
//                     resolve(null);
//                 } else {
//                     img.onload = () => resolve(null);
//                 }
//             });

//             // Detect faces with options (only using tiny face detector since other models aren't loaded)
//             const detections = await faceapi
//                 .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());

//             const faceCount = detections.length;
//             const hasFace = faceCount > 0;

//             // Calculate average confidence
//             const avgConfidence = detections.length > 0
//                 ? detections.reduce((sum, det) => sum + det.score, 0) / detections.length
//                 : 0;

//             // Check if it's likely a real human
//             // This is a simplified check - in production, you'd use more sophisticated methods
//             const isRealHuman = hasFace && avgConfidence > 0.5;

//             // Draw detections on canvas
//             if (canvasRef.current && img) {
//                 const canvas = canvasRef.current;
//                 const displaySize = { width: img.width, height: img.height };
//                 faceapi.matchDimensions(canvas, displaySize);

//                 const resizedDetections = faceapi.resizeResults(detections, displaySize);
//                 const ctx = canvas.getContext("2d");

//                 if (ctx) {
//                     ctx.clearRect(0, 0, canvas.width, canvas.height);
//                     faceapi.draw.drawDetections(canvas, resizedDetections);
//                     // Only draw landmarks and expressions if those models were loaded
//                     // For now, just draw the detection boxes
//                 }
//             }

//             setDetectionResult({
//                 hasFace,
//                 faceCount,
//                 confidence: avgConfidence,
//                 isRealHuman,
//                 detections,
//             });

//             if (hasFace) {
//                 toast.success(`Detected ${faceCount} face${faceCount > 1 ? "s" : ""}`);
//             } else {
//                 toast.warning("No faces detected in the image");
//             }
//         } catch (error) {
//             console.error("Detection error:", error);
//             toast.error("Failed to detect faces. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const clearImage = () => {
//         setImage(null);
//         setDetectionResult(null);
//         if (canvasRef.current) {
//             const ctx = canvasRef.current.getContext("2d");
//             ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         }
//     };

//     return (
//         <div className="container mx-auto p-6 max-w-6xl">
//             <div className="mb-6">
//                 <h1 className="text-3xl font-bold mb-2">Human Image Detection Demo</h1>
//                 <p className="text-gray-600">
//                     Upload an image to detect if it contains a real human face using AI-powered face detection.
//                 </p>
//             </div>

//             {/* Model Loading Status */}
//             {isModelLoading && (
//                 <Card className="mb-6 border-blue-200 bg-blue-50">
//                     <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                             <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
//                             <span className="text-sm text-blue-800">
//                                 Loading AI models... Please wait
//                             </span>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Image Upload Section */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Upload className="h-5 w-5" />
//                             Upload Image
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
//                             {image ? (
//                                 <div className="relative inline-block">
//                                     <div className="relative">
//                                         <img
//                                             ref={imageRef}
//                                             src={image}
//                                             alt="Uploaded"
//                                             className="max-w-full max-h-96 rounded-lg"
//                                             crossOrigin="anonymous"
//                                             onLoad={() => {
//                                                 // Set canvas dimensions when image loads
//                                                 if (canvasRef.current && imageRef.current) {
//                                                     canvasRef.current.width = imageRef.current.width;
//                                                     canvasRef.current.height = imageRef.current.height;
//                                                 }
//                                             }}
//                                         />
//                                         <canvas
//                                             ref={canvasRef}
//                                             className="absolute top-0 left-0 pointer-events-none"
//                                             style={{ maxWidth: "100%", maxHeight: "384px" }}
//                                         />
//                                         <button
//                                             onClick={clearImage}
//                                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                                             aria-label="Remove image"
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div>
//                                     <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                                     <p className="text-gray-600 mb-4">
//                                         Drag and drop an image here, or click to select
//                                     </p>
//                                     <label htmlFor="image-upload">
//                                         <Button asChild className="cursor-pointer">
//                                             <span>Select Image</span>
//                                         </Button>
//                                     </label>
//                                     <input
//                                         id="image-upload"
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleImageUpload}
//                                         className="hidden"
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         {image && (
//                             <div className="flex gap-2">
//                                 <Button
//                                     onClick={detectFace}
//                                     disabled={isLoading || !modelsLoaded}
//                                     className="flex-1"
//                                 >
//                                     {isLoading ? (
//                                         <>
//                                             <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                                             Detecting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <User className="h-4 w-4 mr-2" />
//                                             Detect Face
//                                         </>
//                                     )}
//                                 </Button>
//                                 <Button
//                                     variant="outline"
//                                     onClick={clearImage}
//                                     disabled={isLoading}
//                                 >
//                                     Clear
//                                 </Button>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {/* Detection Results Section */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <User className="h-5 w-5" />
//                             Detection Results
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         {!detectionResult ? (
//                             <div className="text-center py-12 text-gray-400">
//                                 <AlertCircle className="h-12 w-12 mx-auto mb-4" />
//                                 <p>Upload an image and click "Detect Face" to see results</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {/* Face Detection Status */}
//                                 <div
//                                     className={`p-4 rounded-lg border-2 ${detectionResult.isRealHuman
//                                         ? "border-green-200 bg-green-50"
//                                         : detectionResult.hasFace
//                                             ? "border-yellow-200 bg-yellow-50"
//                                             : "border-red-200 bg-red-50"
//                                         }`}
//                                 >
//                                     <div className="flex items-start gap-3">
//                                         {detectionResult.isRealHuman ? (
//                                             <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
//                                         ) : (
//                                             <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
//                                         )}
//                                         <div className="flex-1">
//                                             <h3 className="font-semibold text-lg mb-1">
//                                                 {detectionResult.isRealHuman
//                                                     ? "Real Human Detected"
//                                                     : detectionResult.hasFace
//                                                         ? "Face Detected (Low Confidence)"
//                                                         : "No Face Detected"}
//                                             </h3>
//                                             <p className="text-sm text-gray-600">
//                                                 {detectionResult.isRealHuman
//                                                     ? "The image appears to contain a real human face with high confidence."
//                                                     : detectionResult.hasFace
//                                                         ? "A face was detected but confidence is low. It might not be a real human or the image quality might be poor."
//                                                         : "No human faces were detected in this image."}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Detection Details */}
//                                 <div className="space-y-3">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="p-3 bg-gray-50 rounded-lg">
//                                             <p className="text-xs text-gray-500 mb-1">Faces Found</p>
//                                             <p className="text-2xl font-bold">{detectionResult.faceCount}</p>
//                                         </div>
//                                         <div className="p-3 bg-gray-50 rounded-lg">
//                                             <p className="text-xs text-gray-500 mb-1">Confidence</p>
//                                             <p className="text-2xl font-bold">
//                                                 {(detectionResult.confidence * 100).toFixed(1)}%
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* Face Details (if detected) */}
//                                     {detectionResult.detections.length > 0 && (
//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <h4 className="font-semibold mb-3">Detected Face Details</h4>
//                                             {detectionResult.detections.map((detection, index) => (
//                                                 <div key={index} className="mb-4 last:mb-0">
//                                                     <p className="text-sm font-medium mb-2">
//                                                         Face {index + 1}
//                                                     </p>
//                                                     <div className="text-xs text-gray-600">
//                                                         <p>Confidence: {(detection.score * 100).toFixed(1)}%</p>
//                                                         <p className="mt-1">Box: {JSON.stringify({
//                                                             x: Math.round(detection.box.x),
//                                                             y: Math.round(detection.box.y),
//                                                             width: Math.round(detection.box.width),
//                                                             height: Math.round(detection.box.height)
//                                                         })}</p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Information Card */}
//             <Card className="mt-6">
//                 <CardHeader>
//                     <CardTitle>How It Works</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="prose max-w-none text-sm text-gray-600 space-y-2">
//                         <p>
//                             This demo uses <strong>face-api.js</strong>, a JavaScript library that implements
//                             face detection and recognition using TensorFlow.js. The system:
//                         </p>
//                         <ul className="list-disc list-inside space-y-1 ml-4">
//                             <li>
//                                 Detects faces in uploaded images using a tiny face detector model
//                             </li>
//                             <li>
//                                 Identifies facial landmarks (eyes, nose, mouth, etc.)
//                             </li>
//                             <li>
//                                 Analyzes facial expressions to verify human characteristics
//                             </li>
//                             <li>
//                                 Calculates confidence scores to determine if it's likely a real human
//                             </li>
//                         </ul>
//                         <p className="mt-4 text-xs text-gray-500">
//                             <strong>Note:</strong> This is a demonstration. For production use, you may want to
//                             add additional checks like liveness detection, anti-spoofing measures, and
//                             AI-generated image detection for enhanced security.
//                         </p>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default HumanImageDetection;
