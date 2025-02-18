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
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-rose-500">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Subscribe for exclusive offers and updates
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:border-teal-950"
                />
                <button className="px-6 py-2 bg-rose-500 text-white rounded-r-lg hover:bg-rose-600">
                  <FiMail size={20} />
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rose-500">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500">
                <FaLinkedinIn size={20} />
              </a>
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
