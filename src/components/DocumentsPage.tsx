import React, { useState, useEffect } from 'react';

interface DocumentLink {
  id: string;
  title: string;
  url: string;
  description: string;
  domain: string;
  addedDate: Date;
}

interface UploadedFile {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'pdf' | 'link';
  url: string;
  file?: File;
  thumbnail?: string;
  size?: string;
  uploadDate: Date;
}

interface DocumentsPageProps {
  onSelectProvince?: (provinceId: string) => void;
  onNavigateToDakLakOld?: () => void;
  onNavigateToDakLakNew?: () => void;
  onNavigateToPhuyenOld?: () => void;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ onSelectProvince, onNavigateToDakLakOld, onNavigateToDakLakNew, onNavigateToPhuyenOld }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [uploadUrl, setUploadUrl] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const documentLinks: DocumentLink[] = [
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
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPendingFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type === 'application/pdf'
    );
    
    if (validFiles.length > 0) {
      setPendingFiles(validFiles);
    }
  };

  const handleUpload = () => {
    if (uploadType === 'file' && pendingFiles.length > 0) {
      const newFiles: UploadedFile[] = pendingFiles.map((file, index) => {
        const fileType = file.type.startsWith('image/') ? 'image' 
          : file.type.startsWith('video/') ? 'video'
          : file.type === 'application/pdf' ? 'pdf'
          : 'image';
        
        const fileUrl = URL.createObjectURL(file);
        const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';

        return {
          id: Date.now().toString() + index,
          title: uploadTitle,
          description: uploadDescription,
          type: fileType,
          url: fileUrl,
          file: file,
          thumbnail: fileUrl, // Use fileUrl for all types (image, video, pdf)
          size: fileSize,
          uploadDate: new Date()
        };
      });

      setUploadedFiles([...uploadedFiles, ...newFiles]);
    } else if (uploadType === 'link' && uploadUrl.trim()) {
      const newLink: UploadedFile = {
        id: Date.now().toString(),
        title: uploadTitle,
        description: uploadDescription,
        type: 'link',
        url: uploadUrl,
        uploadDate: new Date()
      };

      setUploadedFiles([...uploadedFiles, newLink]);
    }

    // Reset form
    setUploadTitle('');
    setUploadDescription('');
    setUploadUrl('');
    setPendingFiles([]);
    setShowUploadPopup(false);
  };

  const handlePreview = (file: UploadedFile) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  // Auto-scroll to center when popups open
  useEffect(() => {
    if (showUploadPopup || showPreview || showDeleteConfirm) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Small delay to ensure popup is rendered
      setTimeout(() => {
        const popup = document.querySelector('.upload-popup, .preview-popup, .delete-confirm-dialog') as HTMLElement;
        if (popup) {
          popup.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 150);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showUploadPopup, showPreview, showDeleteConfirm]);

  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId);
    // Close preview popup if open, then show delete confirm
    if (showPreview) {
      setShowPreview(false);
      // Small delay to let preview close before showing delete confirm
      setTimeout(() => {
        setShowDeleteConfirm(true);
      }, 100);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      setUploadedFiles(uploadedFiles.filter(f => f.id !== fileToDelete));
      if (previewFile?.id === fileToDelete) {
        setShowPreview(false);
        setPreviewFile(null);
      }
    }
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'image':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21,19V5c0,-1.1 -0.9,-2 -2,-2H5c-1.1,0 -2,0.9 -2,2v14c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2zM8.5,13.5l2.5,3.01L14.5,12l4.5,6H5l3.5,-4.5z" fill="currentColor"/>
          </svg>
        );
      case 'video':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17,10.5V7c0,-0.55 -0.45,-1 -1,-1H4c-0.55,0 -1,0.45 -1,1v10c0,0.55 0.45,1 1,1h12c0.55,0 1,-0.45 1,-1v-3.5l4,4v-11l-4,4z" fill="currentColor"/>
          </svg>
        );
      case 'pdf':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
          </svg>
        );
      case 'link':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
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
                <span className="stat-number">{documentLinks.length}</span>
                <span className="stat-label">Liên kết</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{uploadedFiles.length}</span>
                <span className="stat-label">Tải lên</span>
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
            <div className="action-card" onClick={() => onNavigateToDakLakOld?.()}>
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Đắk Lắk cũ</h3>
              <p>Tài liệu trước sáp nhập</p>
            </div>
            
            <div className="action-card" onClick={() => onNavigateToPhuyenOld?.()}>
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Phú Yên cũ</h3>
              <p>Tài liệu trước sáp nhập</p>
            </div>
            
            <div className="action-card" onClick={() => onNavigateToDakLakNew?.()}>
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

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <div className="content-section">
            <div className="section-header">
              <h2>Tài liệu đã tải lên</h2>
              <span className="section-count">{uploadedFiles.length} tài liệu</span>
            </div>
            <div className="uploaded-files-grid">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="file-card" onClick={() => handlePreview(file)}>
                  <div className="file-card-header">
                    <div className="file-type-badge">
                      {getFileIcon(file.type)}
                      <span>{file.type.toUpperCase()}</span>
                    </div>
                    <button 
                      className="file-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(file.id);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  <div className="file-preview">
                    {file.type === 'image' && file.thumbnail && (
                      <img src={file.thumbnail} alt={file.title} />
                    )}
                    {file.type === 'video' && file.thumbnail && (
                      <>
                        <video src={file.thumbnail} className="video-thumbnail" />
                        <div className="video-play-overlay">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.6)" />
                            <path d="M10,8.5v7l6,-3.5l-6,-3.5Z" fill="white"/>
                          </svg>
                        </div>
                      </>
                    )}
                    {file.type === 'pdf' && file.thumbnail && (
                      <>
                        <iframe src={file.thumbnail} className="pdf-thumbnail" title={file.title} />
                        <div className="pdf-overlay">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="white"/>
                          </svg>
                          <span className="pdf-label">PDF</span>
                        </div>
                      </>
                    )}
                    {file.type === 'link' && (
                      <div className="link-preview">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" fill="white"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <h4 className="file-title">{file.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Upload Button */}
      <button 
        className="floating-upload-btn"
        onClick={() => setShowUploadPopup(true)}
      >
        <div className="ripple-effect"></div>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" fill="currentColor"/>
        </svg>
      </button>

      {/* Upload Popup */}
      {showUploadPopup && (
        <div className="upload-popup-overlay" onClick={() => setShowUploadPopup(false)}>
          <div className="upload-popup" onClick={(e) => e.stopPropagation()}>
            <div className="upload-popup-header">
              <h3>Tải lên tài liệu</h3>
              <button 
                className="popup-close-btn"
                onClick={() => setShowUploadPopup(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <div className="upload-popup-body">
              <div className="upload-type-selector">
                <button 
                  className={`type-btn ${uploadType === 'file' ? 'active' : ''}`}
                  onClick={() => setUploadType('file')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                  </svg>
                  Tải file
                </button>
                <button 
                  className={`type-btn ${uploadType === 'link' ? 'active' : ''}`}
                  onClick={() => setUploadType('link')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" fill="currentColor"/>
                  </svg>
                  Thêm link
                </button>
              </div>

              <div className="form-group">
                <label>Tiêu đề *</label>
                <input 
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Nhập tiêu đề tài liệu"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Nhập mô tả chi tiết về tài liệu"
                  className="form-textarea"
                  rows={4}
                />
              </div>

              {uploadType === 'file' ? (
                <div className="form-group">
                  <label>Chọn file hoặc kéo thả (Ảnh, Video, PDF)</label>
                  <div 
                    className={`file-input-wrapper drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,video/*,.pdf"
                      multiple
                      className="file-input"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-input-label">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" opacity="0.3"/>
                        <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" fill="currentColor"/>
                      </svg>
                      <div className="upload-text">
                        <span className="upload-main-text">
                          {pendingFiles.length > 0 ? `${pendingFiles.length} file đã chọn` : isDragging ? 'Thả file vào đây' : 'Kéo thả file hoặc click để chọn'}
                        </span>
                        <span className="upload-sub-text">Hỗ trợ: JPG, PNG, MP4, PDF</span>
                      </div>
                    </label>
                  </div>
                  {pendingFiles.length > 0 && (
                    <div className="selected-files">
                      {pendingFiles.map((file, index) => (
                        <div key={index} className="selected-file-item">
                          <span>{file.name}</span>
                          <span className="file-size-small">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label>URL liên kết</label>
                  <input 
                    type="url"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="form-input"
                  />
                </div>
              )}

              <div className="upload-popup-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => {
                    setShowUploadPopup(false);
                    setUploadTitle('');
                    setUploadDescription('');
                    setUploadUrl('');
                    setPendingFiles([]);
                  }}
                >
                  Hủy
                </button>
                <button 
                  className="btn-upload"
                  onClick={handleUpload}
                  disabled={!uploadTitle.trim() || (uploadType === 'file' ? pendingFiles.length === 0 : !uploadUrl.trim())}
                >
                  {uploadType === 'file' ? `Tải lên (${pendingFiles.length} file)` : 'Thêm liên kết'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Popup */}
      {showPreview && previewFile && (
        <div className="preview-popup-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-popup" onClick={(e) => e.stopPropagation()}>
            <div className="preview-popup-header">
              <div className="preview-file-type">
                {getFileIcon(previewFile.type)}
                <span>{previewFile.type.toUpperCase()}</span>
              </div>
              <button 
                className="popup-close-btn"
                onClick={() => setShowPreview(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <div className="preview-popup-body">
              <div className="preview-content">
                {previewFile.type === 'image' && (
                  <img src={previewFile.url} alt={previewFile.title} className="preview-image" />
                )}
                {previewFile.type === 'video' && (
                  <video src={previewFile.url} controls className="preview-video" />
                )}
                {previewFile.type === 'pdf' && (
                  <iframe src={previewFile.url} className="preview-pdf" title={previewFile.title} />
                )}
                {previewFile.type === 'link' && (
                  <div className="preview-link">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" fill="currentColor"/>
                    </svg>
                    <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="preview-link-url">
                      {previewFile.url}
                    </a>
                  </div>
                )}
              </div>

              <div className="preview-info">
                <h3 className="preview-title">{previewFile.title}</h3>
                {previewFile.description && (
                  <p className="preview-description">{previewFile.description}</p>
                )}
                <div className="preview-meta">
                  {previewFile.size && (
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                      </svg>
                      <span>{previewFile.size}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" fill="currentColor"/>
                    </svg>
                    <span>{previewFile.uploadDate.toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="preview-actions">
                  {previewFile.type !== 'link' && previewFile.url && (
                    <a 
                      href={previewFile.url}
                      download={previewFile.file?.name || previewFile.title}
                      className="btn-download"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="currentColor"/>
                      </svg>
                      Tải xuống
                    </a>
                  )}
                  {previewFile.type === 'link' && (
                    <a 
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"/>
                      </svg>
                      Mở liên kết
                    </a>
                  )}
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteClick(previewFile.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" fill="currentColor"/>
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={handleDeleteCancel}>
          <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.</p>
            <div className="delete-confirm-actions">
              <button className="btn-cancel-delete" onClick={handleDeleteCancel}>
                Hủy
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteConfirm}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" fill="currentColor"/>
                </svg>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
