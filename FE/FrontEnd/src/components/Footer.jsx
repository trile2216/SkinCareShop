import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { SiAmericanexpress, SiMastercard, SiVisa } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">About Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/productlist" className="text-gray-600 hover:text-rose-500">
                  Product
                </a>
              </li>
              <li>
                <a href="/sale" className="text-gray-600 hover:text-rose-500">
                  Sale  
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-rose-500">
                  Blog  
                </a>
              </li>
              <li>
                <a href="/skinquiz" className="text-gray-600 hover:text-rose-500">
                  Quiz Skin Type
                </a>
              </li>
            </ul>
          </div>

          {/* Google Maps */}
          <div>
            <div className="w-full h-50 rounded-lg overflow-hidden shadow-md">
              <iframe
                src={`https://www.google.com/maps?q=10.87522862760165, 106.8005141278462&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 Fesh Face. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <SiVisa className="text-gray-400 w-8 h-8" />
              <SiMastercard className="text-gray-400 w-8 h-8" />
              <SiAmericanexpress className="text-gray-400 w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
