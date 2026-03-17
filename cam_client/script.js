// Initialize the camera
async function initCamera(videoElementId) {
    const video = document.getElementById(videoElementId);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access the camera. Please make sure you have granted permission.');
    }
}

// Capture image from video
function captureImage(videoElementId, canvasElementId, previewElementId) {
    const video = document.getElementById(videoElementId);
    const canvas = document.getElementById(canvasElementId);
    const preview = document.getElementById(previewElementId);
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image for preview
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    preview.src = imageDataUrl;
}

// Stop the camera stream
function stopCamera(videoElementId) {
    const video = document.getElementById(videoElementId);
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}