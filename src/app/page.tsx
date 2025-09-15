import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            imageSrc="/shoes/shoe-1.jpg"
            imageAlt="Nike AF1"
            title="Nike Air Force 1 Mid '07"
            subtitle="Men's Shoes"
            meta="6 Colour"
            price={98.3}
            badge={{ label: "Best Seller", tone: "warning" }}
          />
          <Card
            imageSrc="/shoes/shoe-3.webp"
            imageAlt="Nike Shoe"
            title="Nike Pegasus 41"
            subtitle="Men's Shoes"
            meta="3 Colour"
            price={129.99}
          />
          <Card
            imageSrc="/shoes/shoe-5.avif"
            imageAlt="Nike Shoe"
            title="Nike Metcon 9"
            subtitle="Training"
            meta="5 Colour"
            price={139.99}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
