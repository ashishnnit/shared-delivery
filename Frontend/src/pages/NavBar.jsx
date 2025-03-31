import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, FileText, Plus, MessageCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully ho gya");
      closeDropdown();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleMessengerClick = () => {
    navigate("/chatPage");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-purple-600">
          SharedDelivery
        </Link>

        <div className="flex items-center gap-4">
          {/* User Icon and Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <User className="h-6 w-6 text-blue-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                <ul className="py-2">
                  <li>
                    <Link
                      to="/createPost"
                      onClick={closeDropdown}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Post
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/myPosts"
                      onClick={closeDropdown}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Show My Posts
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Messenger Button (Far Right) */}
          <button
            onClick={handleMessengerClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <MessageCircle className="h-6 w-6 text-blue-500" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
