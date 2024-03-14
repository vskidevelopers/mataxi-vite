import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-5 ">
      <div className="container mx-auto flex justify-center space-x-6 w-full">
        <a href="#" className="text-white hover:underline">
          About Us
        </a>
        <a href="#" className="text-white hover:underline">
          Contact Us
        </a>
        <a href="#" className="text-white hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="text-white hover:underline">
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
}
