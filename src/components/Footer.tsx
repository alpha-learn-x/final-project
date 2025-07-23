
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h3 className="text-2xl font-bold">TinkerAlpha</h3>
            </div>
            <p className="text-blue-100 mb-4">
              Making electronics learning fun and interactive for kids worldwide!
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 hover:text-blue-300 cursor-pointer" />
              <Twitter className="h-6 w-6 hover:text-blue-300 cursor-pointer" />
              <Instagram className="h-6 w-6 hover:text-blue-300 cursor-pointer" />
              <Youtube className="h-6 w-6 hover:text-blue-300 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/activities" className="text-blue-100 hover:text-white">Activities</a></li>
              <li><a href="/subjects" className="text-blue-100 hover:text-white">Subjects</a></li>
              <li><a href="/dashboard" className="text-blue-100 hover:text-white">Dashboard</a></li>
              <li><a href="/certificates" className="text-blue-100 hover:text-white">Certificates</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-blue-100 hover:text-white">Help Center</a></li>
              <li><a href="/register" className="text-blue-100 hover:text-white">Registration</a></li>
              <li><a href="/signin" className="text-blue-100 hover:text-white">Sign In</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-blue-100">tinkalpha@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-blue-100">+94712345677</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-blue-100">Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-400 mt-8 pt-8 text-center">
          <p className="text-blue-100">
            © 2025 TinkerAlpha Learning Academy. All rights reserved. 
            Made by Group 17 🤍
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
