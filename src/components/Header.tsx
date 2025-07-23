import {
    Home,
    BookOpen,
    Target,
    Award,
    HelpCircle,
    Globe,
    ShoppingCart,
    Volume2,
    VolumeX,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Header = () => {
    const [language, setLanguage] = useState("english");
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Note: Using in-memory storage instead of localStorage for Claude.ai compatibility
        navigate('/signin');
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
    };

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navLinks = [
        { to: "/", label: "Home", icon: Home, active: true },
        { to: "/subjects", label: "Subjects", icon: BookOpen },
        { to: "/activities", label: "Activities", icon: Target },
        { to: "/dashboard", label: "Dashboard", icon: BookOpen },
        { to: "/certificates", label: "Certificates", icon: Award },
        { to: "/help", label: "Help", icon: HelpCircle },
        { to: "/game-context", label: "Modality", icon: Target },
    ];

    return (
        <nav className="bg-white shadow-lg border-b-4 border-blue-400 relative">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl md:text-2xl font-bold text-blue-600">
                            TinkerAlpha ⚡
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                        {navLinks.map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
                                        link.active
                                            ? "text-blue-800 font-bold bg-blue-50 border-b-2 border-blue-400"
                                            : "text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold"
                                    }`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    <span className="text-sm">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                        {/* Register Button - Hidden on small screens */}

                        {/* Language Selector - Hidden on small screens */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-24 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="sinhala">Sinhala</SelectItem>
                                    <SelectItem value="tamil">Tamil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sound Toggle - Hidden on small screens */}
                        <Button
                            onClick={toggleSound}
                            variant="outline"
                            size="icon"
                            className="hidden md:flex border-2 border-blue-500 text-blue-600 hover:bg-blue-50 w-10 h-10"
                        >
                            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>

                        <Button
                            asChild
                            className="hidden md:flex bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2"
                        >
                            <Link to="/register">Register Now</Link>
                        </Button>

                        {/* Cart Button */}
                        <Button
                            asChild
                            className="bg-green-500 hover:bg-green-600 text-white  p-2 md:px-4 md:py-2"
                        >
                            <Link to="/cart" className="flex items-center">
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden md:inline md:ml-2 text-sm">Cart</span>
                            </Link>
                        </Button>

                        {/* Logout Button - Hidden on small screens */}
                        <Button
                            onClick={handleLogout}
                            className="hidden md:flex bg-red-500 hover:bg-red-600 text-white  px-4 py-2"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span className="text-sm">Logout</span>
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            onClick={toggleMobileMenu}
                            variant="outline"
                            size="icon"
                            className="lg:hidden border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-3 mt-4">
                            {/* Mobile Navigation Links */}
                            {navLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                                            link.active
                                                ? "text-blue-800 font-bold bg-blue-50 border-l-4 border-blue-400"
                                                : "text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold"
                                        }`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Mobile Controls */}
                            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                                {/* Register Button */}
                                <Button
                                    asChild
                                    className="bg-green-500 hover:bg-green-600 text-white rounded-full justify-start"
                                >
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        Register Now
                                    </Link>
                                </Button>

                                {/* Language Selector */}
                                <div className="flex items-center space-x-3 px-3 py-2">
                                    <Globe className="h-5 w-5 text-blue-600" />
                                    <Select value={language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="sinhala">Sinhala</SelectItem>
                                            <SelectItem value="tamil">Tamil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sound Toggle */}
                                <Button
                                    onClick={toggleSound}
                                    variant="outline"
                                    className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 justify-start"
                                >
                                    {isSoundEnabled ? <Volume2 className="h-4 w-4 mr-3" /> : <VolumeX className="h-4 w-4 mr-3" />}
                                    {isSoundEnabled ? "Sound On" : "Sound Off"}
                                </Button>

                                {/* Logout Button */}
                                <Button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full justify-start"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
