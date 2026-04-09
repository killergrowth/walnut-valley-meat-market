import React from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import MeatGallery from '../components/landing/MeatGallery';
import LocationsCards from '../components/landing/LocationsCards';
import MapSection from '../components/landing/MapSection';
import ReviewsCarousel from '../components/landing/ReviewsCarousel';
import Footer from '../components/landing/Footer';
import PerformanceMonitor from '../components/PerformanceMonitor';

export default function LimitedTimeOffer() {
  return (
    <div className="min-h-screen bg-stone-50">
      <PerformanceMonitor />
      <Header />
      <HeroSection />
      <AboutSection />
      <MeatGallery />
      <LocationsCards />
      <MapSection />
      <ReviewsCarousel />
      <Footer />
    </div>
  );
}