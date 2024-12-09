import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero bg-blue-600 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Welcome to Task Vault</h1>
          <p className="mt-4 text-lg">
            Simplify task management for teams, admins, and moderators with 
            <span className="font-semibold">Task Vault</span>. Collaborate seamlessly!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center">Why Choose Task Vault?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="feature-card bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">For Users</h3>
              <p>Manage your tasks effectively and stay on top of deadlines.</p>
            </div>
            <div className="feature-card bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">For Moderators</h3>
              <p>Moderate and oversee tasks assigned to your team efficiently.</p>
            </div>
            <div className="feature-card bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">For Admins</h3>
              <p>Track overall progress and manage roles effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="testimonial bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-700 italic">
                "Task Vault has completely transformed the way our team works. It's simple and effective!"
              </p>
              <p className="text-gray-500 mt-4">- John Doe, Team Manager</p>
            </div>
            <div className="testimonial bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-700 italic">
                "As an admin, I love how easy it is to monitor tasks and assign roles."
              </p>
              <p className="text-gray-500 mt-4">- Jane Smith, Admin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta bg-blue-600 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">
            Sign up today and take your task management to the next level!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-100"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-800"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
