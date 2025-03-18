import React, { useState, useEffect } from 'react';
import { UpOutlined } from '@ant-design/icons';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Kiểm tra vị trí scroll để hiển thị/ẩn nút
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Xử lý scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <div
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 cursor-pointer z-50 bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    style={{
                        animation: 'bounce 2s infinite',
                    }}
                >
                    <UpOutlined style={{ fontSize: '24px' }} />
                </div>
            )}
            <style>
                {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
        `}
            </style>
        </>
    );
};

export default ScrollToTop; 