import React, { useState, useRef } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: Date;
  title: string;
  description: string;
}

interface DocumentLink {
  id: string;
  title: string;
  url: string;
  description: string;
  domain: string;
  addedDate: Date;
}

interface DocumentsPageProps {
  onSelectProvince?: (provinceId: string) => void;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ onSelectProvince }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isClosingPreview, setIsClosingPreview] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isClosingUpload, setIsClosingUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [documentLinks, setDocumentLinks] = useState<DocumentLink[]>([
    {
      id: '1',
      title: 'Thông tin 102 xã phường tỉnh Đắk Lắk',
      url: 'https://baodaklak.vn/thong-tin-102-xa-phuong-tinh-dak-lak/?gidzl=-0EVHYpfZXdw7vX0BFE67laJcKOt_OmVj42RHsMkZH2r5PmOOQc2Jxb2aKGyee8Pk4cL4cJWs2TkAkY16W',
      description: 'Danh sách chi tiết 102 xã phường của tỉnh Đắk Lắk sau sáp nhập',
      domain: 'baodaklak.vn',
      addedDate: new Date()
    },
    {
      id: '2',
      title: 'Sáp nhập tỉnh Đắk Lắk và tỉnh Phú Yên',
      url: 'https://tcnnld.vn/news/detail/68770/Sap-nhap-tinh-Dak-Lak-va-tinh-Phu-Yen-de-tro-thanh-cuc-tang-truong-moi-o-Tay-Nguyen-va-Duyen-hai-Nam-Trung-Bo.html',
      description: 'Thông tin về việc sáp nhập để trở thành cực tăng trường mới ở Tây Nguyên và Duyên hải Nam Trung Bộ',
      domain: 'tcnnld.vn',
      addedDate: new Date()
    },
    {
      id: '3',
      title: 'Sắp xếp hợp nhất Đắk Lắk - Phú Yên',
      url: 'https://xaydungchinhsach.chinhphu.vn/sap-xep-hop-nhat-dak-lak-phu-yen-du-kien-tinh-moi-co-102-don-vi-hanh-chinh-cap-xa-119250425094134778.htm',
      description: 'Dự kiến tỉnh mới có 102 đơn vị hành chính cấp xã',
      domain: 'xaydungchinhsach.chinhphu.vn',
      addedDate: new Date()
    },
    {
      id: '4',
      title: 'Danh sách các xã phường mới tỉnh Đắk Lắk sau sáp nhập',
      url: 'https://thuvienphapluat.vn/phap-luat-viec-lam/danh-sach-cac-xa-phuong-moi-tinh-dak-lak-sau-sap-nhap-kem-muc-luong-toi-thieu-vung-tu-ngay-1-7-2025-31723.html',
      description: 'Kèm mức lương tối thiểu vùng từ ngày 1/7/2025',
      domain: 'thuvienphapluat.vn',
      addedDate: new Date()
    },
    {
      id: '5',
      title: 'Sắp xếp ĐVHC: Danh sách 102 xã phường của tỉnh Đắk Lắk mới',
      url: 'https://xaydungchinhsach.chinhphu.vn/sap-xep-dvhc-danh-sach-102-xa-phuong-cua-tinh-dak-lak-moi-119250622182003769.htm',
      description: 'Chi tiết danh sách đơn vị hành chính cấp xã sau sắp xếp',
      domain: 'xaydungchinhsach.chinhphu.vn',
      addedDate: new Date()
    },
    {
      id: '6',
      title: 'Chi tiết 34 đơn vị hành chính cấp tỉnh từ 12/6/2025',
      url: 'https://xaydungchinhsach.chinhphu.vn/chi-tiet-34-don-vi-hanh-chinh-cap-tinh-tu-12-6-2025-119250612141845533.htm',
      description: 'Thông tin chi tiết về 34 đơn vị hành chính cấp tỉnh',
      domain: 'xaydungchinhsach.chinhphu.vn',
      addedDate: new Date()
    }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    
    Array.from(files).forEach((file) => {
      // Check file type
      const allowedTypes = [
        'image/', 'video/', 
        'application/pdf', 
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const isAllowed = allowedTypes.some(type => file.type.startsWith(type));
      
      if (isAllowed) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setPendingFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleConfirmUpload = () => {
    if (!uploadTitle.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    if (uploadType === 'link') {
      if (!uploadUrl.trim()) {
        alert('Vui lòng nhập URL tài liệu');
        return;
      }

      try {
        const url = new URL(uploadUrl.trim());
        const newLink: DocumentLink = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: uploadTitle.trim(),
          url: uploadUrl.trim(),
          description: uploadDescription.trim(),
          domain: url.hostname,
          addedDate: new Date()
        };

        setDocumentLinks(prev => [...prev, newLink]);
      } catch (error) {
        alert('URL không hợp lệ');
        return;
      }
    } else {
      const newFiles: UploadedFile[] = pendingFiles.map((file) => {
        const fileUrl = URL.createObjectURL(file);
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          url: fileUrl,
          uploadDate: new Date(),
          title: uploadTitle.trim(),
          description: uploadDescription.trim()
        };
      });

      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    
    // Reset form with animation
    setIsClosingUpload(true);
    setTimeout(() => {
      setPendingFiles([]);
      setShowUploadForm(false);
      setUploadTitle('');
      setUploadDescription('');
      setUploadUrl('');
      setUploadType('file');
      setIsClosingUpload(false);
    }, 400);
  };

  const handleCancelUpload = () => {
    setIsClosingUpload(true);
    setTimeout(() => {
      setPendingFiles([]);
      setShowUploadForm(false);
      setUploadTitle('');
      setUploadDescription('');
      setUploadUrl('');
      setUploadType('file');
      setIsClosingUpload(false);
    }, 400); // Match the animation duration
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
  };

  const handleDownload = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToDelete = prev.find(f => f.id === fileId);
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handlePreview = (file: UploadedFile) => {
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
      setPreviewFile(file);
      setShowPreview(true);
    }
  };

  const closePreview = () => {
    setIsClosingPreview(true);
    setTimeout(() => {
      setShowPreview(false);
      setPreviewFile(null);
      setIsClosingPreview(false);
    }, 400); // Match the animation duration
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
        </svg>
      );
    } else if (type.startsWith('video/')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/>
        </svg>
      );
    } else if (type === 'application/pdf') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v1h-1.5V7h3v1.5zM9 10.5h1V8.5H9v2z" fill="currentColor"/>
        </svg>
      );
    } else {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
        </svg>
      );
    }
  };

  return (
    <div className="documents-page">
      {/* Hero Section */}
      <div className="documents-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Trung tâm Tư liệu</h1>
            <p>Kho lưu trữ tài liệu, hình ảnh và video về lịch sử địa phương Đắk Lắk - Phú Yên</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{uploadedFiles.length}</span>
                <span className="stat-label">Tài liệu</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{documentLinks.length}</span>
                <span className="stat-label">Liên kết</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Tư liệu nổi bật</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon-modern">
              <div className="document-stack">
                <div className="document-layer document-back">
                  <svg width="100" height="120" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14,2H6A2,2 0 0,0 4,4V24A2,2 0 0,0 6,26H18A2,2 0 0,0 20,24V8L14,2M18,24H6V4H13V9H18V24Z" fill="rgba(255,255,255,0.3)"/>
                  </svg>
                </div>
                <div className="document-layer document-middle">
                  <svg width="105" height="125" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14,2H6A2,2 0 0,0 4,4V24A2,2 0 0,0 6,26H18A2,2 0 0,0 20,24V8L14,2M18,24H6V4H13V9H18V24Z" fill="rgba(255,255,255,0.5)"/>
                    <path d="M8,12H16M8,14H16M8,16H13" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5"/>
                  </svg>
                </div>
                <div className="document-layer document-front">
                  <svg width="110" height="130" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14,2H6A2,2 0 0,0 4,4V24A2,2 0 0,0 6,26H18A2,2 0 0,0 20,24V8L14,2M18,24H6V4H13V9H18V24Z" fill="rgba(255,255,255,0.8)"/>
                    <path d="M8,10H16M8,12H16M8,14H16M8,16H13M8,18H14" stroke="rgba(102,126,234,0.6)" strokeWidth="0.8"/>
                    <circle cx="16" cy="20" r="2" fill="#667eea" className="floating-dot"/>
                  </svg>
                </div>
              </div>
              <div className="floating-elements">
                <div className="floating-star star-1">✦</div>
                <div className="floating-star star-2">✧</div>
                <div className="floating-star star-3">✦</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Documents */}
        <div className="quick-actions">
          <h2>Tư liệu nổi bật</h2>
          <div className="action-cards">
            <div className="action-card" onClick={() => onSelectProvince?.('daklak-old')}>
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Đắk Lắk cũ</h3>
              <p>Tài liệu trước sáp nhập</p>
            </div>
            
            <div className="action-card" onClick={() => onSelectProvince?.('phuyen-old')}>
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Phú Yên cũ</h3>
              <p>Tài liệu trước sáp nhập</p>
            </div>
            
            <div className="action-card" onClick={() => onSelectProvince?.('daklak-new')}>
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-5H18V4c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v2H9V4c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v2H4.5c-.83 0-1.5.67-1.5 1.5v1c0 .28.22.5.5.5h16c.28 0 .5-.22.5-.5v-1c0-.83-.67-1.5-1.5-1.5z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Đắk Lắk mới</h3>
              <p>Tài liệu sau sáp nhập</p>
            </div>
          </div>
        </div>

        {/* Floating Upload Button */}
        <button 
          className="floating-upload-btn"
          onClick={() => setShowUploadForm(true)}
          title="Tải lên tài liệu"
        >
          <div className="upload-icon-container">
            <div className="upload-ripple"></div>
            <div className="upload-ripple-2"></div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="upload-main-icon">
              <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" fill="currentColor"/>
            </svg>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Upload Form Popup */}
        {showUploadForm && (
          <div className={`popup-overlay ${isClosingUpload ? 'closing' : ''}`} onClick={handleCancelUpload}>
            <div className={`popup-container upload-popup ${isClosingUpload ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2>Tải lên tài liệu</h2>
                <button className="popup-close-btn" onClick={handleCancelUpload}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              
              <div className="popup-body">
                {/* Upload Type Selection */}
                <div className="upload-type-selection">
                  <div className="type-tabs">
                    <button 
                      className={`type-tab ${uploadType === 'file' ? 'active' : ''}`}
                      onClick={() => setUploadType('file')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                      </svg>
                      Tải lên file
                    </button>
                    <button 
                      className={`type-tab ${uploadType === 'link' ? 'active' : ''}`}
                      onClick={() => setUploadType('link')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" fill="currentColor"/>
                      </svg>
                      Thêm liên kết
                    </button>
                  </div>
                </div>

                {/* File Upload Area */}
                {uploadType === 'file' && (
                  <div className="upload-area-popup">
                    <div 
                      className={`upload-drop-area ${isDragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="upload-icon-large">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <h3>Kéo thả file vào đây hoặc click để chọn</h3>
                      <p>Hỗ trợ: Hình ảnh, Video, PDF, Word (.doc, .docx)</p>
                      <p>Kích thước tối đa: 100MB</p>
                    </div>
                  </div>
                )}

                {/* Link Input Area */}
                {uploadType === 'link' && (
                  <div className="link-input-area">
                    <div className="link-input-container">
                      <div className="link-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="link-input-content">
                        <h3>Thêm liên kết tài liệu</h3>
                        <p>Nhập URL của trang web hoặc tài liệu trực tuyến</p>
                        <input
                          type="url"
                          value={uploadUrl}
                          onChange={(e) => setUploadUrl(e.target.value)}
                          placeholder="https://example.com/document"
                          className="form-input url-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Files */}
                {uploadType === 'file' && pendingFiles.length > 0 && (
                  <div className="selected-files-section">
                    <h4>File đã chọn ({pendingFiles.length}):</h4>
                    <div className="selected-files-list">
                      {pendingFiles.map((file, index) => (
                        <div key={index} className="selected-file-item">
                          <div className="file-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Document Information Form */}
                <div className="document-form-section">
                  <div className="form-group">
                    <label htmlFor="upload-title">Tiêu đề tài liệu *</label>
                    <input
                      id="upload-title"
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Nhập tiêu đề cho tài liệu..."
                      className="form-input"
                      maxLength={100}
                    />
                    <span className="char-count">{uploadTitle.length}/100</span>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="upload-description">Mô tả tài liệu</label>
                    <textarea
                      id="upload-description"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Nhập mô tả chi tiết về tài liệu..."
                      className="form-textarea"
                      rows={4}
                      maxLength={500}
                    />
                    <span className="char-count">{uploadDescription.length}/500</span>
                  </div>
                </div>
              </div>
              
              <div className="popup-footer">
                <button 
                  className="btn-secondary"
                  onClick={handleCancelUpload}
                >
                  Hủy
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleConfirmUpload}
                  disabled={!uploadTitle.trim() || (uploadType === 'file' ? pendingFiles.length === 0 : !uploadUrl.trim())}
                >
                  {uploadType === 'file' ? `Tải lên (${pendingFiles.length} file)` : 'Thêm liên kết'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Links Section */}
        {documentLinks.length > 0 && (
          <div className="content-section">
            <div className="section-header">
              <h2>Tài liệu tham khảo</h2>
              <span className="section-count">{documentLinks.length} liên kết</span>
            </div>
            <div className="links-professional-grid">
              {documentLinks.map((link) => (
                <a 
                  key={link.id} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-professional-card"
                >
                  <div className="link-header">
                    <div className="link-favicon-pro">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="link-domain-pro">{link.domain}</span>
                  </div>
                  <h4 className="link-title-pro">{link.title}</h4>
                  <div className="link-footer">
                    <span className="link-type">Tài liệu tham khảo</span>
                    <div className="link-arrow-pro">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="content-section">
            <div className="section-header">
              <h2>Tài liệu đã tải lên</h2>
              <span className="section-count">{uploadedFiles.length} tài liệu</span>
            </div>
            <div className="files-professional-grid">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="file-card-modern">
                  <div className="file-card-header">
                    <div className="file-type-badge">
                      {getFileIcon(file.type)}
                      <span>{file.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                    </div>
                    <button 
                      className="delete-btn-modern"
                      onClick={() => handleDeleteFile(file.id)}
                      title="Xóa file"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="file-preview-modern" onClick={() => handlePreview(file)}>
                    {file.type.startsWith('image/') && (
                      <img src={file.url} alt={file.name} />
                    )}
                    
                    {file.type.startsWith('video/') && (
                      <>
                        <video src={file.url} />
                        <div className="video-overlay-modern">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8,5.14V19.14L19,12.14L8,5.14Z" fill="white"/>
                          </svg>
                        </div>
                      </>
                    )}
                    
                    {file.type === 'application/pdf' && (
                      <div className="pdf-preview-modern">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v1h-1.5V7h3v1.5zM9 10.5h1V8.5H9v2z" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                    
                    {!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.type !== 'application/pdf' && (
                      <div className="file-generic-preview">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="file-info-modern">
                    <h4 className="file-title">{file.title}</h4>
                    <div className="file-meta">
                      <span className="file-size">{formatFileSize(file.size)}</span>
                      <span className="file-date">{new Date(file.uploadDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <button 
                      className="download-btn-modern"
                      onClick={() => handleDownload(file)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="currentColor"/>
                      </svg>
                      Tải về
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Popup */}
        {showPreview && previewFile && (
          <div className={`popup-overlay ${isClosingPreview ? 'closing' : ''}`} onClick={closePreview}>
            <div className={`popup-container preview-popup ${isClosingPreview ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2>{previewFile.title}</h2>
                <button className="popup-close-btn" onClick={closePreview}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              
              <div className="popup-body preview-body">
                {/* Media Section - Left Side */}
                <div className="preview-media-section">
                  {previewFile.type.startsWith('image/') && (
                    <img 
                      src={previewFile.url} 
                      alt={previewFile.title}
                      className="preview-media-image"
                    />
                  )}
                  
                  {previewFile.type.startsWith('video/') && (
                    <video 
                      src={previewFile.url}
                      controls
                      className="preview-media-video"
                      autoPlay
                    />
                  )}
                  
                  {previewFile.type === 'application/pdf' && (
                    <div className="pdf-viewer-container">
                      <embed 
                        src={previewFile.url}
                        type="application/pdf"
                        className="preview-pdf-embed"
                        title={previewFile.title}
                      />
                      <div className="pdf-fallback">
                        <div className="pdf-fallback-content">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                          </svg>
                          <h4>Không thể hiển thị PDF</h4>
                          <p>Trình duyệt không hỗ trợ xem PDF trực tiếp</p>
                          <button 
                            className="btn-primary"
                            onClick={() => handleDownload(previewFile)}
                          >
                            Tải về để xem
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Document Info Section - Right Side */}
                <div className="preview-info-section">
                  <div className="document-info-content">
                    <div className="document-title-section">
                      <h4>Thông tin tài liệu</h4>
                      <p className="document-filename">{previewFile.title}</p>
                    </div>
                    
                    {previewFile.description && (
                      <div className="document-description">
                        <h5>Mô tả</h5>
                        <p>{previewFile.description}</p>
                      </div>
                    )}
                    
                    <div className="document-details">
                      <div className="detail-item">
                        <span className="detail-label">Kích thước</span>
                        <span className="detail-value">{formatFileSize(previewFile.size)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Ngày tải lên</span>
                        <span className="detail-value">{previewFile.uploadDate.toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="popup-footer">
                <button 
                  className="btn-primary"
                  onClick={() => handleDownload(previewFile)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="currentColor"/>
                  </svg>
                  Tải về tài liệu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
