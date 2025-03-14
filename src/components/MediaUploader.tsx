import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './MediaUploader.css';

const MediaUploader = () => {
    const [media, setMedia] = useState<{ file: string; file_type: string; size: number }[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    
    const s3BaseUrl = process.env.REACT_APP_S3_BASE_URL || '';
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    const token = localStorage.getItem('authToken');

    // * redirect to login if token is missing
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    // * fetch media files
    const fetchMedia = useCallback(async () => {
        if (!token) return;

        try {
            const { data } = await axios.get(`${apiBaseUrl}/media/all-media`, {
                headers: { Authorization: token },
            });

            if (data.code === 403) {
                localStorage.removeItem('authToken');
                navigate('/');
                return;
            }

            if (!data.status) {
                toast.error(data.message);
                return;
            }

            setMedia(data.data.record);
        } catch (error) {
            toast.error('Failed to fetch media!');
        }
    }, []);

    // * fetch media on component mount
    useEffect(() => {
        fetchMedia();
    }, [token, fetchMedia]);

    // * handle file upload
    const handleUpload = async () => {
        if (!file) {
            toast.error('No file selected!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);

            const { data } = await axios.post(`${apiBaseUrl}/media/upload-media`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: token || '',
                },
            });

            if (data.code === 403) {
                localStorage.removeItem('authToken');
                navigate('/');
                return;
            }

            if (!data.status) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);
            setFile(null);
            fetchMedia();
        } catch (error) {
            toast.error('Upload failed!');
        } finally {
            setUploading(false);
        }
    };

    // * category of files
    const images = media.filter(item => item.file_type.startsWith('image'));
    const videos = media.filter(item => item.file_type.startsWith('video'));

    return (
        <div className='container'>
            <h1>CultureX Media Uploader</h1>

            <div className='upload-section'>
                <label className='custom-file-upload'>
                    <input 
                        type='file' 
                        accept='image/*,video/*' 
                        onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    />
                    {file ? file.name : 'Choose File'}
                </label>

                <button onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            <h2 className="section-title">Images</h2>
            <div className='media-grid'>
                {images.length === 0 ? (
                    <p>No images found.</p>
                ) : (
                    images.map((item, index) => (
                        <div key={index} className='media-card'>
                            <img src={`${s3BaseUrl}/${item.file}`} alt='media' />
                            <span className='views'>Size: {Math.round(item.size / 1024)} KB</span>
                        </div>
                    ))
                )}
            </div>

            <h2 className="section-title">Videos</h2>
            <div className='media-grid'>
                {videos.length === 0 ? (
                    <p>No videos found.</p>
                ) : (
                    videos.map((item, index) => (
                        <div key={index} className='media-card'>
                            <video src={`${s3BaseUrl}/${item.file}`} controls></video>
                            <span className='views'>Size: {Math.round(item.size / 1024)} KB</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MediaUploader;